import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";
import { useState, useEffect } from "preact/hooks";

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
        const controller = new AbortController();
        postIDs.forEach(id => {
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
                signal: controller.signal
            })
                .then(res => res.json())
                .then(p => setPosts(prev => [...prev, p]))
                .catch(err => !controller.signal.aborted && console.log(err));
        });
        return () => {
            controller.abort();
        };
    }, [postIDs]);

    return posts.length === 0 ? (
        <div class={style.hn}>Getting frontpage...</div>
    ) : (
        <ul class={style.hn}>
            {posts.map(p => (
                <li key={p.id} class={style.post}>
                    <a
                        href={p.url}
                        rel="noopener noreferrer"
                        target="_blank"
                        class={style.title}
                    >
                        {p.title}
                    </a>
                    {p.descendants > 0 ? (
                        <Link href={`/hn/${p.id}`} class={style.comments}>
                            {p.descendants}
                        </Link>
                    ) : null}
                </li>
            ))}
        </ul>
    );
};

export default FrontPage;
