<!-- Step 5: sign-in. Last, so there's something worth keeping. -->
<script lang="ts">
  import Button from "#/components/ui/Button.svelte";
  import Field from "#/components/ui/Field.svelte";
  import StepHeadline from "#/components/onboarding/StepHeadline.svelte";
  import Spacer from "#/components/ui/Spacer.svelte";
  import StepHeader from "#/components/onboarding/StepHeader.svelte";
  import StepText from "#/components/onboarding/StepText.svelte";
  import { canEmailLink } from "#/lib/onboarding/rules.ts";
  import { onboarding as s } from "#/lib/onboarding/state.svelte.ts";
</script>

<StepHeader step={5} onback={s.back} />
<StepHeadline>Keep this if you change phones.</StepHeadline>
<StepText variant="body">
  Everything from the last four steps uploads on first sign-in, so signing in after a month of use
  brings that month with it.
</StepText>
<Button act="google" onclick={() => s.signIn("google")}>Sign in with Google</Button>
<Field
  name="email"
  label="Or an emailed sign-in link"
  placeholder="you@example.com"
  type="email"
  bind:value={s.email}
/>
<Button
  variant="quiet"
  act="emailLink"
  disabled={!canEmailLink(s.email)}
  onclick={() => s.signIn("email")}>Email me a link</Button
>
<Spacer />
<Button act="next" onclick={s.next}>Continue</Button>
<Button variant="skip" act="skip" onclick={s.next}>Not now — keep it on this phone</Button>
<StepText variant="bottom">
  Skipping keeps the app whole on this device, with the circle held locally and check in handed to
  your phone’s share sheet.
</StepText>
