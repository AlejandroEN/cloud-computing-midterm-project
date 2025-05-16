use reqwest::{Client, Method};
use reqwest::header::{HeaderMap};
use serde_json::Value;

pub async fn make_request(
    client: &Client,
    method: Method,
    base_url: &str,
    path: &str,
    body: Option<Value>,
    headers: Option<HeaderMap>,
) -> reqwest::Result<Value> {
    let url = format!("{}/{}", base_url.trim_end_matches('/'), path.trim_start_matches('/'));

    let mut builder = client.request(method, url);

    if let Some(h) = headers {
        builder = builder.headers(h);
    }

    let builder = if let Some(b) = body {
        builder.json(&b)
    } else {
        builder
    };

    let res = builder.send().await?.error_for_status()?;
    res.json().await
}