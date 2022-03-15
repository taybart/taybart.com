export type Item = {
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

const url = 'https://hacker-news.firebaseio.com/v0'

export async function getFrontPage(): Promise<number[]> {
  let res = await fetch(`${url}/topstories.json`)
  let pids = await res.json()
  console.log(pids.slice(0, 50))
  return pids.slice(0, 50)
}
export async function getItem(pid: number | string): Promise<Item> {
  let res = await fetch(`${url}/item/${pid}.json`)
  let post = await res.json()
  if (res.ok) {
    return post
  }
  throw new Error(`could not get post`)
}
