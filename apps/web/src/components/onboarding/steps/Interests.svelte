<!-- Step 1: interests. Required; at least three. -->
<script lang="ts">
  import Button from "../../ui/Button.svelte";
  import ChipGroup from "../../ui/ChipGroup.svelte";
  import Notice from "../../ui/Notice.svelte";
  import StepHeader from "../../ui/StepHeader.svelte";
  import { CHANNELS, MIN_CHANNELS } from "../../../lib/onboarding/rules.ts";
  import { onboarding as s } from "../../../lib/onboarding/state.svelte.ts";

  const n = $derived(s.channels.length);
</script>

<StepHeader step={1} onback={s.back} />
<h1 class="headline">What do you want proof about?</h1>
<ChipGroup options={CHANNELS} chosen={s.channels} ontoggle={s.toggleChannel} />
<p class="count">{n ? `${n} chosen` : "Nothing chosen yet"}</p>
{#if n < MIN_CHANNELS}
  <p class="hint">pick three or more, and we’ll take it from there</p>
{/if}
<Notice text={s.notice} />
<div class="spacer"></div>
<Button act="next" disabled={n < MIN_CHANNELS} onclick={s.next}>Continue</Button>
