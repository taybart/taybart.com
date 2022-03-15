<script lang="ts">
  import { Link } from 'svelte-routing'
  import Comment from './Comment.svelte'
  import { getItem } from './api'

  export let id: string
</script>

<div class="mx-20">
  {#await getItem(id) then post}
    <div class="title">
      <div class="flex flex-row items-center">
        <Link class="text-1xl align-middle" to="/hn"
          >⇦ <span class="text-sm">/hn</span></Link
        >
        <div class="title-contents">
          {post.title}
        </div>
      </div>
      {#if post.text}
        <div class="text-sm">
          {@html post.text}
        </div>
      {/if}
    </div>
    {#each post.kids as kid}
      <Comment id={kid} />
    {/each}
  {/await}
</div>

<style lang="postcss">
  .title {
    @apply -mx-8 mb-4 border-b py-4;
  }
  .title-contents {
    @apply mx-14 text-xl font-semibold;
  }
</style>
