<!-- Step 4: notification time. Zag (~16KB) is loaded only on this step. -->
<script lang="ts">
  import Button from "../../ui/Button.svelte";
  import Headline from "../../ui/Headline.svelte";
  import Spacer from "../../ui/Spacer.svelte";
  import StepHeader from "../../ui/StepHeader.svelte";
  import Text from "../../ui/Text.svelte";
  import { onboarding as s } from "../../../lib/onboarding/state.svelte.ts";

  // Mounts Zag on the markup below and writes the time straight to state.
  function timeField(box: HTMLElement) {
    let field: { destroy(): void } | undefined;
    let gone = false;
    import("../../../lib/time-field.ts").then(({ mountTimeField }) => {
      if (!gone) field = mountTimeField(box, s.time, (t) => (s.time = t));
    });
    return {
      destroy: () => {
        gone = true;
        field?.destroy();
      },
    };
  }

  const seg =
    "inline-flex w-16 h-16 items-center justify-center bg-fill-2 border border-stroke-1 " +
    "rounded-control focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 " +
    "focus-within:outline-[var(--accent)]";
  const input =
    "w-full h-full bg-transparent border-0 text-center text-[22px] font-ui tabular-nums " +
    "text-text-1 outline-none";
  const meridiem =
    "cursor-pointer rounded-pill px-4 py-2 fs-13 leading-none text-text-3 " +
    "transition focus-visible:outline-2 focus-visible:outline-offset-2 " +
    "focus-visible:outline-accent aria-pressed:bg-accent aria-pressed:text-on-accent";
</script>

<StepHeader step={4} onback={s.back} />
<Headline>When should it arrive?</Headline>
<Text variant="body">One arrival a day.</Text>
<div class="mt-5">
  <!-- Labels the group: Zag owns the inputs' ids. -->
  <span class="mb-2 block fs-13 leading-caption text-pretty text-text-3" id="time-label"
    >Every day at</span
  >
  <div class="mt-2 flex items-center gap-2" role="group" aria-labelledby="time-label" use:timeField>
    <div data-seg="hour" class={seg}>
      <input data-part="input" aria-label="Hour" class={input} />
    </div>
    <span class="text-[22px] text-text-2">:</span>
    <div data-seg="minute" class={seg}>
      <input data-part="input" aria-label="Minute" class={input} />
    </div>
    <div
      class="ml-1 flex gap-[3px] rounded-pill border border-stroke-1 bg-fill-2 p-[3px]"
      role="group"
      aria-label="AM or PM"
    >
      <button type="button" class={meridiem} data-meridiem="AM">AM</button>
      <button type="button" class={meridiem} data-meridiem="PM">PM</button>
    </div>
  </div>
</div>
<Text variant="hint">
  The reminder is scheduled on your phone, which is also why it still arrives with the network away.
</Text>
<Spacer />
<Button act="next" onclick={s.next}>Continue</Button>
<Text variant="bottom">
  Declining the notification leaves the app opening to the day’s story whenever you open it.
</Text>
