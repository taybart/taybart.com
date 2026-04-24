import { c as createComponent } from './astro-component_AF7yI6d5.mjs';
import 'piccolore';
import { m as maybeRenderHead, r as renderTemplate, h as addAttribute, o as renderHead, l as renderComponent, p as renderSlot } from './entrypoint_CQ9smGKD.mjs';
import 'clsx';

const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Header;
  const pathname = new URL(Astro2.request.url).pathname;
  pathname.slice(1);
  return renderTemplate`${maybeRenderHead()}<header data-astro-cid-3ef6ksr2> <h1 data-astro-cid-3ef6ksr2><a href="/" class="pl-5" data-astro-cid-3ef6ksr2>TB</a></h1> <nav class="pr-5" data-astro-cid-3ef6ksr2> <!-- <a class={currentPath == "" ? "active" : ""} href="/">me</a> --> <!-- <a --> <!--   class={currentPath == "hn" || /post\\/*/.test(currentPath) ? "active" : ""} --> <!--   href="/hn">hn</a --> <!-- > --> </nav> </header>`;
}, "/Users/taylor/dev/taybart/taybart.com/frontend/src/components/Header.astro", void 0);

const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.ico"><meta name="generator"${addAttribute(Astro2.generator, "content")}><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes"><meta property="og:title"${addAttribute(title, "content")}><link rel="apple-touch-icon" href="/icons/apple-touch-icon.png"><title>TB</title>${renderHead()}</head> <body> ${renderComponent($$result, "Header", $$Header, {})} ${renderSlot($$result, $$slots["default"])} </body> </html>`;
}, "/Users/taylor/dev/taybart/taybart.com/frontend/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
