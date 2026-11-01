<!-- An onboarding step's question. -->
<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<h1
  class="mt-5 font-display text-headline font-normal text-balance text-text-1 [hanging-punctuation:first]"
>
  {@render children()}
</h1>
