<!-- 2 · path. Skippable, and moving straight past is an equally ordinary answer. -->
<script lang="ts">
  import Button from "../../ui/Button.svelte";
  import ChipGroup from "../../ui/ChipGroup.svelte";
  import Notice from "../../ui/Notice.svelte";
  import StepHeader from "../../ui/StepHeader.svelte";
  import { PATHS } from "../../../lib/onboarding/rules.ts";
  import { onboarding as s } from "../../../lib/onboarding/state.svelte.ts";
</script>

<StepHeader step={2} onback={s.back} />
<h1 class="headline">Anything you’re carrying right now?</h1>
<p class="body">Up to two, and only if you want to. This stays in settings for whenever it becomes relevant.</p>
<ChipGroup options={PATHS} chosen={s.paths} ontoggle={s.togglePath} />
<Notice text={s.notice} />
<div class="spacer"></div>
<Button act="next" onclick={s.next}>Continue</Button>
<Button variant="skip" act="skip" onclick={s.next}>Not right now</Button>
