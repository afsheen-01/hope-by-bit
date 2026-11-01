<!-- Step 4: notification time. Zag (~16KB) is loaded only on this step. -->
<script lang="ts">
  import Button from "#/components/ui/Button.svelte";
  import StepHeadline from "#/components/onboarding/StepHeadline.svelte";
  import Spacer from "#/components/ui/Spacer.svelte";
  import StepHeader from "#/components/onboarding/StepHeader.svelte";
  import StepText from "#/components/onboarding/StepText.svelte";
  import { onboarding as s } from "#/lib/onboarding/state.svelte.ts";

  // Mounts Zag on the markup below and writes the time straight to state.
  function timeField(box: HTMLElement) {
    let field: { destroy(): void } | undefined;
    let gone = false;
    import("#/lib/time-field.ts").then(({ mountTimeField }) => {
      if (!gone) field = mountTimeField(box, s.time, (t) => (s.time = t));
    });
    return () => {
      gone = true;
      field?.destroy();
    };
  }

  const seg = [
    "inline-flex size-16 items-center justify-center bg-fill-2 border border-stroke-1",
    "rounded-control focus-within:outline-2 focus-within:outline-offset-2",
    "focus-within:outline-accent",
  ];
  const input = ["size-full text-center fs-22 tabular-nums", "text-fg outline-none"];
  const meridiem = [
    "cursor-pointer rounded-pill px-4 py-2 fs-13 leading-none text-fg-subtle",
    "transition focus-visible:outline-2 focus-visible:outline-offset-2",
    "focus-visible:outline-accent aria-pressed:bg-accent aria-pressed:text-on-accent",
  ];
</script>

<StepHeader step={4} onback={s.back} />
<StepHeadline>When should it arrive?</StepHeadline>
<StepText variant="body">One arrival a day.</StepText>
<div class="mt-5">
  <!-- Labels the group: Zag owns the inputs' ids. -->
  <span class="mb-2 block fs-13 leading-caption text-pretty text-fg-subtle" id="time-label"
    >Every day at</span
  >
  <div
    class="mt-2 flex items-center gap-2"
    role="group"
    aria-labelledby="time-label"
    {@attach timeField}
  >
    <div data-seg="hour" class={seg}>
      <input data-part="input" aria-label="Hour" class={input} />
    </div>
    <span class="fs-22 text-fg-muted">:</span>
    <div data-seg="minute" class={seg}>
      <input data-part="input" aria-label="Minute" class={input} />
    </div>
    <div
      class="ml-1 flex gap-0.75 rounded-pill border border-stroke-1 bg-fill-2 p-0.75"
      role="group"
      aria-label="AM or PM"
    >
      <button type="button" class={meridiem} data-meridiem="AM">AM</button>
      <button type="button" class={meridiem} data-meridiem="PM">PM</button>
    </div>
  </div>
</div>
<StepText variant="hint">
  The reminder is scheduled on your phone, which is also why it still arrives with the network away.
</StepText>
<Spacer />
<Button act="next" onclick={s.next}>Continue</Button>
<StepText variant="bottom">
  Declining the notification leaves the app opening to the day’s story whenever you open it.
</StepText>
