<!-- Step 1: interests. Required; at least three. -->
<script lang="ts">
  import Button from "#/components/ui/Button.svelte";
  import ChipGroup from "#/components/ui/ChipGroup.svelte";
  import StepHeadline from "#/components/onboarding/StepHeadline.svelte";
  import Notice from "#/components/ui/Notice.svelte";
  import Spacer from "#/components/ui/Spacer.svelte";
  import StepHeader from "#/components/onboarding/StepHeader.svelte";
  import StepText from "#/components/onboarding/StepText.svelte";
  import { CHANNELS, MIN_CHANNELS } from "#/lib/onboarding/rules.ts";
  import { onboarding as s } from "#/lib/onboarding/state.svelte.ts";

  const n = $derived(s.channels.length);
</script>

<StepHeader step={1} onback={s.back} />
<StepHeadline>What do you want proof about?</StepHeadline>
<ChipGroup options={CHANNELS} chosen={s.channels} ontoggle={s.toggleChannel} />
<StepText variant="count">{n ? `${n} chosen` : "Nothing chosen yet"}</StepText>
{#if n < MIN_CHANNELS}
  <StepText variant="hint">pick three or more, and we’ll take it from there</StepText>
{/if}
<Notice text={s.notice} />
<Spacer />
<Button act="next" disabled={n < MIN_CHANNELS} onclick={s.next}>Continue</Button>
