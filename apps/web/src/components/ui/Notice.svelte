<!-- Explains why an action was refused. -->
<script lang="ts">
  let { text }: { text: string } = $props();
</script>

{#if text}<div class="notice">{text}</div>{/if}
