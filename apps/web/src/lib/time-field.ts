// The hour and minute boxes in onboarding's "when should it arrive" step.
// We don't use <input type="time"> because its picker is drawn by the
// operating system and can't be styled to match the page. Zag's number-input
// gives the same keyboard and scroll-wheel stepping, keeps values in range and
// pads them to two digits. AM/PM is just two buttons (the .seg style), since
// a two-way choice doesn't need anything more.
import * as numberInput from "@zag-js/number-input";
import { normalizeProps, spreadProps, VanillaMachine } from "@zag-js/vanilla";
import { to12, to24, type Meridiem } from "./onboarding/rules.ts";

type SegmentOpts = { value: number; min: number; max: number; onValueChange: (d: { valueAsNumber: number }) => void };

function mountSegment(rootEl: HTMLElement, { value, min, max, onValueChange }: SegmentOpts) {
  const machine = new VanillaMachine(numberInput.machine, {
    id: rootEl.dataset.seg,
    defaultValue: String(value),
    min,
    max,
    step: 1,
    formatOptions: { minimumIntegerDigits: 2 },
    onValueChange,
  });

  let api = numberInput.connect(machine.service, normalizeProps);

  function render() {
    spreadProps(rootEl, api.getRootProps(), machine.scope.id);
    const input = rootEl.querySelector<HTMLElement>('[data-part="input"]');
    if (input) spreadProps(input, api.getInputProps(), machine.scope.id);
  }

  render();
  machine.subscribe(() => {
    api = numberInput.connect(machine.service, normalizeProps);
    render();
  });
  machine.start();

  return machine;
}

// mountTimeField(container, "HH:MM", onChange) -> { destroy() }
// `container` holds [data-seg="hour"], [data-seg="minute"], each with one
// [data-part="input"] child, plus [data-meridiem="AM"/"PM"] buttons — the
// markup components/onboarding/steps/Time.svelte renders.
export function mountTimeField(container: HTMLElement, initialTime: string, onChange: (hhmm: string) => void) {
  const state = to12(initialTime);
  const emit = () => onChange(to24(state.hour, state.minute, state.meridiem));

  const machines = [
    mountSegment(container.querySelector('[data-seg="hour"]')!, {
      value: state.hour, min: 1, max: 12,
      onValueChange: (d) => { state.hour = d.valueAsNumber; emit(); },
    }),
    mountSegment(container.querySelector('[data-seg="minute"]')!, {
      value: state.minute, min: 0, max: 59,
      onValueChange: (d) => { state.minute = d.valueAsNumber; emit(); },
    }),
  ];

  const meridiemButtons = container.querySelectorAll<HTMLElement>("[data-meridiem]");
  const markMeridiem = () => meridiemButtons.forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.meridiem === state.meridiem));
  });
  meridiemButtons.forEach((b) => b.addEventListener("click", () => {
    state.meridiem = b.dataset.meridiem as Meridiem;
    markMeridiem();
    emit();
  }));
  markMeridiem();

  return { destroy: () => machines.forEach((m) => m.stop()) };
}
