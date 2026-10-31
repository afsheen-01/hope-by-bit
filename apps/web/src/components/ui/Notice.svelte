<!-- Explains a refusal (a ceiling reached, a missing name) where it happened. -->
<script lang="ts">
  let { text }: { text: string } = $props();
</script>

{#if text}<div class="notice">{text}</div>{/if}
