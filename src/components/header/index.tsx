import { FunctionalComponent, h } from 'preact'
/* import { useEffect } from "preact/hooks"; */
/* import SchemeListener from "./scheme_listener"; */
import { Link } from 'preact-router/match'
import style from './style.css'

const Header: FunctionalComponent = () => {
    /* useEffect(() => { */
    /*     SchemeListener(); */
    /* }, []); */
    return (
        <header id="navbar" class={style.header}>
            <Link href="/">
                <h1 class={style.left}>TB</h1>
            </Link>
            <nav class={style.right}>
                <Link
                    class={style['nav-link']}
                    activeClassName={style.active}
                    href="/resume"
                >
                    resume
                </Link>
                <Link
                    class={style['nav-link']}
                    activeClassName={style.active}
                    path="/hn/:id?/:comment?"
                    href="/hn"
                >
                    hn
                </Link>
            </nav>
        </header>
    )
}

export default Header
