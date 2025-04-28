use axum::{Json, http::StatusCode, response::IntoResponse};
use serde_json::json;

pub async fn root() -> impl IntoResponse {
    (StatusCode::OK, Json(json!({"status": "ok"})))
}
