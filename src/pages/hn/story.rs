use crate::components::loading::*;
use crate::pages::hn::api;
use leptos::*;
use leptos_router::*;
use regex::Regex;

#[allow(dead_code)]
fn clean_content(dirty: String) -> String {
    let re = Regex::new(r"news.ycombinator.com/item?id=")
        .map_err(|e| log::error!("regex err {}", e))
        .ok()
        .unwrap();
    re.replace_all(&dirty, "taybart.com/hn/").to_string()
}

#[component]
pub fn Comment(cx: Scope, comment: api::Comment) -> impl IntoView {
    let (collapse, set_collapse) = create_signal(cx, false);

    if collapse() {
        return view! { cx,
            <div class="flex flex-col pb-1 items-start">
                <button on:click=move |_| set_collapse(false)>"[+]"</button>
            </div>
        };
    }

    let content = comment.content.unwrap_or_default();
    view! { cx,
        <div class="flex flex-col pb-1 items-start max-w-full overflow-x-auto">
            <button on:click=move |_| set_collapse(!collapse())>{
                move || if collapse() {
                    "[+]"
                } else {
                    "[-]"
                }
            }</button>
            // {(!collapse()).then(|| { view! { cx,
                <div class="flex flex-row pl-2 max-w-screen">
                    <div class="min-w-[2px] bg-white mr-3" />
                    <div class="flex flex-col items-start">
                        <div> {clean_content(content)} </div>
                        <span class="opacity-50 pb-2">{comment.user} " "</span>
                        {(!comment.comments.is_empty()).then(|| {
                          view! { cx,
                            <For
                                each=move || comment.comments.clone()
                                key=|comment| comment.id
                                view=move |cx, comment| view! { cx,
                                    <Comment comment />
                                }
                            />
                          }
                        })}
                    </div>
                </div>
            // }})}
        </div>
    }

    // {comment().kids &&
    //   (!leaderCollapse() ? (
    //     <For each={comment().kids}>{(id) => <Comment id={id} level={level + 1} />}</For>
    //   ) : (
    //     <button class="underline" onClick={() => setLeaderCollapse(false)}>
    //       more replies ({comment().kids.length})
    //     </button>
    //   ))}
}

#[component]
pub fn StoryHeader(cx: Scope, story: api::Story) -> impl IntoView {
    view! { cx,
        <div class="flex flex-col items-center border-b pt-5 mb-2">
            <div class="flex flex-row items-center w-full pb-5">
                <h1 class="text-xl">
                    <a class="pr-5" href="/hn">"←"</a>
                    <a href=story.url target="_blank" class="underline">{story.title}</a>
                </h1>
            </div>
            {(story.content.is_some()).then(|| {
                let content = story.content.unwrap_or_default();
                view! { cx,
                    <div class="py-4 border-t w-full">
                        {clean_content(content)}
                    </div>
                }
            })}
        </div>
    }
}

#[component]
pub fn Story(cx: Scope) -> impl IntoView {
    let params = use_params_map(cx);
    let story = create_resource(
        cx,
        move || params().get("id").cloned().unwrap_or_default(),
        move |id| async move {
            if id.is_empty() {
                None
            } else {
                api::get_item(cx, &id.to_string()).await
            }
        },
    );
    view! { cx,
        <Suspense fallback=move || view! { cx, <Loading /> }>
            {move || match story.read(cx) {
                None => view! { cx, <><h1>"could not load story"</h1></> },
                Some(story) => {
                    let story = story.unwrap();
                    let comments = story.comments.clone().unwrap_or_default();
                    view! { cx, <>
                        <main class="w-[90%]">
                            <StoryHeader story=story />
                            <For
                                each=move || comments.clone()
                                key=|comment| comment.id
                                view=move |cx, comment| view! { cx,
                                    <Comment comment />
                                }
                            />
                        </main>
                    </> }
                }
            }}
        </Suspense>
    }
}
