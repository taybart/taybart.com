use crate::{macros::page, routes::ErrResponse};
use axum::{
    Json,
    extract::Query,
    http::StatusCode,
    response::{Html, IntoResponse, Redirect},
};
use serde::{Deserialize, Serialize};
use tracing::error;

#[derive(Serialize, Deserialize, Default, Debug)]
struct Comment {
    id: i64,
    level: i64,
    user: Option<String>,
    time: i64,
    time_ago: String,
    content: String,
    comments: Vec<Comment>,
}

#[derive(Serialize, Deserialize, Default, Debug)]
struct Item {
    id: i64,
    title: Option<String>,
    points: Option<i64>,
    user: Option<String>,
    time: Option<i64>,
    time_ago: String,
    r#type: String,
    content: Option<String>,
    url: Option<String>,
    domain: Option<String>,
    comments: Option<Vec<Comment>>,
    comments_count: Option<i64>,
}

pub async fn frontpage() -> impl IntoResponse {
    let frontpage = match reqwest::get("https://api.hackerwebapp.com/news").await {
        Ok(x) => x.json::<Vec<Item>>().await.expect("deserialize frontpage"),
        Err(err) => {
            error!("sad {err}");
            return (StatusCode::INTERNAL_SERVER_ERROR, "idk".into_response());
        }
    };

    #[derive(Serialize)]
    struct Page {
        page: &'static str,
        frontpage: Vec<Item>,
    }
    page!(
        "hn/frontpage.html",
        Page {
            page: "/hn",
            frontpage,
        }
    )
}

#[derive(Deserialize)]
pub struct ItemQuery {
    pub id: Option<String>,
}
pub async fn item(query: Query<ItemQuery>) -> impl IntoResponse {
    // TODO: add cache
    let Some(id) = query.id.clone() else {
        return (StatusCode::SEE_OTHER, Redirect::to("/hn").into_response());
    };
    let item = match reqwest::get(format!("https://api.hackerwebapp.com/item/{id}")).await {
        Ok(x) => {
            if !x.status().is_success() {
                error!("bad response from api {}", x.status());
                return (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "bad response from api".into_response(),
                );
            }
            x.json::<Item>().await.expect("deserialize json")
        }
        Err(err) => {
            error!("sad {err}");
            return (StatusCode::INTERNAL_SERVER_ERROR, "idk".into_response());
        }
    };

    #[derive(Serialize)]
    struct Page {
        page: &'static str,
        item: Item,
    }
    page!("hn/item.html", Page { page: "/hn", item })
}
