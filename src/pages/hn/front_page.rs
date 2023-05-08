use crate::components::loading::*;
use crate::pages::hn::api;
use leptos::*;

#[component]
pub fn Entry(cx: Scope, story: api::Story) -> impl IntoView {
    view! { cx,
        <div class="flex flex-row list-none text-white items-center min-h-[75px] border-b w-screen">
            <div class="flex flex-row md:mx-10 mx-5 w-screen">
                <a class="w-3/4" href=story.url target="_blank">{story.title}</a>
                <div class="grow" />
                <Show
                    when=move || {story.comments_count > Some(0)}
                    fallback=|cx| view! { cx, <div /> }
                >
                    <a href=format!("/hn/{}", story.id)>{story.comments_count} " →"</a>
                </Show>
            </div>
        </div>
    }
}

#[component]
pub fn FrontPage(cx: Scope) -> impl IntoView {
    let fp = create_resource(
        cx,
        move || {},
        move |_| async move { api::get_front_page(cx).await },
    );
    view! { cx,
        <Suspense fallback=move || view! { cx, <Loading /> }>
            {move || match fp.read(cx) {
                None => view! { cx, <><h1>"could not load frontpage"</h1></> },
                Some(fp) => {
                    let fp = fp.unwrap();
                    view! { cx, <>
                        <For
                            each=move || fp.stories.clone()
                            key=|story| story.id
                            view=move |cx, story| view! { cx,
                                <Entry story />
                            }
                        />
                    </>}
                }
            }}
        </Suspense>
    }
}
