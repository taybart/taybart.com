mod app;
mod components;
mod pages;
use crate::app::*;
use cfg_if::cfg_if;
use leptos::*;

cfg_if! {
    if #[cfg(feature = "ssr")] {
        use actix_files::Files;
        use actix_web::*;
        use leptos_actix::{generate_route_list, LeptosRoutes};
        // use crate::pages::*;

        #[get("/style.css")]
        async fn css() -> impl Responder {
            actix_files::NamedFile::open_async("./style/output.css").await
        }
        #[get("/favicon.ico")]
        async fn favicon() -> impl Responder {
            actix_files::NamedFile::open_async("./public/favicon.ico").await
        }

        #[actix_web::main]
        async fn main() -> std::io::Result<()> {

            // Generate the list of routes in your Leptos App
            let routes = generate_route_list(|| view! { <App/> });
            // Setting this to None means we'll be using cargo-leptos and its env vars.
            let conf = get_configuration(None).await.unwrap();

            let addr = conf.leptos_options.site_addr.clone();

            HttpServer::new(move || {
                let leptos_options = &conf.leptos_options;
                let site_root = &leptos_options.site_root;
                let routes = &routes;
                App::new()
                    .service(css)
                    .service(favicon)
                    .route("/api/{tail:.*}", leptos_actix::handle_server_fns())
                    .leptos_routes(leptos_options.to_owned(), routes.to_owned(), || view! { <App/> })
                    .service(Files::new("/", &site_root))
                    .wrap(middleware::Compress::default())
            })
            .bind(&addr)?
            .run()
            .await
        }
    } else {
        pub fn main() {
            _ = console_log::init_with_level(log::Level::Debug);
            console_error_panic_hook::set_once();
            mount_to_body(|| view! { <App /> })
        }
    }
}
