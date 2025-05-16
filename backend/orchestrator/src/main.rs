use std::{env, net::SocketAddr, time::Duration, sync::Arc};
use axum::extract::Request;
use hyper::{server::conn::http2, body::Incoming, service::service_fn};
use hyper_util::rt::{TokioExecutor, TokioIo};
use tokio::{net::TcpListener, signal, sync::Semaphore, time::{sleep, timeout}};
use tracing::{info, error, debug};
use tower::Service;
use tower_http::trace::{TraceLayer, DefaultMakeSpan, DefaultOnResponse};
use tower_http::timeout::TimeoutLayer;
use tower_http::limit::RequestBodyLimitLayer;
use tower_http::compression::CompressionLayer;

use orchestrator::routes;
use orchestrator::state::AppState;

const MAX_CONNECTIONS: usize = 1000;
const GRACEFUL_SHUTDOWN_TIMEOUT: Duration = Duration::from_secs(30);
const REQUEST_TIMEOUT: Duration = Duration::from_secs(30);
const MAX_REQUEST_SIZE: usize = 5 * 1024 * 1024; // 5MB

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    tracing_subscriber::fmt::init();

    let state = Arc::new(AppState::new(
        env::var("PROFILES_SERVICE_URL").expect("PROFILES_SERVICE_URL must be set"),
        env::var("POSTS_SERVICE_URL").expect("POSTS_SERVICE_URL must be set"),
        env::var("PURCHASES_SERVICE_URL").expect("PURCHASES_SERVICE_URL must be set"),
        env::var("DEFAULT_IMAGE_URL").expect("DEFAULT_IMAGE_URL must be set"),
    ));

    let port = env::var("PORT").unwrap_or_else(|_| "4000".to_string());
    let addr: SocketAddr = format!("0.0.0.0:{}", port).parse()?;
    let listener = TcpListener::bind(addr).await?;
    info!("Listening on http://{} (HTTP/2)", addr);

    let app = routes::routes(state.clone())
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(DefaultMakeSpan::new().level(tracing::Level::INFO))
                .on_response(DefaultOnResponse::new().level(tracing::Level::INFO))
        )
        .layer(TimeoutLayer::new(REQUEST_TIMEOUT))
        .layer(RequestBodyLimitLayer::new(MAX_REQUEST_SIZE))
        .layer(CompressionLayer::new());
    
    let connection_limiter = Arc::new(Semaphore::new(MAX_CONNECTIONS));
    let (shutdown_tx, mut shutdown_rx) = tokio::sync::oneshot::channel::<()>();
    
    tokio::spawn(async move {
        let health_state = state.clone();
        let mut interval = tokio::time::interval(Duration::from_secs(60));

        loop {
            interval.tick().await;
            
            let services = vec![
                &health_state.profiles_url,
                &health_state.posts_url,
                &health_state.purchases_url,
            ];

            for service_url in services {
                match health_state.client.get(format!("{}/health", service_url))
                    .timeout(Duration::from_secs(5))
                    .send().await {
                    Ok(res) if res.status().is_success() => {
                        debug!("Health check passed for {}", service_url);
                    },
                    Ok(res) => {
                        error!("Health check failed for {}: HTTP {}", service_url, res.status());
                    },
                    Err(e) => {
                        error!("Health check failed for {}: {}", service_url, e);
                    }
                }
            }
        }
    });

    tokio::spawn(async move {
        match signal::ctrl_c().await {
            Ok(()) => {
                info!("Received shutdown signal");
                let _ = shutdown_tx.send(());
            }
            Err(err) => {
                error!("Failed to listen for shutdown signal: {}", err);
            }
        }
    });

    loop {
        let permit = tokio::select! {
            _ = &mut shutdown_rx => break,
            result = connection_limiter.clone().acquire_owned() => {
                match result {
                    Ok(permit) => permit,
                    Err(_) => {
                        error!("Semaphore closed");
                        break;
                    }
                }
            }
        };

        let (stream, addr) = match timeout(Duration::from_secs(1), listener.accept()).await {
            Ok(Ok(stream)) => stream,
            Ok(Err(e)) => {
                error!("Accept error: {}", e);
                continue;
            }
            Err(_) => continue,
        };

        debug!("New connection from: {}", addr);
        let io = TokioIo::new(stream);
        let app_clone = app.clone();

        tokio::task::spawn(async move {
            let _permit = permit;

            let svc = service_fn(move |req: Request<Incoming>| {
                let mut app = app_clone.clone();
                async move {
                    app.call(req).await
                }
            });

            let executor = TokioExecutor::new();
            let conn = http2::Builder::new(executor)
                .max_concurrent_streams(100)
                .max_frame_size(16 * 1024)
                .initial_connection_window_size(1024 * 1024) // 1MB window size
                .serve_connection(io, svc);

            if let Err(e) = conn.await {
                error!("HTTP/2 connection error: {}", e);
            }
        });
    }

    info!("Starting graceful shutdown...");
    if timeout(GRACEFUL_SHUTDOWN_TIMEOUT, async {
        while connection_limiter.available_permits() < MAX_CONNECTIONS {
            sleep(Duration::from_secs(1)).await;
            debug!("Waiting for connections to complete: {} active", 
                MAX_CONNECTIONS - connection_limiter.available_permits());
        }
    }).await.is_err() {
        error!("Graceful shutdown timeout exceeded");
    }

    info!("Server shutdown complete");
    Ok(())
}