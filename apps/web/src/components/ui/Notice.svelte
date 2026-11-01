<!-- Explains why an action was refused. -->
<script lang="ts">
  let { text }: { text: string } = $props();
</script>

{#if text}
  <div
    class="mt-3 rounded-control bg-accent-tint px-4 py-3 fs-13 leading-normal text-pretty text-text-1"
  >
    {text}
  </div>
{/if}
