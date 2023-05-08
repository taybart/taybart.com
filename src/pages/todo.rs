use leptos::*;
use leptos_meta::*;
use leptos_router::*;
use std::iter::Iterator;
use cfg_if::cfg_if;
use serde::{Deserialize, Serialize};

const API_DELAY: u64 = 0;

cfg_if! {
    if #[cfg(feature = "ssr")] {
        use sqlx::{Connection, SqliteConnection};

        pub async fn db() -> Result<SqliteConnection, ServerFnError> {
            Ok(SqliteConnection::connect("sqlite:todos.db").await.map_err(|e| ServerFnError::ServerError(e.to_string()))?)
        }

        #[allow(dead_code)] // trick rust analyzer into not complaining about this
        pub fn register_server_functions() {
            log!("registering server functions");
            _ = GetTodos::register();
            _ = AddTodo::register().expect("register AddTodo");
            _ = DeleteTodo::register();
        }

        #[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, sqlx::FromRow)]
        pub struct Todo {
            id: u16,
            title: String,
            completed: bool,
        }
    } else {
        #[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
        pub struct Todo {
            id: u16,
            title: String,
            completed: bool,
        }
    }
}

#[server(GetTodos, "/api")]
// trick rust analyzer into not complaining about unused vars
pub async fn get_todos(_cx: Scope) -> Result<Vec<Todo>, ServerFnError> {
    // this is just an example of how to access server context injected in the handlers
    let req = use_context::<actix_web::HttpRequest>(_cx);

    if let Some(req) = req {
        println!("req.path = {:#?}", req.path());
    }

    std::thread::sleep(std::time::Duration::from_millis(API_DELAY));

    use futures::TryStreamExt;

    let mut conn = db().await?;

    let mut todos = Vec::new();
    let mut rows = sqlx::query_as::<_, Todo>("SELECT * FROM todos").fetch(&mut conn);
    // fix try_next issue
    while let Some(row) = rows
        .try_next()
        .await
        .map_err(|e| ServerFnError::ServerError(e.to_string()))?
    {
        todos.push(row);
    }

    Ok(todos)
}
// This is an example of leptos's server functions using an alternative CBOR encoding. Both the function arguments being sent
// to the server and the server response will be encoded with CBOR. Good for binary data that doesn't encode well via the default methods
#[server(AddTodo, "/api", "Cbor")]
pub async fn add_todo(title: String) -> Result<(), ServerFnError> {
    let mut conn = db().await?;

    std::thread::sleep(std::time::Duration::from_millis(API_DELAY));

    match sqlx::query("INSERT INTO todos (title, completed) VALUES ($1, false)")
        .bind(title)
        .execute(&mut conn)
        .await
    {
        Ok(_row) => Ok(()),
        Err(e) => Err(ServerFnError::ServerError(e.to_string())),
    }
}

#[server(DeleteTodo, "/api")]
pub async fn delete_todo(id: u16) -> Result<(), ServerFnError> {
    let mut conn = db().await?;

    std::thread::sleep(std::time::Duration::from_millis(API_DELAY));

    sqlx::query("DELETE FROM todos WHERE id = $1")
        .bind(id)
        .execute(&mut conn)
        .await
        .map(|_| ())
        .map_err(|e| ServerFnError::ServerError(e.to_string()))
}
#[component]
pub fn Todos(cx: Scope) -> impl IntoView {
    if use_context::<MetaContext>(cx).is_none() {
        provide_context(cx, MetaContext::new());
    };
    let add_todo = create_server_multi_action::<AddTodo>(cx);
    let delete_todo = create_server_action::<DeleteTodo>(cx);
    let submissions = add_todo.submissions();

    // list of todos is loaded from the server in reaction to changes
    let todos = create_resource(
        cx,
        move || (add_todo.version().get(), delete_todo.version().get()),
        move |_| get_todos(cx),
    );

    let pending_todos = move || {
        submissions
            .get()
            .into_iter()
            .filter(|submission| submission.pending().get())
            .map(|submission| {
                view! {
                    cx,
                    <li class="pending">{
                        move || submission.input.get().map(|data| data.title)
                    }</li>
                }
            })
            .collect::<Vec<_>>()
    };
    let existing_todos = {
        move || {
            todos
                .read(cx)
                .map(move |todos| match todos {
                    Err(e) => {
                        view! { cx, <pre class="error">"Server Error: " {e.to_string()}</pre>}
                            .into_view(cx)
                    }
                    Ok(todos) => {
                        if todos.is_empty() {
                            view! { cx, <p>"No tasks were found."</p> }.into_view(cx)
                        } else {
                            todos
                                .into_iter()
                                .map(move |todo| {
                                    view! { cx, 
                                        <li class="flex flex-row justify-center w-full">
                                            {todo.title}
                                            <ActionForm action=delete_todo class="flex justify-between">
                                                <input type="hidden" name="id" value={todo.id}/>
                                                <input
                                                    type="submit"
                                                    value="X"
                                                    class="bg-amber-600 hover:bg-sky-700 ml-2 px-2 py-1 text-white rounded-lg"
                                                />
                                            </ActionForm>
                                        </li>
                                    }
                                })
                                .collect::<Vec<_>>()
                                .into_view(cx)
                        }
                    }
                })
                .unwrap_or_default()
        }
    };

    view! {
        cx,
        <main class="pt-8">
        <h1>"Todo List"</h1>
            <MultiActionForm
                action=add_todo
                // class="w-[500px] flex flex-col items-center justify-center"
                on:submit=move |ev| {
                    let data = AddTodo::from_event(&ev).expect("to parse form data");
                    if data.title == "" {
                        ev.prevent_default();
                    }
                }
            >
                <input type="text" name="title" class="bg-dark border-b mx-2" />
                <input
                    class="bg-amber-600 hover:bg-sky-700 px-5 py-3 text-white rounded-lg"
                    type="submit"
                    value="Add"
                />
            </MultiActionForm>
            <Transition fallback=move || view! {cx, <p>"Loading..."</p> }>
                {move || {
                     view! {
                         cx,
                         <ul class="flex flex-col w-1/2 justify-center">
                             {existing_todos}
                             {pending_todos}
                         </ul>
                     }
                }}
            </Transition>
    </main>
    }
}
