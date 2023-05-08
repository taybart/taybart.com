use leptos::*;

#[component]
pub fn Loading(cx: Scope) -> impl IntoView {
    let inner = "w-10 h-10 absolute rounded-full border-dark dark:border-white";
    view! { cx,
        <div class="radius r-50">
          <div class={format!("{inner} l-0 t-0 border-b-4 animate-loadingone")}></div>
          <div class={format!("{inner} r-0 t-0 border-r-4 animate-loadingtwo")}></div>
          <div class={format!("{inner} r-0 b-0 border-t-4 animate-loadingthree")}></div>
        </div>
    }
}
