import { FunctionalComponent, h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import sanitizeHtml from 'sanitize-html'
import { Link } from 'preact-router/match'

import style from './style.css'

interface Item {
    by: string
    id: number
    kids: number[]
    parent: number
    text: string
    time: number
    type: string
    title: string
    url: string
    deleted: boolean
    dead: boolean
    score: number
}

const emptyItem = (): Item => ({
    by: '',
    id: 0,
    kids: [],
    parent: 0,
    text: '',
    time: 0,
    type: '',
    title: '',
    url: '',
    deleted: false,
    dead: false,
    score: 0,
})

export interface Props {
    id: number
    comment: number
    path: string
}

// Note post and frontpage should move to display components
const Post: FunctionalComponent<Props> = (props: Props) => {
    const [loading, setLoading] = useState(true)
    const [post, setPost] = useState<Item>(emptyItem())
    const [comments, setComments] = useState<Item[]>([])

    async function getItem(itemID: number): Promise<Item> {
        return fetch(
            `https://hacker-news.firebaseio.com/v0/item/${itemID}.json`
        )
            .then(res => res.json())
            .catch(() => emptyItem())
    }

    useEffect(() => {
        getItem(props.id).then((post: Item) => {
            setPost(post)
            setLoading(false)
        })
    }, [props.id])

    useEffect(() => {
        ;(async (): Promise<void> => {
            setComments([])
            let kids = post.kids
            if (props.comment) {
                kids = await getItem(props.comment).then(c => c.kids)
            }

            kids.forEach((i: number) => {
                getItem(i).then((p: Item) =>
                    setComments((prev: Item[]) => [...prev, p])
                )
            })
        })()
    }, [post, props.comment])

    return loading ? (
        <div class={style.post}>Getting post...</div>
    ) : (
        <div class={style.post}>
            <div class={style.title}>
                <Link class={style.back} href="/hn">
                    back
                </Link>
                <a
                    href={post.url}
                    rel="noopener noreferrer"
                    target="_blank"
                    class={style['title-link']}
                >
                    {post.title}
                </a>
            </div>
            <ul class={style.comments}>
                {comments.map(p => {
                    if (p && !p.deleted && !p.dead) {
                        return (
                            <li key={p.id} class={style.comment}>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: sanitizeHtml(
                                            p.text,

                                            {
                                                allowedAttributes: {
                                                    a: ['href', 'rel'],
                                                },
                                            }
                                        ).replace(
                                            /news.ycombinator.com\/item\?id=/g,
                                            'taybart.com/hn/'
                                        ),
                                    }}
                                />
                                <div class={style['comment-bottom']}>
                                    <span class={style.by}>{p.by}</span>
                                    <Link href={`/hn/${props.id}/${p.id}`}>
                                        {p.kids && (
                                            <div class={style.count}>
                                                {p.kids.length}
                                            </div>
                                        )}
                                    </Link>
                                </div>
                            </li>
                        )
                    }
                })}
            </ul>
        </div>
    )
}
export default Post
