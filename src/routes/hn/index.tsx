import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";
import { useState, useEffect } from "preact/hooks";

import arrow from "../../assets/right-arrow.png";
import arrowWhite from "../../assets/right-arrow-white.png";
import style from "./style.css";

interface HNItem {
    by: string;
    id: number;
    kids: [number];
    parent: number;
    text: string;
    time: number;
    type: string;
    title: string;
    url: string;
    deleted: boolean;
    dead: boolean;
    score: number;
    descendants: number;
}

const FrontPage: FunctionalComponent = () => {
    const [postIDs, setPostIDs] = useState<number[]>([]);
    const [posts, setPosts] = useState<HNItem[]>([]);

    useEffect(() => {
        fetch("https://hacker-news.firebaseio.com/v0/topstories.json")
            .then(res => res.json())
            .then((pids: number[]) => {
                setPostIDs(pids);
            });
    }, []);
    useEffect(() => {
        postIDs.forEach(id => {
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
                .then(res => res.json())
                .then(p => setPosts(prev => [...prev, p]));
        });
    }, [postIDs]);

    return posts.length === 0 ? (
        <div class={style.hn}>Getting frontpage...</div>
    ) : (
        <ul class={`${style.hn} ${style["hn-post-list"]}`}>
            {posts.map(p => (
                <li key={p.id} class={`${style["hn-post"]}`}>
                    <a href={p.url} rel="noopener noreferrer" target="_blank">
                        {p.title}
                    </a>
                    {p.descendants > 0 ? (
                        <Link
                            href={`/hn/${p.id}`}
                            class={style["hn-post-comments-link"]}
                        >
                            {p.descendants}
                        </Link>
                    ) : null}
                </li>
            ))}
        </ul>
    );
};

export default FrontPage;
