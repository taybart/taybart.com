use crate::components::header::*;
use crate::pages::{
    hn::{front_page::*, story::*},
    home::*,
};
use leptos::*;
use leptos_meta::*;
use leptos_router::*;

#[component]
pub fn App(cx: Scope) -> impl IntoView {
    provide_meta_context(cx);

    view! {
        cx,
        <Title text="TB dev" />
        <Stylesheet id="leptos" href="/pkg/site.css"/>
        <Link rel="shortcut icon" type_="image/ico" href="/favicon.ico"/>
        <Router>
            <Header />
            <Routes>
                <Route path="/" view=move |cx| view! { cx, <Home/> }/>
                <Route path="/hn" view=move |cx| view! { cx, <FrontPage/> }/>
                <Route path="/hn/:id" view=move |cx| view! { cx, <Story/> }/>
                // <Route path="/todo" view=move |cx| view! { cx, <Todos/> }/>
            </Routes>
        </Router>
    }
}
