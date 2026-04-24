import { $ as $$Layout } from './Layout_Aq0owomM.mjs';
import { c as createComponent$1 } from './astro-component_AF7yI6d5.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_CQ9smGKD.mjs';
import { ssr, ssrHydrationKey, escape, createComponent, ssrAttribute } from 'solid-js/web';
import { createSignal, onMount } from 'solid-js';
import { d as defaultItem, L as Loading } from './hn_Ds20rUod.mjs';

var _tmpl$ = ["<li", ' class="flex flex-row list-none text-white items-center min-h-[75px] border-b w-screen">', "</li>"], _tmpl$2 = ["<div", ' class="flex flex-row md:mx-10 mx-5 w-screen"><h2 class="w-3/4 flex flex-col"><a', ' target="_blank"><!--$-->', '<!--/--><span class="opacity-50 pb-2 text-xs">&nbsp;&nbsp;<!--$-->', '<!--/--></span></a></h2><div class="grow"></div><a href="', '"><!--$-->', "<!--/--> &rarr;</a></div>"];
const Story = ({
  id
}) => {
  const [item, setItem] = createSignal(defaultItem());
  onMount(async () => {
    const res = await fetch(`https://api.hackerwebapp.com/item/${id}`).then((res2) => res2.json());
    setItem(res);
  });
  return ssr(_tmpl$, ssrHydrationKey(), item().url === "" ? escape(createComponent(Loading, {
    Class: "pl-8 pb-10"
  })) : ssr(_tmpl$2, ssrHydrationKey(), ssrAttribute("href", escape(item().url, true), false), escape(item().title), escape(item().time_ago), `/post/${escape(id, true)}`, escape(item().comments_count)));
};

const $$Hn = createComponent$1(async ($$result, $$props, $$slots) => {
  let frontpage = await fetch("https://api.hackerwebapp.com/news").then(
    (res) => res.json()
  );
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="w-screen"> <ul> ${frontpage.map((item) => renderTemplate`${renderComponent($$result2, "Story", Story, { "client:load": true, "id": item.id, "client:component-hydration": "load", "client:component-path": "/Users/taylor/dev/taybart/taybart.com/frontend/src/components/Story", "client:component-export": "default" })}`)} </ul> </main> ` })}`;
}, "/Users/taylor/dev/taybart/taybart.com/frontend/src/pages/hn.astro", void 0);

const $$file = "/Users/taylor/dev/taybart/taybart.com/frontend/src/pages/hn.astro";
const $$url = "/hn";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Hn,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
