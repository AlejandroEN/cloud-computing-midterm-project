use reqwest::Client;
use deadpool::managed::{Manager, Object, Pool, PoolError, Metrics, RecycleResult};
use std::sync::Arc;
use std::time::Duration;

#[derive(Clone)]
pub struct AppState {
    pub client: Client,
    pub profiles_url: String,
    pub posts_url: String,
    pub purchases_url: String,
    pub default_image_url: String,
    pub connection_pool: Arc<Pool<ClientManager>>,
}

pub struct ClientManager {
    // Store a template client instead of a builder
    template_client: Client,
}

impl ClientManager {
    pub fn new() -> Self {
        let template_client = Client::builder()
            .timeout(Duration::from_secs(10))
            .connect_timeout(Duration::from_secs(3))
            .pool_max_idle_per_host(20)
            .pool_idle_timeout(Some(Duration::from_secs(30)))
            .tcp_keepalive(Some(Duration::from_secs(60)))
            .build()
            .expect("Failed to build template HTTP client");

        Self { template_client }
    }
}

impl Manager for ClientManager {
    type Type = Client;
    type Error = reqwest::Error;

    async fn create(&self) -> Result<Self::Type, Self::Error> {
        Ok(self.template_client.clone())
    }

    async fn recycle(&self, _client: &mut Client, _metrics: &Metrics) -> RecycleResult<Self::Error> {
        Ok(())
    }
}

impl AppState {
    pub fn new(
        profiles_url: String,
        posts_url: String,
        purchases_url: String,
        default_image_url: String,
    ) -> Self {
        let client = Client::builder()
            .timeout(Duration::from_secs(10))
            .connect_timeout(Duration::from_secs(3))
            .pool_max_idle_per_host(20)
            .build()
            .expect("Failed to build HTTP client");

        let manager = ClientManager::new();
        let pool = Pool::builder(manager)
            .max_size(100)
            .build()
            .expect("Failed to build connection pool");

        Self {
            client,
            profiles_url,
            posts_url,
            purchases_url,
            default_image_url,
            connection_pool: Arc::new(pool),
        }
    }

    pub async fn get_client(&self) -> Result<Object<ClientManager>, PoolError<reqwest::Error>> {
        self.connection_pool.get().await
    }
}
