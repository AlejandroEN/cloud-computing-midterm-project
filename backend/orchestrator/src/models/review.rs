use serde::Deserialize;

#[derive(Deserialize)]
pub struct ReviewPayload {
    pub purchase_id: String,
    pub rating: u8,
    pub comment: String,
}
