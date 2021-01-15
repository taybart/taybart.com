import { FunctionalComponent, h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { RoutableProps } from "preact-router";
import { Link } from "preact-router/match";

import arrow from "../../../assets/left-arrow.png";
import arrowWhite from "../../../assets/left-arrow-white.png";
import style from "../style.css";

interface Item {
    by: string;
    id: number;
    kids: number[];
    parent: number;
    text: string;
    time: number;
    type: string;
    title: string;
    url: string;
    deleted: boolean;
    dead: boolean;
}

const emptyItem = (): Item => ({
    by: "",
    id: 0,
    kids: [],
    parent: 0,
    text: "",
    time: 0,
    type: "",
    title: "",
    url: "",
    deleted: false,
    dead: false
});

export interface Props {
    id: number;
    comment: number;
    path: string;
}

// Note post and frontpage should move to display components
const Post: FunctionalComponent<Props> = (props: Props) => {
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState<Item>(emptyItem());
    const [comments, setComments] = useState<Item[]>([]);

    async function getItem(itemID: number): Promise<Item> {
        return fetch(
            `https://hacker-news.firebaseio.com/v0/item/${itemID}.json`
        )
            .then(res => res.json())
            .catch(() => emptyItem());
    }

    useEffect(() => {
        getItem(props.id).then((post: Item) => {
            setPost(post);
            setLoading(false);
        });
    }, [props.id]);

    useEffect(() => {
        (async (): Promise<void> => {
            setComments([]);
            let kids = post.kids;
            if (props.comment) {
                kids = await getItem(props.comment).then(c => c.kids);
            }

            kids.forEach((i: number) => {
                getItem(i).then((p: Item) =>
                    setComments((prev: Item[]) => [...prev, p])
                );
            });
        })();
    }, [post, props.comment]);

    return loading ? (
        <div class={style.hn}>Getting post...</div>
    ) : (
        <ul class={`${style.hn} ${style["hn-post-list"]}`}>
            <li class={`${style["hn-post-title"]}`}>
                <Link class={`${style["hn-post-back"]}`} href="/hn">
                    back
                </Link>
                <a href={post.url} rel="noopener noreferrer" target="_blank">
                    {post.title}
                </a>
            </li>
            {comments.map(p => {
                if (p && !p.deleted && !p.dead) {
                    if (!p.text.includes("<script")) {
                        return (
                            <li key={p.id} class={`${style["hn-comment"]}`}>
                                <div
                                    class={`${localStorage.getItem("mode")}`}
                                    dangerouslySetInnerHTML={{
                                        __html: p.text
                                    }}
                                />
                                <Link href={`/hn/${props.id}/${p.id}`}>
                                    {p.kids && (
                                        <div class={style["hn-comment-count"]}>
                                            {p.kids.length}
                                        </div>
                                    )}
                                </Link>
                            </li>
                        );
                    }
                }
            })}
        </ul>
    );
};
export default Post;
