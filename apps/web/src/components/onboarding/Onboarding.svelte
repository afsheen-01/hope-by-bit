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
  <!-- Overlays the story until onboarding is done. The overlay scrolls, and
       children never shrink, so long steps scroll instead of overlapping. -->
  <div id="onboarding" class="fixed inset-0 z-20 overflow-y-auto bg-fill-1">
    <div
      class="mx-auto flex min-h-full max-w-[34rem] flex-col px-5 pt-6 pb-12 text-left *:shrink-0 max-[44rem]:pt-16"
    >
      {#if Step}<Step />{:else}<Done onhome={finish} />{/if}
    </div>
  </div>
{/if}
