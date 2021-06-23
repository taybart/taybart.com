import React, {FC, useState, useEffect} from 'react'
import {Link, useParams} from 'react-router-dom'
import Loading from '../../../components/loading'

import './style.css'

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


// Note post and frontpage should move to display components
const Post: FC = () => {
  const [ready, setReady] = useState(false)
  const [post, setPost] = useState<Item>(emptyItem())
  const [comments, setComments] = useState<Item[]>([])
  const { id, comment } = useParams<{id: string, comment: string}>();

  async function getItem(itemID: number): Promise<Item> {
    return fetch(
      `https://hacker-news.firebaseio.com/v0/item/${itemID}.json`
    )
      .then(res => res.json())
      .catch(() => emptyItem())
  }

  useEffect(() => {
    getItem(+id).then((post: Item) => {
      setPost(post)
      setReady(true)
    })
  }, [id])

  useEffect(() => {
    (async (): Promise<void> => {
      setComments([])
      let kids = post.kids
      if (comment) {
        kids = await getItem(+comment).then(c => c.kids)
      }

      kids.forEach((i: number) => {
        getItem(i).then((p: Item) =>
          setComments((prev: Item[]) => [...prev, p])
        )
      })
    })()
  }, [post, comment])

  return !ready ? (
      <div className="post flex h-screen">
        <Loading className="mx-auto mt-56" />
      </div>
  ) : (
    <div className="post">
      <div className="title">
        <Link className="back" to="/hn">
          back
        </Link>
        <a
          href={post.url}
          rel="noopener noreferrer"
          target="_blank"
          className="title-link"
        >
          {post.title}
        </a>
      </div>
      <ul className="comments">
        {comments.map(p => {
          if (p && !p.deleted && !p.dead) {
            return (
              <li key={p.id} className="comment">
                <div
                  dangerouslySetInnerHTML={{
                    __html: p.text.replace(
                      /news.ycombinator.com\/item\?id=/g,
                      'taybart.com/hn/'
                    ),
                  }}
                />
                <div className="comment-bottom">
                  <span className="by">{p.by}</span>
                  <Link to={`/hn/${id}/${p.id}`}>
                    {p.kids && (
                      <div className="count">
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
