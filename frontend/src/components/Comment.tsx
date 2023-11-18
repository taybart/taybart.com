import { createSignal, onMount, Component, For, Switch, Match } from 'solid-js'
import Loading from './Loading'
import { Comment, defaultComment } from '../types/hn'

export interface Props {
  // id: number
  // level: number
  comment: Comment
}

const Comment: Component<Props> = ({ comment: { id, level } }) => {
  const [collapse, setCollapse] = createSignal(false)
  const [leaderCollapse, setLeaderCollapse] = createSignal(level === 0)
  const [comment, setComment] = createSignal<Comment>(defaultComment())
  onMount(async () => {
    const res = await fetch(`https://api.hackerwebapp.com/item/${id}`)
    setComment(await res.json())
  })

  return (
    <Switch fallback={<Loading Class="pt-2 pb-10" />}>
      <Match when={collapse()}>
        <div class={`flex flex-col pb-1 items-start`}>
          <button onClick={() => setCollapse(false)}>
            [+] <span class="opacity-50 pb-2">{comment().user}&nbsp;</span>
          </button>
        </div>
      </Match>
      <Match when={comment().content !== ''}>
        {/* TODO: get rid of weird scrolling issues */}
        <div
          class={`flex flex-col pb-1 items-start max-w-full overflow-x-auto`}
        >
          <button onClick={() => setCollapse(true)}>[-]</button>
          <div class={`flex flex-row pl-2 max-w-screen`}>
            <div class={`min-w-[2px] bg-white mr-3`} />
            <div class="flex flex-col items-start">
              <div innerHTML={comment().content} />
              <span class="opacity-50 pb-2">
                {comment().user}&nbsp; {comment().time_ago}
              </span>
              {comment().comments.length > 0 &&
                (!leaderCollapse() ? (
                  <For each={comment().comments}>
                    {(comment) => <Comment comment={comment} />}
                  </For>
                ) : (
                  <button
                    class="underline"
                    onClick={() => setLeaderCollapse(false)}
                  >
                    more replies ({comment().comments.length})
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
