use axum::{Router, routing::get, extract::State, http::StatusCode, Json};
use serde_json::{Value, json};
use std::sync::Arc;
use futures::future::{join3};
use crate::state::AppState;
use crate::services::http::make_request;
use reqwest::{Method, header::HeaderMap};
use tracing::{error, info};

pub fn router(state: Arc<AppState>) -> Router {
    Router::new()
        .route("/orchestrator/profiles-view/me", get(handler))
        .with_state(state)
}

async fn handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap
) -> Result<Json<Value>, (StatusCode, String)> {
    // Fetch profile, posts, and buyer purchases concurrently
    let (profile_result, posts_result, buyer_purchases_result) = join3(
        make_request(
            &state.client,
            Method::GET,
            &state.profiles_url,
            "/profile/me",
            None,
            Some(headers.clone())
        ),
        make_request(
            &state.client,
            Method::GET,
            &state.posts_url,
            "/posts/me",
            None,
            Some(headers.clone())
        ),
        make_request(
            &state.client,
            Method::GET,
            &state.purchases_url,
            "/purchases/me?role=buyer",
            None,
            Some(headers.clone())
        )
    ).await;

    let profile = match profile_result {
        Ok(profile) => profile,
        Err(e) => {
            error!("Failed to fetch profile: {}", e);
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to fetch profile information".to_string(),
            ));
        }
    };

    let posts = posts_result.unwrap_or_else(|e| {
        error!("Failed to fetch posts: {}", e);
        json!({"posts": []})
    });

    let posts_exist = !posts.get("posts").unwrap_or(&Value::Null).is_null() &&
        !posts["posts"].as_array().unwrap_or(&Vec::new()).is_empty();

    let seller_purchases = if posts_exist {
        match make_request(
            &state.client,
            Method::GET,
            &state.purchases_url,
            "/purchases/me?role=seller",
            None,
            Some(headers.clone())
        ).await {
            Ok(result) => Some(result),
            Err(e) => {
                error!("Failed to fetch seller purchases: {}", e);
                None
            }
        }
    } else {
        None
    };

    let buyer_purchases = match buyer_purchases_result {
        Ok(result) => Some(result),
        Err(e) => {
            error!("Failed to fetch buyer purchases: {}", e);
            None
        }
    };

    info!("Profile view retrieved successfully");
    Ok(Json(json!({
        "profile": profile,
        "posts": posts,
        "purchases": {
            "buyer": buyer_purchases,
            "seller": seller_purchases,
        }
    })))
}