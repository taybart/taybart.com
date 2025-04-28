use crate::db::auth;
use axum::{
    Form,
    http::StatusCode,
    response::{IntoResponse, Redirect},
};

pub async fn root() -> impl IntoResponse {
    StatusCode::OK
}

pub async fn login(
    mut auth_session: auth::AuthSession,
    Form(creds): Form<auth::Credentials>,
) -> impl IntoResponse {
    let user = match auth_session.authenticate(creds.clone()).await {
        Ok(Some(user)) => user,
        Ok(None) => return StatusCode::UNAUTHORIZED.into_response(),
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    };

    if auth_session.login(&user).await.is_err() {
        return StatusCode::INTERNAL_SERVER_ERROR.into_response();
    }

    Redirect::to("/upload").into_response()
}
