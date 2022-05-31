import { FC, useEffect, useState } from "react"
import { Link } from 'wouter'
import { getFrontPage, getItem, Item } from "./api"

import styles from './index.module.css'

interface PostProps {
  id: number
}

const Entry: FC<PostProps> = ({ id }) => {
  const [post, setPost] = useState<Item | null>(null)
  useEffect(() => { getItem(id).then(post => setPost(post)) }, [id])
  if (!post) { return <div className={styles.post} /> }
  return (
    <div className={styles.post}>
      <div className="flex flex-col items-start">
        <a
          href={post.url}
          className="text-left md:w-full w-3/4"
          target="_blank"
        >
          {post.title}
        </a>
        <span className="text-xs opacity-20 hidden md:block">{post.by}</span>
      </div>
      <Link href={`/hn/${post.id}`}>
        {post.kids && <div className="cursor-pointer">{post.kids.length}</div>}
      </Link>
    </div>
  )
}

const FrontPage = () => {
  const [pids, setPids] = useState<number[]>([])
  useEffect(() => {
    getFrontPage().then(pids => setPids(pids))
  }, [])
  return (<div className="h-full pt-4 text-center">
    {pids.map(id => <Entry key={id} id={id} />)}
  </div>)
}
export default FrontPage
