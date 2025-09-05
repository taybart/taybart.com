
macro_rules! get {
    ($struct:ty, $url:expr) => {{
        match reqwest::get($url).await {
            Ok(x) => {
                if !x.status().is_success() {
                    tracing::error!("bad response from api {}", x.status());
                    return (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        "bad response from api".into_response(),
                    );
                }
                match x.json::<$struct>().await {
                    Ok(x) => x,
                    Err(e) => {
                        error!("deserialize: {e}");
                        <$struct>::default()
                    }
                }
            }
            Err(err) => {
                tracing::error!("getting item {err}");
                return (StatusCode::INTERNAL_SERVER_ERROR, "could not get item".into_response());
            }
        }
    }};
    ($struct:ty, $url:expr, $error:expr) => {{
        match reqwest::get($url).await {
            Ok(x) => {
                if !x.status().is_success() {
                    tracing::error!("bad response from api {} while getting {}", x.status(), $error);
                    return (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        "bad response from api".into_response(),
                    );
                }
                match x.json::<$struct>().await {
                    Ok(x) => x,
                    Err(e) => {
                        tracing::error!("deserialize {}: {}", $error, e);
                        <$struct>::default()
                    }
                }
            }
            Err(err) => {
                tracing::error!("getting {} {}", $error, err );
                return (StatusCode::INTERNAL_SERVER_ERROR, "could not get item".into_response());
            }
        }
    }};
}

pub(crate) use get;
