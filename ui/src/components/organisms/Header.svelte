<script lang="ts">
  import { Link, Router } from 'svelte-routing'
</script>

<nav class="header">
  <div class="text-2xl">TB</div>
  <div>
    <Router>
      <a href="/">resume</a>
      <Link to="/hn">hn</Link>
    </Router>
  </div>
</nav>

<style lang="postcss">
  .header {
    @apply fixed flex h-16 w-full flex-row items-center justify-between border-b bg-dark px-12;
  }
</style>
