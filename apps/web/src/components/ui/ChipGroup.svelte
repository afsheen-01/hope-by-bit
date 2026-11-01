<!-- Multi-select chips. The caller handles limits. -->
<script lang="ts">
  type Props = {
    options: readonly string[];
    chosen: readonly string[];
    ontoggle: (option: string) => void;
  };
  let { options, chosen, ontoggle }: Props = $props();
</script>

<div class="mt-5 flex flex-wrap gap-2">
  {#each options as o (o)}
    <button
      class="min-h-11 cursor-pointer rounded-pill border border-stroke-1 bg-fill-2 px-4 py-3 fs-15 leading-none text-text-2 transition hover:border-stroke-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-on-accent"
      aria-pressed={chosen.includes(o)}
      onclick={() => ontoggle(o)}>{o}</button
    >
  {/each}
</div>
