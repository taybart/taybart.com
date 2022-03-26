<script lang="ts">
  import { Link } from 'svelte-routing'
  import { getFrontPage, getItem } from './api'
</script>

<div class="h-full pt-4 text-center">
  {#await getFrontPage() then pids}
    {#each pids as id}
      <div class="post">
        {#await getItem(id) then post}
          <div class="flex flex-col items-start">
            <a
              href={post.url}
              class="text-left md:w-full w-3/4"
              target="_blank"
            >
              {post.title}
            </a>
            <span class="text-xs opacity-20 hidden md:block">{post.by}</span>
          </div>
          <Link class="" to={`/hn/${post.id}`}>
            {#if post.kids}
              <div>{post.kids.length}</div>
            {/if}
          </Link>
        {/await}
      </div>
    {/each}
  {/await}
</div>

<style lang="postcss">
  .post {
    @apply flex items-center justify-between;
    @apply border-b border-white;
    @apply h-20 px-2 md:mx-8 md:h-16 md:px-4;
  }
</style>
