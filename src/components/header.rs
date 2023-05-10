use leptos::*;
use leptos_router::*;

#[component]
pub fn Header(cx: Scope) -> impl IntoView {
    view! { cx,
        <header class="border-b w-screen min-h-[75px] flex items-center justify-between">
            <a class="text-2xl pl-5" href="/">"TB"</a>
            <nav>
                <A exact=true href="/">"resume"</A>
                <A href="/hn">"hn"</A>
                // <A href="/todo">"todo"</A>
            </nav>
        </header>
    }
}
