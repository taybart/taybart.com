<script lang="ts">
  import { Link, Router } from 'svelte-routing'
</script>

<nav class="header">
  <div class="text-2xl">TB</div>
  <div>
    <Router>
      <Link to="/">resume</Link>
      <Link to="/hn">hn</Link>
    </Router>
  </div>
</nav>

<style lang="postcss">
  .header {
    @apply flex h-16 w-full flex-row items-center justify-between border-b px-8;
  }
</style>
