mod db;
mod macros;
mod routes;

use anyhow::Result;
use axum::http::Method;
use axum_login::{
    AuthManagerLayerBuilder,
    tower_sessions::{ExpiredDeletion, Expiry, SessionManagerLayer, cookie::time::Duration},
};
use include_dir::include_dir;
use lazy_static::lazy_static;
use std::{net::SocketAddr, sync::Arc};
use tera::Tera;
use tokio::{self, signal, task::AbortHandle};
use tower_http::{
    cors::CorsLayer,
    trace::{DefaultMakeSpan, TraceLayer},
};
use tower_sessions_sqlx_store::SqliteStore;

static EMBED_TEMPLATES: include_dir::Dir = include_dir!("templates");
lazy_static! {
    pub static ref TEMPLATES: Tera = {
        let mut tera = Tera::default();
        let mut templates = vec![];
        for entry in EMBED_TEMPLATES.find("**/*.html").unwrap() {
            let file = entry.as_file().unwrap();
            let name = file.path().to_str().unwrap();
            let content = file.contents_utf8().unwrap();
            templates.push((name, content));
        }
        tera.add_raw_templates(templates).expect("templates");
        tera
    };
}

pub struct AppState {}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt()
        // .with_max_level(tracing::Level::DEBUG)
        .init();

    // let pool = if ONE_SHOT {
    //     sqlx::SqlitePool::connect("sqlite::memory:").await?
    // } else {
    //     SqlitePool::connect_with(
    //         SqliteConnectOptions::new()
    //             .filename("app.db")
    //             .create_if_missing(true),
    //     )
    //     .await?
    // };
    let pool = sqlx::SqlitePool::connect("sqlite::memory:").await?;
    sqlx::migrate!().run(&pool).await?;

    db::init_tables(&pool).await?;

    let session_store = SqliteStore::new(pool.clone());
    session_store.migrate().await?;
    let deletion_task = tokio::task::spawn(
        session_store
            .clone()
            .continuously_delete_expired(tokio::time::Duration::from_secs(60)),
    );
    // Generate a cryptographic key to sign the session cookie.
    let session_layer = SessionManagerLayer::new(session_store)
        .with_secure(false)
        .with_expiry(Expiry::OnInactivity(Duration::minutes(30)));

    let cors = CorsLayer::new().allow_methods([Method::GET, Method::POST]);

    let backend = db::auth::Backend::new(&pool);
    let auth = AuthManagerLayerBuilder::new(backend, session_layer).build();

    // build our application with a route
    let app = routes::register()
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(DefaultMakeSpan::default().include_headers(true)),
        )
        .layer(cors)
        .layer(auth)
        .with_state(Arc::new(AppState {}));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(
        listener,
        app.into_make_service_with_connect_info::<SocketAddr>(),
    )
    .with_graceful_shutdown(shutdown_signal(deletion_task.abort_handle()))
    .await?;
    deletion_task.await??;

    Ok(())
}
async fn shutdown_signal(deletion_task_abort_handle: AbortHandle) {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => { deletion_task_abort_handle.abort() },
        _ = terminate => { deletion_task_abort_handle.abort() },
    }
}
