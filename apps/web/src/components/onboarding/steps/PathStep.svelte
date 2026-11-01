<!-- Step 2: what you're carrying. Optional. -->
<script lang="ts">
  import Button from "#/components/ui/Button.svelte";
  import ChipGroup from "#/components/ui/ChipGroup.svelte";
  import StepHeadline from "#/components/onboarding/StepHeadline.svelte";
  import Notice from "#/components/ui/Notice.svelte";
  import Spacer from "#/components/ui/Spacer.svelte";
  import StepHeader from "#/components/onboarding/StepHeader.svelte";
  import StepText from "#/components/onboarding/StepText.svelte";
  import { PATHS } from "#/lib/onboarding/rules.ts";
  import { onboarding as s } from "#/lib/onboarding/state.svelte.ts";
</script>

<StepHeader step={2} onback={s.back} />
<StepHeadline>Anything you’re carrying right now?</StepHeadline>
<StepText variant="body">
  Up to two, and only if you want to. This stays in settings for whenever it becomes relevant.
</StepText>
<ChipGroup options={PATHS} chosen={s.paths} ontoggle={s.togglePath} />
<Notice text={s.notice} />
<Spacer />
<Button act="next" onclick={s.next}>Continue</Button>
<Button variant="skip" act="skip" onclick={s.next}>Not right now</Button>
