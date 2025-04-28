macro_rules! page_handler {
    ($page_path:expr) => {{
        || async {
            let page = match crate::TEMPLATES
                .render($page_path, &tera::Context::new())
                .map(Html)
            {
                Ok(p) => p,
                Err(e) => {
                    return (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        Json(ErrResponse {
                            error: e.to_string(),
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
                return (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(ErrResponse {
                        error: e.to_string(),
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
                return (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(ErrResponse {
                        error: e.to_string(),
                    })
                    .into_response(),
                );
            }
        };

        let page = match crate::TEMPLATES.render($page_path, &context).map(Html) {
            Ok(p) => p,
            Err(e) => {
                return (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(ErrResponse {
                        error: e.to_string(),
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
