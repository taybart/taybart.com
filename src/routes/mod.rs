mod api;
mod health_check;
mod middleware;
mod pages;

use crate::{db, macros::page_handler};
use axum::{
    Json, Router,
    http::StatusCode,
    response::{Html, IntoResponse, Redirect},
    routing::{get, post},
};
use axum_embed::ServeEmbed;
use axum_login::login_required;
use rust_embed::Embed;
use serde::Serialize;
use std::sync::Arc;
use tower_http::services::ServeFile;

#[derive(Embed, Clone)]
#[folder = "assets/"]
struct Assets;

#[derive(Serialize)]
struct ErrResponse {
    error: String,
}

fn protected_api_routes() -> Router<Arc<crate::AppState>> {
    Router::new()
        .route("/", post(api::root))
        .route_layer(login_required!(db::auth::Backend, login_url = "/login"))
}

fn protected_page_routes() -> Router<Arc<crate::AppState>> {
    Router::new()
        .route("/", get(|| async { Redirect::to("/") })) // TODO: resume page
        .route_layer(login_required!(db::auth::Backend, login_url = "/login"))
}

pub fn register() -> Router<Arc<crate::AppState>> {
    Router::new()
        .route("/hc", get(health_check::root))
        .layer(axum::middleware::from_fn(middleware::cache_control))
        .nest(
            "/api",
            Router::new()
                .route("/login", post(api::login))
                .merge(protected_api_routes()),
        )
        .merge(
            Router::new()
                .nest(
                    "/hn",
                    Router::new()
                        .route("/", get(pages::hn::frontpage))
                        .route("/item", get(pages::hn::item)),
                )
                .route("/login", get(page_handler!("login.html")))
                .merge(protected_page_routes())
                .fallback_service(ServeFile::new("assets/404.html")),
        )
        .nest_service("/assets", ServeEmbed::<Assets>::new())
}
