macro_rules! page_handler {
    ($page_path:expr) => {{
        || async {
            let page = match crate::TEMPLATES
                .render($page_path, &tera::Context::new())
                .map(Html)
            {
                Ok(p) => p,
                Err(e) => {
                    tracing::error!("rendering template {e}");
                    return (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        Json(ErrResponse {
                            error: "server error: template failed to render".to_string(),
                        })
                        .into_response(),
                    );
                }
            };
            (StatusCode::OK, page.into_response())
        }
    }};
}

macro_rules! page {
    ($page_path:expr) => {{
        let page = match crate::TEMPLATES
            .render($page_path, &tera::Context::new())
            .map(Html)
        {
            Ok(p) => p,
            Err(e) => {
                tracing::error!("rendering template {e}");
                return (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(ErrResponse {
                        error: "server error: template failed to render".to_string(),
                    })
                    .into_response(),
                );
            }
        };
        (StatusCode::OK, page.into_response())
    }};

    ($page_path:expr, $struct:expr) => {{
        let context = match tera::Context::from_serialize($struct) {
            Ok(c) => c,
            Err(e) => {
                tracing::error!("template context {e}");
                return (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(ErrResponse {
                        error: "server error: template failed to render".to_string(),
                    })
                    .into_response(),
                );
            }
        };

        let page = match crate::TEMPLATES.render($page_path, &context).map(Html) {
            Ok(p) => p,
            Err(e) => {
                tracing::error!("rendering template {e}");
                return (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(ErrResponse {
                        error: "server error: template failed to render".to_string(),
                    })
                    .into_response(),
                );
            }
        };
        (StatusCode::OK, page.into_response())
    }};
}

pub(crate) use page;
pub(crate) use page_handler;
