<!-- Multi-select chips. The caller handles limits. -->
<script lang="ts">
  type Props = {
    options: readonly string[];
    chosen: readonly string[];
    ontoggle: (option: string) => void;
  };
  let { options, chosen, ontoggle }: Props = $props();
</script>

<div class="chips">
  {#each options as o (o)}
    <button class="chip" aria-pressed={chosen.includes(o)} onclick={() => ontoggle(o)}>{o}</button>
  {/each}
</div>
