// use std::{error::Error, fmt};

// #[derive(Debug)]
// struct DBError {
//     details: String,
// }
// impl fmt::Display for DBError {
//     fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
//         write!(f, "{}", self.details)
//     }
// }

// impl Error for DBError {
//     fn description(&self) -> &str {
//         &self.details
//     }
// }

// impl DBError {
//     pub fn new(details: &str) -> Self {
//         Self {
//             details: details.to_string(),
//         }
//     }
// }

pub mod client;
pub use client::*;
pub mod auth;
