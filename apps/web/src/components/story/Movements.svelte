<!-- The day's movements. lib/movements.ts toggles aria-pressed; the tick
     and the done style follow from it. -->
<script lang="ts">
  let { items }: { items: readonly string[] } = $props();
</script>

<ul id="movements" class="grid gap-2">
  {#each items as m, i (i)}
    <li>
      <button
        type="button"
        aria-pressed="false"
        class="group flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-control border border-stroke-1 bg-fill-2 px-4 py-3 text-left text-text-1 transition-[border-color] hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent aria-pressed:bg-transparent aria-pressed:text-text-3"
      >
        <span
          aria-hidden="true"
          class="hidden font-semibold text-accent-contrast group-aria-pressed:inline">✓</span
        >{m}
      </button>
    </li>
  {/each}
</ul>
