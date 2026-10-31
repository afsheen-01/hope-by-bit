<!-- Back, and where you are. The end is visible from the start. -->
<script lang="ts">
  import { STEPS } from "../../lib/onboarding/rules.ts";

  type Props = { step: number | "done"; onback: () => void };
  let { step, onback }: Props = $props();
</script>

<div class="topbar">
  {#if step === "done" || step > 1}
    <button class="back" data-act="back" onclick={onback}>← Back</button>
  {:else}
    <span></span>
  {/if}
  <span class="progress">{step === "done" ? "done" : `${step} of ${STEPS}`}</span>
</div>
