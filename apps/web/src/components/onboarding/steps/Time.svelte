<!-- 4 · notification time. Built from Zag's number-input machine rather than
     <input type="time">, whose popup is an OS widget CSS can't reach. Zag is
     real weight, so the action imports it only once someone reaches this step. -->
<script lang="ts">
  import Button from "../../ui/Button.svelte";
  import StepHeader from "../../ui/StepHeader.svelte";
  import { onboarding as s } from "../../../lib/onboarding/state.svelte.ts";

  // Svelte action: mounts the Zag machines on the rendered markup, and the
  // field writes straight to state — it owns its own DOM, so nothing
  // re-renders under it mid-interaction.
  function timeField(box: HTMLElement) {
    let field: { destroy(): void } | undefined;
    let gone = false;
    import("../../../lib/time-field.ts").then(({ mountTimeField }) => {
      if (!gone) field = mountTimeField(box, s.time, (t) => (s.time = t));
    });
    return { destroy: () => { gone = true; field?.destroy(); } };
  }

  const seg = "inline-flex w-16 h-16 items-center justify-center bg-fill-2 border border-stroke-1 " +
    "rounded-control focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 " +
    "focus-within:outline-[var(--accent)]";
  const input = "w-full h-full bg-transparent border-0 text-center text-[22px] font-ui tabular-nums " +
    "text-text-1 outline-none";
</script>

<StepHeader step={4} onback={s.back} />
<h1 class="headline">When should it arrive?</h1>
<p class="body">One arrival a day.</p>
<div class="field">
  <label>Every day at</label>
  <div class="time-box flex items-center gap-2 mt-2" use:timeField>
    <div data-seg="hour" class={seg}><input data-part="input" aria-label="Hour" class={input} /></div>
    <span class="text-text-2 text-[22px]">:</span>
    <div data-seg="minute" class={seg}><input data-part="input" aria-label="Minute" class={input} /></div>
    <div class="seg ml-1" role="group" aria-label="AM or PM">
      <button type="button" data-meridiem="AM">AM</button>
      <button type="button" data-meridiem="PM">PM</button>
    </div>
  </div>
</div>
<p class="hint">The reminder is scheduled on your phone, which is also why it still arrives with the network away.</p>
<div class="spacer"></div>
<Button act="next" onclick={s.next}>Continue</Button>
<div class="bottom">Declining the notification leaves the app opening to the day’s story whenever you open it.</div>
