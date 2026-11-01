<!-- Back button and step counter ("2 of 5"). -->
<script lang="ts">
  import { STEPS } from "../../lib/onboarding/rules.ts";

  type Props = { step: number | "done"; onback: () => void };
  let { step, onback }: Props = $props();
</script>

<div class="flex min-h-8 items-center justify-between gap-3 pt-6">
  {#if step === "done" || step > 1}
    <button
      class="-mx-[2px] -my-2 cursor-pointer px-[2px] py-2 fs-13 leading-none text-text-3 transition-colors hover:text-text-1 focus-visible:rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      data-act="back"
      onclick={onback}>← Back</button
    >
  {:else}
    <span></span>
  {/if}
  <span class="fs-13 leading-none tracking-[0.02em] text-text-3 tabular-nums"
    >{step === "done" ? "done" : `${step} of ${STEPS}`}</span
  >
</div>
