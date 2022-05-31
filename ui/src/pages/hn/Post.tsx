import { FC, useEffect, useState } from 'react'
import { Link } from 'wouter'
import classnames from 'classnames'
import { getItem, Item } from './api'

import styles from './index.module.css'

interface PostProps {
  id: number
  top?: boolean
}

const HNPost: FC<PostProps> = ({ id }) => {
  const [post, setPost] = useState<Item | null>(null)
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    getItem(id).then((post) => {
      setPost(post)
    })
  }, [id])

  if (!post) {
    return <div className={styles.post} />
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <div className="flex flex-row items-center">
          <Link className="text-1xl align-middle" to="/hn">
            ⇦ <span className="text-sm">/hn</span>
          </Link>
          <div className={styles['title-contents']}>
            <a href={post.url} target="_blank">
              {post.title}
            </a>
            <div className="text-xs opacity-20">{post.by}</div>
          </div>
        </div>
        {post.text && (
          <>
            <button onClick={() => setShowText(!showText)}>
              {showText ? 'hide' : 'show'} content
            </button>
            {showText && (
              <div
                className="mx-20 text-sm"
                dangerouslySetInnerHTML={{ __html: post.text }}
              />
            )}
          </>
        )}
      </div>
      {post.kids.map((kid) => (
        <Comment key={kid} id={kid} top={true} />
      ))}
    </div>
  )
}

const Comment: FC<PostProps> = ({ id, top }) => {
  const [post, setPost] = useState<Item | null>(null)
  const [expand, setExpand] = useState(!top)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    getItem(id).then((post) => {
      setPost(post)
    })
  }, [id])

  if (!post) {
    return <div className={styles.post} />
  }
  if (!post.text || post.deleted) {
    return null
  }
  const childComments = () => {
    if (!post.kids) {
      return null
    }
    return (
      <>
        {expand ? (
          post.kids.map((id) => <Comment key={id} id={id} top={false} />)
        ) : (
          <div className="-ml-3 cursor-pointer" onClick={() => setExpand(true)}>
            [+]
            <span className="pl-1 underline">more replies</span>
          </div>
        )}
      </>
    )
  }
  return (
    <div className="">
      <button onClick={() => setHidden(!hidden)} className="-ml-3">
        [{hidden ? '+' : '−'}] <span className="opacity-40">{post.by}</span>
      </button>
      <div
        className={classnames(styles.comment, {
          [styles.top]: top,
          hidden,
        })}
      >
        <div
          className="-ml-4 min-h-full w-[20px]"
          onClick={() => setHidden(!hidden)}
        />
        <div className="ml-2 flex flex-col">
          <div
            className="w-full"
            dangerouslySetInnerHTML={{ __html: post.text }}
          />
          {childComments()}
        </div>
      </div>
    </div>
  )
}

export default HNPost
