<!-- Step 1: interests. Required; at least three. -->
<script lang="ts">
  import Button from "../../ui/Button.svelte";
  import ChipGroup from "../../ui/ChipGroup.svelte";
  import Headline from "../../ui/Headline.svelte";
  import Notice from "../../ui/Notice.svelte";
  import Spacer from "../../ui/Spacer.svelte";
  import StepHeader from "../../ui/StepHeader.svelte";
  import Text from "../../ui/Text.svelte";
  import { CHANNELS, MIN_CHANNELS } from "../../../lib/onboarding/rules.ts";
  import { onboarding as s } from "../../../lib/onboarding/state.svelte.ts";

  const n = $derived(s.channels.length);
</script>

<StepHeader step={1} onback={s.back} />
<Headline>What do you want proof about?</Headline>
<ChipGroup options={CHANNELS} chosen={s.channels} ontoggle={s.toggleChannel} />
<Text variant="count">{n ? `${n} chosen` : "Nothing chosen yet"}</Text>
{#if n < MIN_CHANNELS}
  <Text variant="hint">pick three or more, and we’ll take it from there</Text>
{/if}
<Notice text={s.notice} />
<Spacer />
<Button act="next" disabled={n < MIN_CHANNELS} onclick={s.next}>Continue</Button>
