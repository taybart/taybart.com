import { createSignal, onMount, Component } from 'solid-js'
import Loading from './Loading'
import { Item, defaultItem } from '../types/hn'

export interface Props {
  id: number
}

const Story: Component<Props> = ({ id }) => {
  const [item, setItem] = createSignal<Item>(defaultItem())
  onMount(async () => {
    const res = await fetch(`https://api.hackerwebapp.com/item/${id}`).then(
      (res) => res.json()
    )
    setItem(res)
  })

  return (
    <li class="flex flex-row list-none text-white items-center min-h-[75px] border-b w-screen">
      {item().url === '' ? (
        <Loading Class="pl-8 pb-10" />
      ) : (
        <div class="flex flex-row md:mx-10 mx-5 w-screen">
          <h2 class="w-3/4 flex flex-col">
            <a
              href={item().url}
              target="_blank"
              onclick={() => (window.location.href = `/post/${id}`)}
            >
              {item().title}
              <span class="opacity-50 pb-2 text-xs">
                &nbsp;&nbsp;{item().time_ago}
              </span>
            </a>
          </h2>
          <div class="grow" />
          <a href={`/post/${id}`}>{item().comments_count} &rarr;</a>
        </div>
      )}
    </li>
  )
}
export default Story
