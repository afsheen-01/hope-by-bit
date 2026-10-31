<!-- 5 · account. Last, once there's a record worth keeping.
     Theme is not asked here: onboarding runs in Auto, and a setting to fiddle
     with mid-flow is one more thing between someone and the first story. -->
<script lang="ts">
  import Button from "../../ui/Button.svelte";
  import Field from "../../ui/Field.svelte";
  import StepHeader from "../../ui/StepHeader.svelte";
  import { canEmailLink } from "../../../lib/onboarding/rules.ts";
  import { onboarding as s } from "../../../lib/onboarding/state.svelte.ts";
</script>

<StepHeader step={5} onback={s.back} />
<h1 class="headline">Keep this if you change phones.</h1>
<p class="body">Everything from the last four steps uploads on first sign-in, so signing in after a month of use brings that month with it.</p>
<Button act="google" onclick={() => s.signIn("google")}>Sign in with Google</Button>
<Field name="email" label="Or an emailed sign-in link" placeholder="you@example.com" type="email" bind:value={s.email} />
<Button variant="quiet" act="emailLink" disabled={!canEmailLink(s.email)} onclick={() => s.signIn("email")}>Email me a link</Button>
<div class="spacer"></div>
<Button act="next" onclick={s.next}>Continue</Button>
<Button variant="skip" act="skip" onclick={s.next}>Not now — keep it on this phone</Button>
<div class="bottom">Skipping keeps the app whole on this device, with the circle held locally and check in handed to your phone’s share sheet.</div>
