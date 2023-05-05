use leptos::*;
use leptos_router::*;

#[component]
pub fn Header(cx: Scope) -> impl IntoView {
    view! { cx,
        <header class="border-b w-screen min-h-[75px] flex items-center justify-between">
            <h1 class="text-2xl pl-3"> <a href="/">"TB"</a> </h1>
            <nav>
                <A exact=true href="/">"resume"</A>
                <A href="/todo">"todo"</A>
            </nav>
        </header>
    }
}
