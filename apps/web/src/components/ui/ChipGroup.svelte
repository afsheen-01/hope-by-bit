<!-- A wrapping row of multi-select chips. Choosing is the caller's job —
     it decides ceilings and what to say when one is reached. -->
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
    <button class="chip" aria-pressed={String(chosen.includes(o))} onclick={() => ontoggle(o)}>{o}</button>
  {/each}
</div>
