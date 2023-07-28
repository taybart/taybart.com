use crate::components::loading::*;
use crate::pages::hn::api;
use leptos::*;
use leptos_meta::*;
use leptos_router::*;
use regex::Regex;

#[allow(dead_code)]
fn clean_content(dirty: String) -> String {
    let re = Regex::new(r"news.ycombinator.com/item\?id=")
        .map_err(|e| log::error!("regex err {e}"))
        .ok()
        .unwrap();
    let plain: String = re.replace_all(&dirty, "taybart.com/hn/").into();
    let re = Regex::new(r"news.ycombinator.com&#x2F;item\?id=")
        .map_err(|e| log::error!("regex err {e}"))
        .ok()
        .unwrap();
    re.replace_all(&plain, "proxy.taybart.com&#x2F;hn&#x2F;")
        .into()
}

#[component]
pub fn StoryHeader(story: api::Story) -> impl IntoView {
    view! {
        <div class="flex flex-col items-center border-b pt-5 mb-2">
            <div class="flex flex-row items-center w-full pb-5">
                <h1 class="text-xl">
                    <A class="pr-5 !no-underline" href="/hn" >
                        <span inner_html="&larr;" />
                    </A>
                    <a href=story.url target="_blank" class="underline">{story.title}</a>
                </h1>
            </div>
            {(story.content.is_some()).then(|| { view! {
                <div
                    class="py-4 border-t w-full"
                    inner_html=clean_content(story.content.unwrap_or_default())
                />
            }})}
        </div>
    }
}

#[component]
pub fn Comment(comment: api::Comment, level: usize) -> impl IntoView {
    let (open, set_open) = create_signal(true);
    let (leader_collapse, set_leader_collapse) = create_signal(level == 0);

    let user = comment.clone().user;
    view! { <div class="flex flex-col pb-1 items-start max-w-full overflow-x-auto">
        <button on:click=move |_| set_open.set(!open.get())>{
            move || if open.get() { view!{<div>"[-]"</div>} } else {
                view!{<div> "[+] " <span class="opacity-50 pb-2">{user.clone()}</span></div>}
        }}</button>
        {move || { open.get().then(|| {
            let comment = comment.clone();
            view! {<div class="flex flex-row pl-2 max-w-screen">
                <div class="min-w-[2px] bg-white mr-3" />
                <div class="flex flex-col items-start">
                    <div inner_html=clean_content(comment.content.unwrap_or_default()) />
                    <span class="opacity-50 pb-2">{comment.user}</span>
                    {(!comment.comments.is_empty()).then(move || {
                        if leader_collapse.get() {
                            view! {<>
                            <button class="underline" on:click=move |_| set_leader_collapse.set(false)>
                                {format!("more replies ({})", comment.comments.len())}
                            </button>
                            </>}
                        } else {
                            let level = level+1;
                            view! {<>
                            <For
                                each=move || comment.comments.clone()
                                key=|comment| comment.id
                                view=move |comment| {
                                    view! {<Comment comment level /> }
                                }
                            />
                            </>}
                        }
                    })}
                </div>
            </div> }
        })}}
    </div>}
}

#[component]
pub fn Story() -> impl IntoView {
    let params = use_params_map();
    let story = create_resource(
        move || params.get().get("id").cloned().unwrap_or_default(),
        move |id| async move {
            if id.is_empty() {
                None
            } else {
                api::get_item(&id.to_string()).await
            }
        },
    );

    let meta_description = move || {
        story
            .read()
            .and_then(|story| story.map(|story| story.title))
            .unwrap_or_else(|| "Loading story...".to_string())
    };

    view! {
        // <Meta http_equiv="refresh" content="3"/>
        <Suspense fallback=move || view! { <Loading class="pt-20".into() /> }>
            <Meta name="description" content=meta_description/>
            {move || match story.read() {
                None => view! { <><h1>"could not load story"</h1></> },
                Some(story) => {
                    let story = story.unwrap();
                    let comments = story.comments.clone().unwrap_or_default();
                    view! { <>
                        <main class="w-[90%]">
                            <StoryHeader story=story />
                            <For
                                each=move || comments.clone()
                                key=|comment| comment.id
                                view=move |comment| view! {
                                    <Comment comment level=0 />
                                }
                            />
                        </main>
                    </> }
                }
            }}
        </Suspense>
    }
}
