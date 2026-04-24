import { ssr, ssrHydrationKey, escape } from 'solid-js/web';

var _tmpl$ = ["<div", ' class="', '"><div class="w-10 h-10 absolute rounded-full border-dark dark:border-white l-0 t-0 border-b-4 animate-loadingone"></div><div class="w-10 h-10 absolute rounded-full border-dark dark:border-white r-0 t-0 border-r-4 animate-loadingtwo"></div><div class="w-10 h-10 absolute rounded-full border-dark dark:border-white r-0 b-0 border-t-4 animate-loadingthree"></div></div>'];
const Loading = ({
  Class
}) => {
  return ssr(_tmpl$, ssrHydrationKey(), `${escape(Class, true)} radius r-50`);
};

function defaultItem() {
  return {
    id: 0,
    title: "",
    points: 0,
    user: [],
    time: 0,
    time_ago: "",
    type: "link",
    content: "",
    url: "",
    domain: "",
    comments: [],
    comments_count: 0
  };
}
function defaultComment() {
  return {
    id: 0,
    level: 0,
    user: "",
    time: 0,
    time_ago: "",
    content: "",
    comments: []
  };
}

export { Loading as L, defaultComment as a, defaultItem as d };
