use axum::{Router, routing::post, extract::{State, Json}};
use serde::Deserialize;
use serde_json::Value;
use std::sync::Arc;
use crate::state::AppState;
use crate::services::http::make_request;
use reqwest::{Method, header::HeaderMap};

pub fn router(state: Arc<AppState>) -> Router {
    Router::new()
        .route("/orchestrator/make-review", post(handler))
        .with_state(state)
}

#[derive(Deserialize)]
struct ReviewPayload {
    purchase_id: String,
    rating: u8,
    comment: String,
}

async fn handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(payload): Json<ReviewPayload>
) -> Json<Value> {
    let review = make_request(
        &state.client,
        Method::POST,
        &state.purchases_url,
        &format!("/reviews/{}", payload.purchase_id),
        Some(serde_json::json!({
            "rating": payload.rating,
            "comment": payload.comment,
        })),
        Some(headers.clone())
    ).await.unwrap();

    let post_id = review["post_id"].as_str().unwrap_or_default();
    let seller_id = review["seller_id"].as_str().unwrap_or_default();

    let _ = make_request(
        &state.client,
        Method::PATCH,
        &state.posts_url,
        &format!("/posts/{}", post_id),
        Some(serde_json::json!({"new_rating": payload.rating})),
        Some(headers.clone())  // Forward the headers
    ).await;

    let _ = make_request(
        &state.client,
        Method::PATCH,
        &state.profiles_url,
        &format!("/profiles/{}", seller_id),
        Some(serde_json::json!({"recalculate_avg": true})),
        Some(headers.clone())  // Forward the headers
    ).await;

    Json(serde_json::json!({"status": "review saved"}))
}