use axum::{Router, routing::post, extract::{State, Json}, http::StatusCode};
use serde::Deserialize;
use serde_json::Value;
use std::sync::Arc;
use futures::future::join_all;
use crate::state::AppState;
use crate::services::http::make_request;
use reqwest::{Method, header::HeaderMap};
use tracing::{info, error};

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
) -> Result<Json<Value>, (StatusCode, String)> {
    if payload.rating > 5 {
        return Err((
            StatusCode::BAD_REQUEST,
            "Rating must be between 0 and 5".to_string(),
        ));
    }

    let review_path = format!("/reviews/{}", payload.purchase_id);
    
    let review = match make_request(
        &state.client,
        Method::POST,
        &state.purchases_url,
        &review_path,
        Some(serde_json::json!({
            "rating": payload.rating,
            "comment": payload.comment,
        })),
        Some(headers.clone())
    ).await {
        Ok(res) => res,
        Err(e) => {
            error!("Failed to create review: {}", e);
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to create review".to_string(),
            ));
        }
    };

    let post_id = review["post_id"].as_str().unwrap_or_default();
    let seller_id = review["seller_id"].as_str().unwrap_or_default();

    let post_path = format!("/posts/{}", post_id);
    let profile_path = format!("/profiles/{}", seller_id);

    let update_requests = vec![
        make_request(
            &state.client,
            Method::PATCH,
            &state.posts_url,
            &post_path,
            Some(serde_json::json!({"new_rating": payload.rating})),
            Some(headers.clone())
        ),
        make_request(
            &state.client,
            Method::PATCH,
            &state.profiles_url,
            &profile_path,
            Some(serde_json::json!({"recalculate_avg": true})),
            Some(headers.clone())
        )
    ];

    let results = join_all(update_requests).await;
    for (i, result) in results.iter().enumerate() {
        if let Err(e) = result {
            let service = if i == 0 { "posts" } else { "profiles" };
            error!("Failed to update {} service: {}", service, e);
        }
    }

    info!("Review created successfully for purchase_id: {}", payload.purchase_id);
    Ok(Json(serde_json::json!({"status": "review saved"})))
}