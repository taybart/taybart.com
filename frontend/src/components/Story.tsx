import { createSignal, onMount, Component } from 'solid-js'
import Loading from './Loading'

type Entry = {
  type: 'story'
  by: string
  descendants: number
  id: number
  kids: number[]
  score: number
  time: number
  title: string
  url: string
}

const defaultEntry = (): Entry => ({
  type: 'story',
  by: '',
  descendants: 0,
  id: 0,
  kids: [],
  score: 0,
  time: 0,
  title: '',
  url: '',
})

export interface Props {
  id: number
}

const Story: Component<Props> = ({ id }) => {
  const [entry, setEntry] = createSignal<Entry>(defaultEntry())
  onMount(async () => {
    const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((res) =>
      res.json(),
    )
    setEntry(res)
  })

  return (
    <li class="flex flex-row list-none text-white items-center min-h-[75px] border-b w-screen">
      {entry().url === '' ? (
        <Loading Class="pl-8 pb-10" />
      ) : (
        <div class="flex flex-row md:mx-10 mx-5 w-screen">
          <h2 class="w-3/4">
            <a href={entry().url} target="_blank">
              {entry().title}
            </a>
          </h2>
          <div class="grow" />
          {entry().kids && <a href={`/post/${id}`}>{entry().kids.length} &rarr;</a>}
        </div>
      )}
    </li>
  )
}
export default Story
