use std::env;
use axum::{Router, routing::get, extract::{Path, State}, http::HeaderMap, Json};
use serde_json::Value;
use std::sync::Arc;
use crate::state::AppState;
use crate::services::http::make_request;
use reqwest::Method;

pub fn router(state: Arc<AppState>) -> Router {
    Router::new()
        .route("/orchestrator/posts-view/:id", get(handler))
        .with_state(state)
}

async fn handler(State(state): State<Arc<AppState>>, Path(post_id): Path<String>, headers: HeaderMap) -> Json<Value> {
    let post = make_request(
        &state.client,
        Method::GET,
        &state.posts_url,
        &format!("/posts/{}", post_id),
        None,
        Some(headers.clone())
    ).await.unwrap();

    let seller_id = post["seller_id"].as_str().unwrap_or_default();
    let is_anonymous = post["is_anonymous"].as_bool().unwrap_or(true);
    let requester_id = headers.get("X-Profile-ID").and_then(|h| h.to_str().ok()).unwrap_or("");

    let mut seller_info = serde_json::json!({"nickname": "Anónimo",
                                                    "photo": env::var("DEFAULT_IMAGE_URL").expect("DEFAULT_IMAGE_URL must be set")});

    if seller_id == requester_id {
        let purchases = make_request(
            &state.client,
            Method::GET,
            &state.purchases_url,
            &format!("/purchases/{}", post_id),
            None,
            Some(headers.clone())  // Forward the headers
        ).await.unwrap();

        seller_info = make_request(
            &state.client,
            Method::GET,
            &state.profiles_url,
            &format!("/profile/{}", seller_id),
            None,
            Some(headers.clone())  // Forward the headers
        ).await.unwrap();


        return Json(serde_json::json!({"post": post, "purchases": purchases, "seller_info": seller_info}));
    }

    if !is_anonymous {
        seller_info = make_request(
            &state.client,
            Method::GET,
            &state.profiles_url,
            &format!("/profile/{}", seller_id),
            None,
            Some(headers.clone())  // Forward the headers
        ).await.unwrap();
    }

    Json(serde_json::json!({"post": post, "seller_info": seller_info}))
}
