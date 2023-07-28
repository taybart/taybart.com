use leptos::Serializable;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, PartialEq, Eq, Clone)]
#[serde(transparent)]
pub struct FrontPage {
    pub stories: Vec<Story>,
}

#[derive(Debug, Deserialize, Serialize, PartialEq, Eq, Clone)]
pub struct Story {
    pub id: usize,
    pub title: String,
    pub points: Option<i32>,
    pub user: Option<String>,
    pub time: usize,
    pub time_ago: String,
    #[serde(alias = "type")]
    pub story_type: String,
    pub url: String,
    pub content: Option<String>,
    #[serde(default)]
    pub domain: String,
    #[serde(default)]
    pub comments: Option<Vec<Comment>>,
    pub comments_count: Option<usize>,
}

#[derive(Debug, Deserialize, Serialize, PartialEq, Eq, Clone)]
pub struct Comment {
    pub id: usize,
    pub level: usize,
    pub user: Option<String>,
    pub time: usize,
    pub time_ago: String,
    pub content: Option<String>,
    pub comments: Vec<Comment>,
}

#[allow(dead_code)]
pub async fn get_item(id: &str) -> Option<Story> {
    let json = reqwest::get(format!("https://api.hackerwebapp.com/item/{id}"))
        .await
        .map_err(|e| log::error!("{e}"))
        .ok()?
        .text()
        .await
        .ok()?;
    Story::de(&json).map_err(|e| log::error!("{e}")).ok()
}

#[allow(dead_code)]
pub async fn get_front_page() -> Option<FrontPage> {
    let json = reqwest::get("https://api.hackerwebapp.com/news")
        .await
        .map_err(|e| log::error!("{e}"))
        .ok()?
        .text()
        .await
        .ok()?;
    FrontPage::de(&json).map_err(|e| log::error!("{e}")).ok()
}
