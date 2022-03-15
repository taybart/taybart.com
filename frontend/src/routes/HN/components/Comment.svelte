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
    {#if post.text}
      <button on:click={toggleHidden} class="-ml-3" class:hidden>
        [−] <span class="opacity-20">{post.by}</span>
      </button>
      <div class="comment" class:top class:hidden>
        <div class="comment-content">
          {@html post.text}
        </div>
        {#if post.kids}
          {#each post.kids as id}
            <svelte:self {id} top={false} />
          {/each}
        {/if}
      </div>

      <button class:hidden={!hidden} class="-ml-3" on:click={toggleHidden}>
        [+]
      </button>
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
