<!-- Onboarding's text styles: body copy, hints, the chosen count, notes on
     unbuilt features ("stub"), and small print ("bottom", "crisis"). -->
<script lang="ts">
  import type { Snippet } from "svelte";

  type Variant = "body" | "hint" | "count" | "stub" | "bottom" | "crisis";
  let { variant, children }: { variant: Variant; children: Snippet } = $props();

  const STYLES: Record<Variant, { tag: "p" | "div"; cls: string }> = {
    body: { tag: "p", cls: "mt-6 fs-16 leading-body text-pretty text-text-2" },
    hint: { tag: "p", cls: "mt-1 fs-13 leading-caption text-text-3" },
    count: {
      tag: "p",
      cls: "mt-5 fs-15 leading-[1.3] font-medium text-text-1 proportional-nums",
    },
    // Bottom margin matches the 1em a <p> had before Tailwind's reset.
    stub: { tag: "p", cls: "my-3 fs-12 leading-normal text-pretty text-text-3 italic" },
    bottom: { tag: "div", cls: "mt-5 fs-13 leading-normal text-pretty text-text-3" },
    crisis: { tag: "div", cls: "mt-3 fs-12 leading-[18px] text-pretty text-text-3" },
  };
  const style = $derived(STYLES[variant]);
</script>

<svelte:element this={style.tag} class={style.cls}>{@render children()}</svelte:element>
