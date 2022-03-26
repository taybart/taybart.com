<script lang="ts">
  import { Link } from 'svelte-routing'
  import Comment from './Comment.svelte'
  import { getItem } from './api'

  export let id: string

  let showText = false
  function toggleText() {
    showText = !showText
  }
</script>

<div class="mx-4 md:mx-20">
  {#await getItem(id) then post}
    <div class="title">
      <div class="flex flex-row items-center">
        <Link class="text-1xl align-middle" to="/hn"
          >⇦ <span class="text-sm">/hn</span></Link
        >
        <div class="title-contents">
          <a href={post.url} target="_blank">
            {post.title}
          </a>
        </div>
      </div>
      {#if post.text}
        <button on:click={() => toggleText()}>
          {showText ? 'hide' : 'show'} content
        </button>
        {#if showText}
          <div class="mx-20 text-sm">
            {@html post.text}
          </div>
        {/if}
      {/if}
    </div>
    {#each post.kids as kid}
      <Comment id={kid} />
    {/each}
  {/await}
</div>

<style lang="postcss">
  .title {
    @apply -mx-4 mb-4 border-b px-4 py-4 md:-mx-8;
  }
  .title-contents {
    @apply mx-6 text-xl font-semibold;
  }
</style>
