<!-- Step 2: what you're carrying. Optional. -->
<script lang="ts">
  import Button from "../../ui/Button.svelte";
  import ChipGroup from "../../ui/ChipGroup.svelte";
  import Headline from "../../ui/Headline.svelte";
  import Notice from "../../ui/Notice.svelte";
  import Spacer from "../../ui/Spacer.svelte";
  import StepHeader from "../../ui/StepHeader.svelte";
  import Text from "../../ui/Text.svelte";
  import { PATHS } from "../../../lib/onboarding/rules.ts";
  import { onboarding as s } from "../../../lib/onboarding/state.svelte.ts";
</script>

<StepHeader step={2} onback={s.back} />
<Headline>Anything you’re carrying right now?</Headline>
<Text variant="body">
  Up to two, and only if you want to. This stays in settings for whenever it becomes relevant.
</Text>
<ChipGroup options={PATHS} chosen={s.paths} ontoggle={s.togglePath} />
<Notice text={s.notice} />
<Spacer />
<Button act="next" onclick={s.next}>Continue</Button>
<Button variant="skip" act="skip" onclick={s.next}>Not right now</Button>
