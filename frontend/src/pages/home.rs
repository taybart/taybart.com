use crate::components::header::{Header, HeaderProps};
use leptos::{html::Input, *};

#[component]
pub fn Home(cx: Scope) -> impl IntoView {
    let (count, set_count) = create_signal(cx, 0);
    let (name, set_name) = create_signal(cx, "".to_string());

    let input_ref = create_node_ref::<Input>(cx);

    let update_name = move |_| {
        if let Some(input) = input_ref.get().as_ref() {
            log!("{}", input.value());
            set_name.update(|n| *n = input.value().to_owned());
        }
    };

    view! { cx,
        <Header />
        <main class="my-0 flex flex-col items-center justify-center">
            <div class="flex flex-row">
                <input
                    class="bg-gray-800 text-white px-5 py-3 rounded-lg"
                    type="text"
                    placeholder="Type here..."
                    value=name()
                    on:input=update_name
                    node_ref=input_ref
                />
                <button
                    class="bg-amber-600 hover:bg-sky-700 px-5 py-3 text-white rounded-lg"
                    on:click=move |_| set_count.update(|count| *count += 1)
                >
                    "Click me!"
                </button>
                <div>
                    {move || if count() == 0 {
                        "Click the button!".to_string()
                    } else {
                        count().to_string()
                    }}
                </div>
                <a href="/todo" class="bg-amber-600 hover:bg-sky-700 px-5 py-3 text-white rounded-lg ml-2">
                    "Todo"
                </a>
            </div>
        </main>
    }
}
