<!-- Onboarding: five questions, then today's story. Mounted by
     lib/onboarding/mount.ts only on a device that hasn't finished it, so a
     returning visitor never downloads it. Calls `onfinish` and takes itself
     off the page at the hand-off. -->
<script lang="ts">
  import Account from "./steps/Account.svelte";
  import Circle from "./steps/Circle.svelte";
  import Done from "./steps/Done.svelte";
  import Interests from "./steps/Interests.svelte";
  import Path from "./steps/Path.svelte";
  import Time from "./steps/Time.svelte";
  import { onboarding as s } from "../../lib/onboarding/state.svelte.ts";

  let { onfinish }: { onfinish: () => void } = $props();

  let open = $state(true);
  function finish() {
    onfinish();
    open = false;
  }

  const steps = [Interests, Path, Circle, Time, Account];
  const Step = $derived(steps[s.step - 1]);
</script>

{#if open}
  <!-- Fixed over the story; the story underneath is what this hands off to. -->
  <div id="onboarding">
    <div class="screen onboarding-page">
      {#if Step}<Step />{:else}<Done onhome={finish} />{/if}
    </div>
  </div>
{/if}
