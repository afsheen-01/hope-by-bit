<!-- Today's story, as static HTML. The movement buttons come in as
     `children`. Styles are scoped under .bit because onboarding reuses
     class names like .figure and .date. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Bit } from "../../lib/today.ts";

  let { bit, children }: { bit: Bit; children?: Snippet } = $props();
</script>

<article class="bit">
  <p class="date">{bit.date}</p>
  <h1>{bit.headline}</h1>

  <p class="figure">
    <span class="figure-num">{bit.figure}</span>
    <span class="figure-cap">{bit.figureCap}</span>
  </p>

  <p>{bit.body}</p>
  <p class="source">{bit.source}</p>

  <section class="action">
    <h2>One small thing</h2>
    <p class="ask">{bit.ask}</p>
    {@render children?.()}
  </section>

  <p class="note">Placeholder story: daily stories aren't being published yet.</p>
</article>
