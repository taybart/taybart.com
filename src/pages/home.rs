use crate::components::header::{Header, HeaderProps};
use leptos::*;

#[component]
pub fn Home(cx: Scope) -> impl IntoView {
    view! { cx,
        <Header />
        <main class="w-screen h-full flex md:pl-24 md:pt-32 pt-5 text-left">
            <ul class="resume">
              <li>
                <div class="location">"@journey"</div>
                <div class="description">
                  "journey is bringing trust, identity and zero-knowledge privacy to the market"
                </div>
                <div class="job">"2021-now ⇀ director of engineering"</div>
                <div class="job">
                  "2020-2021 ⇀ principal engineer & developement manager"
                </div>
                <div class="job">"2018-2020 ⇀ lead software engineer"</div>
              </li>

              <li>
                <div class="location">"@the spiga group"</div>
                <div class="description">"real time crypto index fund"</div>
                <div class="job">"2017-2018 ⇀ lead software engineer"</div>
              </li>

              <li>
                <div class="location">"@mfactor engineering"</div>
                <div class="description">
                  "factory optimization, city air quality monitoring via IoT devices"
                </div>
                <div class="job">"2014-2017 ⇀ co-founder"</div>
              </li>

              <li>
                <div class="location">"@university of colorado, boulder"</div>
                <div class="job">
                  "2011-2015 ⇀ bs, electrical and computer engineering"
                </div>
              </li>
            </ul>
        </main>
    }
}
