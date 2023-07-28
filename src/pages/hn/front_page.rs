use crate::components::loading::*;
use crate::pages::hn::api;
use leptos::*;
use leptos_router::*;

#[component]
pub fn Entry(story: api::Story) -> impl IntoView {
    view! {
        <div class="flex flex-row list-none items-center min-h-[75px] border-b w-screen">
            <div class="flex flex-row md:mx-10 mx-5 w-screen">
                <a class="w-3/4" href=story.url target="_blank">{story.title}</a>
                <div class="grow" />
                {(story.comments_count > Some(0)).then(|| { view! {
                    <A href=format!("/hn/{}", story.id)>
                    <span inner_html=format!("{} &rarr;",story.comments_count.unwrap()) />
                    </A>
                }})}
            </div>
        </div>
    }
}

#[component]
pub fn FrontPage() -> impl IntoView {
    let fp = create_resource(
        move || {},
        move |_| async move { api::get_front_page().await },
    );
    view! {
        <Suspense fallback=move || view! { <Loading class="pt-20".into() /> }>
            {move || match fp.read() {
                None => view! { <><h1>"could not load frontpage"</h1></> },
                Some(fp) => {
                    let fp = fp.unwrap();
                    view! {<>
                        <For
                            each=move || fp.stories.clone()
                            key=|story| story.id
                            view=move |story| view! {
                                <Entry story />
                            }
                        />
                    </>}
                }
            }}
        </Suspense>
    }
}
