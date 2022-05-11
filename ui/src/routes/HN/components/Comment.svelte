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
    {#if post.text && !post.deleted}
      <button on:click={toggleHidden} class="-ml-3">
        [{hidden ? '+' : '−'}] <span class="opacity-40">{post.by}</span>
      </button>
      <div class:top class:hidden>
        <div class="comment" class:top class:hidden>
          <div class="w-[20px] -ml-4 min-h-full" on:click={toggleHidden} />
          <div class="flex flex-col ml-2">
            <div class="comment-content">
              {@html post.text}
            </div>
            {#if post.kids}
              {#each post.kids as id}
                <svelte:self {id} top={false} />
              {/each}
            {/if}
          </div>
        </div>
      </div>
    {/if}
  {/await}
</div>

<style lang="postcss">
  .top {
    @apply max-w-full pb-4;
  }
  .comment {
    @apply flex flex-row border-l pl-4;
  }
  .comment-content {
    @apply w-full;
  }
  /*.comment-content > code {
    @apply opacity-50;
  } */
</style>
