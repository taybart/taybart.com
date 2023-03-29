import { createSignal, onMount, Component, For, Switch, Match } from 'solid-js'

type Comment = {
  type: 'comment'
  by: string
  id: number
  parent: number
  text: string
  time: number
  kids: number[]
  deleted?: boolean
}

export interface Props {
  id: number
  level: number
}

const Comment: Component<Props> = ({ id, level }) => {
  const [collapse, setCollapse] = createSignal(false)
  const [leaderCollapse, setLeaderCollapse] = createSignal(level === 0)
  const [comment, setComment] = createSignal<Comment>({
    type: 'comment',
    by: '',
    id: 0,
    parent: 0,
    text: '',
    time: 0,
    kids: [],
  })
  onMount(async () => {
    const res = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    )
    setComment(await res.json())
  })

  return (
    <Switch fallback={<div>loading...</div>}>
      <Match when={comment().deleted}>
        <div />
      </Match>
      <Match when={collapse()}>
        <div class={`flex flex-col pb-1 items-start`}>
          <button onClick={() => setCollapse(false)}>[+]</button>
        </div>
      </Match>
      <Match when={comment().text !== ''}>
        <div class={`flex flex-col pb-1 items-start`}>
          <button onClick={() => setCollapse(true)}>[-]</button>
          <div class={`flex flex-row pl-2 max-w-screen`}>
            <div class={`min-w-[2px] bg-white mr-3`} />
            <div class="flex flex-col items-start">
              <div innerHTML={comment().text} />
              <span class="opacity-50 pb-2">{comment().by}&nbsp;</span>
              {comment().kids &&
                (!leaderCollapse() ? (
                  <For each={comment().kids} fallback={<div>loading...</div>}>
                    {(id) => <Comment id={id} level={level + 1} />}
                  </For>
                ) : (
                  <button
                    class="underline"
                    onClick={() => setLeaderCollapse(false)}
                  >
                    more replies ({comment().kids.length})
                  </button>
                ))}
            </div>
          </div>
        </div>
      </Match>
    </Switch>
  )
}
export default Comment
