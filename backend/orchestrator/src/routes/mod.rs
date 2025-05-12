pub mod profiles_view;
pub mod make_review;
pub mod posts_view;

use axum::Router;
use crate::state::AppState;
use std::sync::Arc;

pub fn routes(state: Arc<AppState>) -> Router {
    Router::new()
        .merge(profiles_view::router(state.clone()))
        .merge(make_review::router(state.clone()))
        .merge(posts_view::router(state))
}