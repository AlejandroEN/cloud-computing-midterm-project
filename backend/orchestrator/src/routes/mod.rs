pub mod profiles_view;
pub mod make_review;
pub mod posts_view;

use axum::{Router, routing::{get}};
use std::sync::Arc;
use crate::state::AppState;

pub fn routes(state: Arc<AppState>) -> Router {
    Router::new()
        .merge(posts_view::router(state.clone()))
        .merge(profiles_view::router(state.clone()))
        .merge(make_review::router(state.clone()))
        .route("/health", get(health::handler))
}

mod health {
    use axum::{Json, http::StatusCode};
    use serde_json::{json, Value};
    use std::time::{SystemTime, UNIX_EPOCH};

    pub async fn handler() -> Result<Json<Value>, StatusCode> {
        let uptime = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_secs();

        Ok(Json(json!({
            "status": "ok",
            "version": env!("CARGO_PKG_VERSION"),
            "uptime_seconds": uptime,
        })))
    }
}