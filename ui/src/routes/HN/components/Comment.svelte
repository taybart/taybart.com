<script lang="ts">
  import { getItem } from './api'
  export let id: number

  export let top = true

  let hidden = false
  function toggleHidden() {
    hidden = !hidden
  }
</script>

<div>
  {#await getItem(id) then post}
    <button on:click={toggleHidden} class="-ml-3">
      [{hidden ? '+' : '−'}] <span class="opacity-20">{post.by}</span>
    </button>
    {#if post.text}
      <div class="comment" class:top class:hidden>
        <div class="flex flex-row">
          <div class="w-[5px] -ml-4 min-h-full" on:click={toggleHidden} />
          <div class="comment-content ml-4">
            {@html post.text}
          </div>
        </div>
        {#if post.kids}
          {#each post.kids as id}
            <svelte:self {id} top={false} />
          {/each}
        {/if}
      </div>
    {/if}
  {/await}
</div>

<style lang="postcss">
  .top {
    @apply pb-4;
  }
  .comment {
    @apply border-l pl-4;
  }
  .comment-content {
    @apply w-full overflow-x-scroll;
  }
  /*.comment-content > code {
    @apply opacity-50;
  } */
</style>
