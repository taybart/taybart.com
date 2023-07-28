use crate::components::header::*;
use crate::pages::{
    hn::{front_page::*, story::*},
    home::*,
};
use leptos::*;
use leptos_meta::*;
use leptos_router::*;

#[component]
pub fn App() -> impl IntoView {
    provide_meta_context();

    view! {
        <Title text="TB"/>
        <Stylesheet id="leptos" href="/pkg/site.css"/>
        <Link rel="shortcut icon" type_="image/ico" href="/favicon.ico"/>
        <Router>
            <Header/>
            <Routes>
                <Route path="/" view=move || view! { <Home/> }/>
                <Route path="/hn" view=move || view! { <FrontPage/> }/>
                <Route path="/hn/:id" view=move || view! { <Story/> }/>
                // <Route path="/todo" view=move || view! { <Todos/> }/>
            </Routes>
        </Router>
    }
}
