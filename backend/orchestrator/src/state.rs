use reqwest::Client;

#[derive(Clone)]
pub struct AppState {
    pub client: Client,
    pub profiles_url: String,
    pub posts_url: String,
    pub purchases_url: String,
    pub default_image_url: String,
}
