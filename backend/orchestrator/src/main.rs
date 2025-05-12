use std::sync::Arc;
use std::env;
use reqwest::Client;
use tokio::signal::ctrl_c;

use orchestrator::routes;
use orchestrator::state::AppState;

#[tokio::main]
async fn main() {
    let state = Arc::new(AppState {
        client: Client::new(),
        profiles_url: env::var("PROFILES_SERVICE_URL").expect("PROFILES_SERVICE_URL must be set"),
        posts_url: env::var("POSTS_SERVICE_URL").expect("POSTS_SERVICE_URL must be set"),
        purchases_url: env::var("PURCHASES_SERVICE_URL").expect("PURCHASES_SERVICE_URL must be set"),
        default_image_url: env::var("DEFAULT_IMAGE_URL").expect("DEFAULT_IMAGE_URL must be set")
    });

    let app = routes::routes(state);

    let addr = "0.0.0.0:4000".parse().unwrap();

    let server = Server::bind(&addr)
        .serve(app.into_make_service());

    println!("Listening on {}", addr);

    // Graceful shutdown handling
    let graceful = server.with_graceful_shutdown(async {
        ctrl_c().await.expect("Failed to listen for shutdown signal");
        println!("Received shutdown signal, shutting down...");
    });

    graceful.await.unwrap();
}
