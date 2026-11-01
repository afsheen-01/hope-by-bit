<!-- Today's story: headline, key figure, body, source, then "one small
     thing" to do. Built to static HTML. The page passes the movement buttons
     in as `children`, and a small script there makes them tappable.

     .bit scopes the story's styles above the onboarding overlay's, which
     share class names (.figure, .date, .ask…) with the story's own. -->
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

  <p class="note">
    Placeholder story: daily stories aren't being published yet.
  </p>
</article>
