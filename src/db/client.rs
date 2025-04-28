use sqlx::{Pool, Sqlite};

pub async fn init_tables(db: &Pool<Sqlite>) -> Result<(), sqlx::Error> {
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                username TEXT,
                password TEXT
            )",
    )
    .execute(db)
    .await?;
    Ok(())
}
