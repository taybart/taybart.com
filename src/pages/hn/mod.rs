pub mod api;
pub mod front_page;
pub mod story;

use crate::pages::hn::front_page::*;
use crate::pages::hn::story::*;
use leptos::*;
use leptos_router::*;

#[component]
pub fn HN(cx: Scope) -> impl IntoView {
    view! {cx,
        <Router>
            <Routes>
                <Route path="/hn" view=move |cx| view! { cx, <FrontPage/> }/>
                <Route path="/hn/:id" view=move |cx| view! { cx, <Story/> }/>
            </Routes>
        </Router>
    }
}
