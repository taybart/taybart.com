import type { Component } from 'solid-js'

const Loading: Component<{ size?: number }> = ({ size }) => {
  if (!size) {
    size = 20
  }
  const inner = `absolute w-${size} h-${size} rounded-full border-dark dark:border-white`
  return (
    <div class={`radius absolute t-50 r-50`}>
      <div class={`${inner} l-0 t-0 border-b-4 animate-loadingone`}></div>
      <div class={`${inner} r-0 t-0 border-r-4 animate-loadingtwo`}></div>
      <div class={`${inner} r-0 b-0 border-t-4 animate-loadingthree`}></div>
    </div>
  )
}

export default Loading
