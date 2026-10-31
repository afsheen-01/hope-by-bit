<!-- The day's movements, rendered at build time so they read with JavaScript
     off. lib/movements.ts makes them tappable. -->
<script lang="ts">
  let { items }: { items: readonly string[] } = $props();
</script>

<ul class="movements">
  {#each items as m, i (i)}
    <li><button type="button" aria-pressed="false">{m}</button></li>
  {/each}
</ul>
