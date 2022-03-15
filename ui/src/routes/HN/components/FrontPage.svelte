<script lang="ts">
  import { Link } from 'svelte-routing'
  import { getFrontPage, getItem } from './api'
</script>

<div class="h-full pt-20 text-center">
  {#await getFrontPage() then pids}
    {#each pids as id}
      <div class="post">
        {#await getItem(id) then post}
          <div class="flex flex-col items-start">
            <a href={post.url} target="_blank">{post.title}</a>
            <span class="text-xs opacity-20">{post.by}</span>
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
    @apply flex h-16 items-center justify-between border-b border-white px-4 md:mx-8;
  }
</style>
