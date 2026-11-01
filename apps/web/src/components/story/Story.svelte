<!-- Today's story, as static HTML. The movement buttons come in as
     `children`. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Bit } from "#/lib/story.ts";

  let { bit, children }: { bit: Bit; children?: Snippet } = $props();
</script>

<article>
  <p class="mb-3 pt-6 fs-13 leading-caption text-text-3">{bit.date}</p>
  <h1 class="font-display text-headline font-normal">{bit.headline}</h1>

  <!-- Number and caption on one line, so they read as one unit. -->
  <p class="mt-8 mb-2 flex items-center gap-5">
    <span
      class="ml-[var(--figure-optical)] flex-none font-ui text-[clamp(36px,11vw,48px)] leading-none font-semibold tracking-[-0.02em] text-accent-contrast lining-nums proportional-nums"
      >{bit.figure}</span
    >
    <span class="max-w-[24ch] flex-1 pt-1 fs-15 leading-caption text-pretty text-text-2"
      >{bit.figureCap}</span
    >
  </p>

  <!-- The 1em margins match what a <p> had before Tailwind's reset. -->
  <p class="my-4">{bit.body}</p>
  <p class="mt-3 mb-[1em] fs-13 leading-caption text-text-3">{bit.source}</p>

  <section class="mt-8 border-t border-t-stroke-1 pt-6">
    <h2 class="mb-3 fs-15 font-medium text-text-2">One small thing</h2>
    <p class="mb-3 fs-15 leading-body text-pretty text-text-2">{bit.ask}</p>
    {@render children?.()}
  </section>

  <p class="mt-10 mb-[1em] border-t border-t-stroke-1 pt-4 fs-13 text-text-3">
    Placeholder story: daily stories aren't being published yet.
  </p>
</article>
