<script lang="ts">
  import { Router, Route } from 'svelte-routing'
  import FrontPage from './HN/components/FrontPage.svelte'
  import Post from './HN/components/Post.svelte'
</script>

<Router>
  <Route path="/">
    <FrontPage />
  </Route>
  <Route path="/:id" let:params>
    <Post id={params.id} />
  </Route>
</Router>
