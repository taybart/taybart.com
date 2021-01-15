const DARK = "(prefers-color-scheme: dark)";
const LIGHT = "(prefers-color-scheme: light)";

function setDark(): void {
    localStorage.setItem("mode", "dark");
    const b = document.querySelector("body");
    if (b) {
        b.classList.add("dark");
    }
    const h = document.querySelector("header");
    if (h) {
        h.classList.add("dark");
    }
    document
        .querySelectorAll(".hn-comment-count")
        .forEach(e => e.classList.add("dark"));
}

function setLight(): void {
    localStorage.setItem("mode", "light");
    const b = document.querySelector("body");
    if (b) {
        b.classList.remove("dark");
    }
    const h = document.querySelector("header");
    if (h) {
        h.classList.remove("dark");
    }
    document
        .querySelectorAll("hn-comment-count")
        .forEach(e => e.classList.remove("dark"));
}

function checkSysScheme(query: MediaQueryList | MediaQueryListEvent): boolean {
    if (query.media === DARK) {
        setDark();
        return true;
    }
    if (query.media === LIGHT) {
        setLight();
        return true;
    }
    return false;
}
function sysColorScheme(): boolean {
    return (
        checkSysScheme(window.matchMedia(DARK)) ||
        checkSysScheme(window.matchMedia(LIGHT))
    );
}
function SchemeListener(): void {
    if (!window.matchMedia) {
        return;
    }
    window.matchMedia(DARK).addListener(e => checkSysScheme(e));
    window.matchMedia(LIGHT).addListener(e => checkSysScheme(e));

    if (!sysColorScheme()) {
        setLight();
    }
}

export default SchemeListener;
