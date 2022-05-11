<script script="ts">
  import { Link } from 'svelte-routing'

  export let to = ''
  export let only = false

  function getProps({ location, href, isPartiallyCurrent, isCurrent }) {
    console.log(to, location.pathname, href, isPartiallyCurrent, isCurrent)
    let active = only && href === to
    if (!only) {
      active = href === '/' ? isCurrent : isPartiallyCurrent
    }

    return {
      class: active ? 'font-bold text-lg' : 'font-light',
    }
  }
</script>

<Link {to} {getProps}>
  <slot />
</Link>
