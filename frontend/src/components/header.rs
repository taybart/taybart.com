use leptos::*;
use stylers::*;

#[component]
pub fn Header(cx: Scope) -> impl IntoView {
    let class_name = style_sheet! {"./src/header.css"};
    view! {
        cx, class = class_name,
        <header class="border-b w-screen min-h-[75px] flex items-center justify-between">
            <h1 class="text-2xl pl-3">
                <a href="/">"TB"</a>
            </h1>
            <nav>
                <a class="pr-3" href="/">"resume"</a>
                <a class="pr-3 active" href="/todo">"todo"</a>
            </nav>
        </header>
    }
}
