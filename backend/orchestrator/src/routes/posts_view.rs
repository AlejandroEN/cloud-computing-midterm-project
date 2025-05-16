use axum::{Router, routing::get, extract::{Path, State}, http::{HeaderMap, StatusCode}, Json};
use serde_json::{Value, json};
use std::sync::Arc;
use futures::future::join;
use crate::state::AppState;
use crate::services::http::make_request;
use reqwest::Method;
use tracing::{error, info};

pub fn router(state: Arc<AppState>) -> Router {
    Router::new()
        .route("/orchestrator/posts-view/:id", get(handler))
        .with_state(state)
}

async fn handler(
    State(state): State<Arc<AppState>>,
    Path(post_id): Path<String>,
    headers: HeaderMap
) -> Result<Json<Value>, (StatusCode, String)> {
    // Get post details
    let post = match make_request(
        &state.client,
        Method::GET,
        &state.posts_url,
        &format!("/posts/{}", post_id),
        None,
        Some(headers.clone())
    ).await {
        Ok(post) => post,
        Err(e) => {
            error!("Failed to fetch post {}: {}", post_id, e);
            return Err((StatusCode::NOT_FOUND, format!("Post not found: {}", post_id)));
        }
    };

    let seller_id = post["seller_id"].as_str().unwrap_or_default();
    let is_anonymous = post["is_anonymous"].as_bool().unwrap_or(true);
    let requester_id = headers
        .get("X-Profile-ID")
        .and_then(|h| h.to_str().ok())
        .unwrap_or("");

    if seller_id == requester_id {
        let (purchases_result, seller_info_result) = join(
            make_request(
                &state.client,
                Method::GET,
                &state.purchases_url,
                &format!("/purchases/{}", post_id),
                None,
                Some(headers.clone())
            ),
            make_request(
                &state.client,
                Method::GET,
                &state.profiles_url,
                &format!("/profile/{}", seller_id),
                None,
                Some(headers.clone())
            )
        ).await;

        let purchases = match purchases_result {
            Ok(purchases) => purchases,
            Err(e) => {
                error!("Failed to fetch purchases for post {}: {}", post_id, e);
                json!([]) // Return empty array instead of failing
            }
        };

        let seller_info = match seller_info_result {
            Ok(info) => info,
            Err(e) => {
                error!("Failed to fetch seller profile {}: {}", seller_id, e);
                json!({"nickname": "Unknown", "photo": state.default_image_url})
            }
        };

        info!("Retrieved post view with purchases for owner: {}", post_id);
        return Ok(Json(json!({
            "post": post, 
            "purchases": purchases, 
            "seller_info": seller_info
        })));
    }

    let seller_info = if !is_anonymous {
        match make_request(
            &state.client,
            Method::GET,
            &state.profiles_url,
            &format!("/profile/{}", seller_id),
            None,
            Some(headers.clone())
        ).await {
            Ok(info) => info,
            Err(e) => {
                error!("Failed to fetch seller profile {}: {}", seller_id, e);
                json!({"nickname": "Unknown", "photo": state.default_image_url})
            }
        }
    } else {
        json!({"nickname": "Anónimo", "photo": state.default_image_url})
    };

    info!("Retrieved post view for guest: {}", post_id);
    Ok(Json(json!({"post": post, "seller_info": seller_info})))
}