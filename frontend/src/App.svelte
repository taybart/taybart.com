<script lang="ts">
  import { Router, Route } from 'svelte-routing'
  import Header from './components/organisms/Header.svelte'
  import HN from './routes/HN.svelte'
  import Resume from './routes/Resume.svelte'
</script>

<main>
  <Header />
  <Router>
    <Route path="hn/*">
      <HN />
    </Route>
    <Route>
      <Resume />
    </Route>
  </Router>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style>
