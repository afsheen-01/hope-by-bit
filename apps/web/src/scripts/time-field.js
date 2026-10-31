// The hour/minute segments of onboarding's time field. Native
// <input type="time"> renders its picker as an OS-level widget CSS can't
// reach — confirmed on step 4. Zag's number-input
// machine gives keyboard/scroll-wheel increment, clamping, and
// formatting without that popup; the AM/PM toggle is two plain buttons
// reusing the existing .seg pattern, since a two-way switch
// doesn't need a state machine.
import * as numberInput from "@zag-js/number-input";
import { normalizeProps, spreadProps, VanillaMachine } from "@zag-js/vanilla";

function mountSegment(rootEl, { value, min, max, onValueChange }) {
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
    const input = rootEl.querySelector('[data-part="input"]');
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
// `container` holds [data-seg="hour"], [data-seg="minute"], each
// with one [data-part="input"] child, plus [data-meridiem="AM"/"PM"]
// buttons — the markup onboarding.js's stepTime renders. Named data-seg
// (not data-field) so onboarding.js's generic [data-field] input listener
// doesn't also match these wrapper divs and stomp state.hour/minute.
export function mountTimeField(container, initialTime, onChange) {
  const [h24, m] = initialTime.split(":").map(Number);
  const state = {
    hour: ((h24 + 11) % 12) + 1,
    minute: m,
    meridiem: h24 >= 12 ? "PM" : "AM",
  };

  function emit() {
    let h = state.hour % 12;
    if (state.meridiem === "PM") h += 12;
    onChange(String(h).padStart(2, "0") + ":" + String(state.minute).padStart(2, "0"));
  }

  const hourRoot = container.querySelector('[data-seg="hour"]');
  const minuteRoot = container.querySelector('[data-seg="minute"]');

  const machines = [
    mountSegment(hourRoot, {
      value: state.hour,
      min: 1,
      max: 12,
      onValueChange: (d) => {
        state.hour = d.valueAsNumber;
        emit();
      },
    }),
    mountSegment(minuteRoot, {
      value: state.minute,
      min: 0,
      max: 59,
      onValueChange: (d) => {
        state.minute = d.valueAsNumber;
        emit();
      },
    }),
  ];

  const meridiemButtons = container.querySelectorAll("[data-meridiem]");
  function markMeridiem() {
    meridiemButtons.forEach((b) => {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-meridiem") === state.meridiem));
    });
  }
  meridiemButtons.forEach((b) => {
    b.addEventListener("click", () => {
      state.meridiem = b.getAttribute("data-meridiem");
      markMeridiem();
      emit();
    });
  });
  markMeridiem();

  return {
    destroy() {
      machines.forEach((m) => m.stop());
    },
  };
}
