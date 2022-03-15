<script lang="ts">
  import { Router, Route } from 'svelte-routing'
  import Header from './components/organisms/Header.svelte'
  import HN from './routes/HN.svelte'
  import Resume from './routes/Resume.svelte'
  import NotFound from './routes/NotFound.svelte'
</script>

<main class="h-full">
  <Router>
    <Route path="hn/*">
      <Header />
      <HN />
    </Route>
    <Route path="/">
      <Header />
      <Resume />
    </Route>
    <Route>
      <NotFound />
    </Route>
  </Router>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style>
