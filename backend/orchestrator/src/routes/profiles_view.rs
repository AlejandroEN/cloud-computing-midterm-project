use axum::{Router, routing::get, extract::State, Json};
use serde_json::Value;
use std::sync::Arc;
use crate::state::AppState;
use crate::services::http::make_request;
use reqwest::{Method, header::HeaderMap};

pub fn router(state: Arc<AppState>) -> Router {
    Router::new()
        .route("/orchestrator/profiles-view/me", get(handler))
        .with_state(state)
}

async fn handler(State(state): State<Arc<AppState>>, headers: HeaderMap) -> Json<Value> {
    let profile = make_request(
        &state.client,
        Method::GET,
        &state.profiles_url,
        "/profile/me",
        None,
        Some(headers.clone())
    ).await.unwrap();

    let posts = make_request(
        &state.client,
        Method::GET,
        &state.posts_url,
        "/posts/me",
        None,
        Some(headers.clone())
    ).await.unwrap();

    let posts_exist = !posts.get("posts").unwrap_or(&Value::Null).is_null();

    let mut seller_purchases = None;

    if posts_exist {
        seller_purchases = make_request(
            &state.client,
            Method::GET,
            &state.purchases_url,
            "/purchases/me?role=seller",
            None,
            Some(headers.clone())
        ).await.ok();
    }

    let buyer_purchases = make_request(
        &state.client,
        Method::GET,
        &state.purchases_url,
        "/purchases/me?role=buyer",
        None,
        Some(headers.clone())
    ).await.ok();

    Json(serde_json::json!({
        "profile": profile,
        "posts": posts,
        "purchases": {
            "buyer": buyer_purchases,
            "seller": seller_purchases,
        }
    }))
}
