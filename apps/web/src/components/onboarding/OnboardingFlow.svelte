<!-- Five questions, then a summary that leads to today's story. -->
<script lang="ts">
  import AccountStep from "#/components/onboarding/steps/AccountStep.svelte";
  import CircleStep from "#/components/onboarding/steps/CircleStep.svelte";
  import SummaryStep from "#/components/onboarding/steps/SummaryStep.svelte";
  import InterestsStep from "#/components/onboarding/steps/InterestsStep.svelte";
  import PathStep from "#/components/onboarding/steps/PathStep.svelte";
  import TimeStep from "#/components/onboarding/steps/TimeStep.svelte";
  import { onboarding as s } from "#/lib/onboarding/state.svelte.ts";

  const steps = [InterestsStep, PathStep, CircleStep, TimeStep, AccountStep];
  const Step = $derived(steps[s.step - 1]);
</script>

<div class="flex flex-1 flex-col text-left">
  {#if Step}<Step />{:else}<SummaryStep />{/if}
</div>
