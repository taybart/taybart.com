import type { Component } from 'solid-js'

export interface Props {
  Class?: string
}

const Loading: Component<Props> = ({ Class }) => {
  const inner = `w-10 h-10 absolute rounded-full border-dark dark:border-white`
  return (
    <div class={`${Class} radius r-50`}>
      <div class={`${inner} l-0 t-0 border-b-4 animate-loadingone`}></div>
      <div class={`${inner} r-0 t-0 border-r-4 animate-loadingtwo`}></div>
      <div class={`${inner} r-0 b-0 border-t-4 animate-loadingthree`}></div>
    </div>
  )
}

export default Loading
