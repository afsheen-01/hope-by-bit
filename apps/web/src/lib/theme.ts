// The Auto/Light/Dark switch's behaviour. ThemeSwitch.svelte renders the
// buttons at build time; this wires them up, and is plain TypeScript so the
// pages that only need this don't pay for a framework runtime.

export type Theme = "light" | "dark";
export type ThemeChoice = Theme | "auto";
export const CHOICES: readonly ThemeChoice[] = ["auto", "light", "dark"];

// ponytail: fixed 6am–6pm daylight window, not real sunrise/sunset for the
// visitor's location — upgrade to a geolocation-based sunrise calc if a
// fixed split ever reads wrong somewhere. Base.astro's inline pre-paint
// script repeats this rule, because it must run before first paint and
// can't import.
export function autoTheme(): Theme {
  const h = new Date().getHours();
  return h >= 6 && h < 18 ? "light" : "dark";
}

export function initThemeSwitch(el: HTMLElement) {
  const root = document.documentElement;
  const buttons = [...el.querySelectorAll<HTMLButtonElement>("[data-choice]")];
  // Hidden in the markup: it only means something once this has run.
  el.style.display = "flex";

  let pollId: ReturnType<typeof setInterval> | undefined;
  const stopPolling = () => clearInterval(pollId);
  // The 6/18 boundary can fall while the tab stays open; recheck
  // occasionally rather than only on load.
  const startPolling = () => {
    stopPolling();
    pollId = setInterval(() => (root.dataset.theme = autoTheme()), 15 * 60 * 1000);
  };

  const mark = () => {
    const now = localStorage.getItem("theme") || "auto";
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.choice === now)));
  };

  buttons.forEach((b) => b.addEventListener("click", () => {
    const choice = b.dataset.choice as ThemeChoice;
    if (choice === "auto") {
      localStorage.removeItem("theme");
      root.dataset.theme = autoTheme();
      startPolling();
    } else {
      localStorage.setItem("theme", choice);
      root.dataset.theme = choice;
      stopPolling();
    }
    mark();
  }));

  mark();
  if (!localStorage.getItem("theme")) startPolling();
}
