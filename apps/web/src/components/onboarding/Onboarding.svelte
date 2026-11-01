<!-- Five questions, then today's story. Mounted only for first visits
     (lib/onboarding/mount.ts); removes itself when done. -->
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
  <!-- Overlays the story until onboarding is done. -->
  <div id="onboarding">
    <div class="screen onboarding-page">
      {#if Step}<Step />{:else}<Done onhome={finish} />{/if}
    </div>
  </div>
{/if}
