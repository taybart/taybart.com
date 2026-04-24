import { $ as $$Layout } from './Layout_Aq0owomM.mjs';
import { c as createComponent$1 } from './astro-component_AF7yI6d5.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute, n as Fragment, u as unescapeHTML } from './entrypoint_CQ9smGKD.mjs';
import { createComponent, ssr, ssrHydrationKey, escape } from 'solid-js/web';
import { createSignal, onMount, Switch, Match, For } from 'solid-js';
import { a as defaultComment, L as Loading } from './hn_Ds20rUod.mjs';

var _tmpl$ = ["<div", ' class="flex flex-col pb-1 items-start"><button>[+] <span class="opacity-50 pb-2"><!--$-->', "<!--/-->&nbsp;</span></button></div>"], _tmpl$2 = ["<div", ' class="flex flex-col pb-1 items-start max-w-full overflow-x-auto"><button>[-]</button><div class="flex flex-row pl-2 max-w-screen"><div class="min-w-[2px] bg-white mr-3"></div><div class="flex flex-col items-start"><div>', '</div><span class="opacity-50 pb-2"><!--$-->', "<!--/-->&nbsp; <!--$-->", "<!--/--></span><!--$-->", "<!--/--></div></div></div>"], _tmpl$3 = ["<button", ' class="underline">more replies (<!--$-->', "<!--/-->)</button>"];
const Comment = ({
  comment: {
    id,
    level
  }
}) => {
  const [collapse, setCollapse] = createSignal(false);
  const [leaderCollapse, setLeaderCollapse] = createSignal(level === 0);
  const [comment, setComment] = createSignal(defaultComment());
  onMount(async () => {
    const res = await fetch(`https://api.hackerwebapp.com/item/${id}`);
    setComment(await res.json());
  });
  return createComponent(Switch, {
    get fallback() {
      return createComponent(Loading, {
        Class: "pt-2 pb-10"
      });
    },
    get children() {
      return [createComponent(Match, {
        get when() {
          return collapse();
        },
        get children() {
          return ssr(_tmpl$, ssrHydrationKey(), escape(comment().user));
        }
      }), createComponent(Match, {
        get when() {
          return comment().content !== "";
        },
        get children() {
          return ssr(_tmpl$2, ssrHydrationKey(), comment().content.replace(/<a /g, '<a target="_blank" ').replace(/news.ycombinator.com&#x2F;item\?id=/g, "taybart.com&#x2F;post&#x2F;"), escape(comment().user), escape(comment().time_ago), comment().comments.length > 0 && (!leaderCollapse() ? escape(createComponent(For, {
            get each() {
              return comment().comments;
            },
            children: (comment2) => createComponent(Comment, {
              comment: comment2
            })
          })) : ssr(_tmpl$3, ssrHydrationKey(), escape(comment().comments.length))));
        }
      })];
    }
  });
};

const $$id = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const item = await fetch(`https://api.hackerwebapp.com/item/${id}`).then(
    (res) => res.json()
  );
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": item.title, "data-astro-cid-z6omihxq": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="w-[90%]" data-astro-cid-z6omihxq> <div class="flex flex-col items-center border-b pt-5" data-astro-cid-z6omihxq> <div class="flex flex-row items-center w-full pb-5" data-astro-cid-z6omihxq> <h1 data-astro-cid-z6omihxq> <a class="pr-5" href="/hn" data-astro-cid-z6omihxq>&larr;</a> <a${addAttribute(item.url.match(/item\?id\=\d+/) ? item.url.replace(/item\?id\=/, "/post/") : item.url, "href")} target="_blank" class="underline" data-astro-cid-z6omihxq> ${item.title} </a> <div class="opacity-50 pl-12 text-xs" data-astro-cid-z6omihxq> ${item.user} ${item.time_ago} </div> </h1> </div> ${item.content && renderTemplate`<div class="py-4 border-t w-full" data-astro-cid-z6omihxq> ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`${unescapeHTML(item.content.replace(
    /news.ycombinator.com\/item\?id=/g,
    "taybart.com/post/"
  ))}` })} </div>`} </div> ${item.comments.map((comment) => renderTemplate`${renderComponent($$result2, "Comment", Comment, { "client:load": true, "comment": comment, "client:component-hydration": "load", "client:component-path": "/Users/taylor/dev/taybart/taybart.com/frontend/src/components/Comment", "client:component-export": "default", "data-astro-cid-z6omihxq": true })}`)} </main> ` })}`;
}, "/Users/taylor/dev/taybart/taybart.com/frontend/src/pages/post/[id].astro", void 0);

const $$file = "/Users/taylor/dev/taybart/taybart.com/frontend/src/pages/post/[id].astro";
const $$url = "/post/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
