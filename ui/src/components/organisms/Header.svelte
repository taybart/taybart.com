<script lang="ts">
  import { Router, Link } from 'svelte-routing'
  import NavLink from '../atoms/NavLink.svelte'
</script>

<nav class="header">
  <Link to="/" class="text-2xl">TB</Link>
  <Router>
    <nav>
      <NavLink only to="/">resume</NavLink>
      <NavLink to="/hn">hn</NavLink>
    </nav>
  </Router>
</nav>

<style lang="postcss">
  .header {
    @apply flex h-16 w-full flex-row items-center justify-between border-b bg-dark px-4 md:px-12;
  }
</style>
