export type Item = {
  id: number
  title: string
  points: number
  user: number[]
  time: number
  time_ago: string
  type: 'link'
  content: string
  url: string
  domain: string
  comments: Comment[]
  comments_count: number
}

export function defaultItem(): Item {
  return {
    id: 0,
    title: '',
    points: 0,
    user: [],
    time: 0,
    time_ago: '',
    type: 'link',
    content: '',
    url: '',
    domain: '',
    comments: [],
    comments_count: 0,
  }
}

export type Comment = {
  id: number
  level: number
  user: string
  time: number
  time_ago: string
  content: string
  comments: Comment[]
}
export function defaultComment(): Comment {
  return {
    id: 0,
    level: 0,
    user: '',
    time: 0,
    time_ago: '',
    content: '',
    comments: [],
  }
}
