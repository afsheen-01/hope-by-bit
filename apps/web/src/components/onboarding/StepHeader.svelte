<!-- Back button and step counter ("2 of 5"). -->
<script lang="ts">
  import { STEPS } from "#/lib/onboarding/rules.ts";

  type Props = { step: number | "done"; onback: () => void };
  let { step, onback }: Props = $props();
</script>

<div class="flex min-h-8 items-center justify-between gap-3 pt-6">
  {#if step === "done" || step > 1}
    <button
      class="-mx-0.5 -my-2 cursor-pointer px-0.5 py-2 fs-13 leading-none text-fg-subtle transition-colors hover:text-fg focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      data-act="back"
      onclick={onback}>← Back</button
    >
  {:else}
    <span></span>
  {/if}
  <span class="fs-13 leading-none tracking-label text-fg-subtle tabular-nums"
    >{step === "done" ? "done" : `${step} of ${STEPS}`}</span
  >
</div>
