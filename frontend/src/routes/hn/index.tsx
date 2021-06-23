import React, {FC, useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import Loading from '../../components/loading'

import './style.css'

interface HNItem {
  by: string
  id: number
  kids: [number]
  parent: number
  text: string
  time: number
  type: string
  title: string
  url: string
  deleted: boolean
  dead: boolean
  score: number
  descendants: number
}

const FrontPage: FC = () => {
  const [postIDs, setPostIDs] = useState<number[]>([])
  const [posts, setPosts] = useState<HNItem[]>([])
  const [ready, setReady] = useState<boolean>(false)

  useEffect(() => {
    fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      .then(res => res.json())
      .then((pids: number[]) => {
        setPostIDs(pids.slice(0, 50))
      })
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    postIDs.forEach(id => {
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
        signal: controller.signal,
      })
        .then(res => res.json())
        .then(p => setPosts(prev => [...prev, p]))
        .catch(err => !controller.signal.aborted && console.log(err))
    })
    return () => {
      controller.abort()
    }
  }, [postIDs])

  useEffect(() => {
    if (posts.length > 10) {
      setReady(true)
    }
  }, [posts])

  return !ready ? (
    <div className="hn flex h-screen">
      <Loading className="mx-auto mt-56" />
    </div>
  ) : (
    <ul className="hn">
      {posts.map(p => (
        <li key={p.id} className="fp-post">
          <a
            href={p.url}
            rel="noopener noreferrer"
            target="_blank"
            className="fp-title"
          >
            {p.title}
          </a>
          {p.descendants > 0 ? (
            <Link to={`/hn/${p.id}`}>
              {p.descendants}
            </Link>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

export default FrontPage
