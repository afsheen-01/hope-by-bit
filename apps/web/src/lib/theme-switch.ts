// Wires up ThemeSwitch.svelte. Plain TypeScript, so pages don't need Svelte.

export type Theme = "light" | "dark";
export type ThemeChoice = Theme | "auto";
export const CHOICES: readonly ThemeChoice[] = ["auto", "light", "dark"];

// Auto mode is light from 6am to 6pm, not real sunrise. BaseLayout.astro
// duplicates this rule, so keep the two in sync.
const DAY_STARTS = 6;
const NIGHT_STARTS = 18;

export function autoTheme(now = new Date()): Theme {
  const hour = now.getHours();
  return hour >= DAY_STARTS && hour < NIGHT_STARTS ? "light" : "dark";
}

// Milliseconds until auto mode next changes theme.
export function msUntilNextSwitch(now = new Date()): number {
  const next = new Date(now);
  const hour = now.getHours();
  if (hour < DAY_STARTS) {
    next.setHours(DAY_STARTS, 0, 0, 0);
  } else if (hour < NIGHT_STARTS) {
    next.setHours(NIGHT_STARTS, 0, 0, 0);
  } else {
    next.setDate(next.getDate() + 1);
    next.setHours(DAY_STARTS, 0, 0, 0);
  }
  return next.getTime() - now.getTime();
}

export function initThemeSwitch(el: HTMLElement) {
  const root = document.documentElement;
  const buttons = [...el.querySelectorAll<HTMLButtonElement>("[data-choice]")];
  // Hidden in the markup until it works.
  el.style.display = "flex";

  const savedChoice = (): ThemeChoice => (localStorage.getItem("theme") as Theme | null) ?? "auto";

  // In auto mode, apply the clock's theme and wake again at the next switch.
  let switchTimer: ReturnType<typeof setTimeout> | undefined;
  const followClock = () => {
    clearTimeout(switchTimer);
    if (savedChoice() !== "auto") return;
    root.dataset.theme = autoTheme();
    switchTimer = setTimeout(followClock, msUntilNextSwitch());
  };

  const markPressed = () => {
    const choice = savedChoice();
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.choice === choice)));
  };

  buttons.forEach((b) =>
    b.addEventListener("click", () => {
      const choice = b.dataset.choice as ThemeChoice;
      if (choice === "auto") {
        localStorage.removeItem("theme");
      } else {
        localStorage.setItem("theme", choice);
        root.dataset.theme = choice;
      }
      followClock();
      markPressed();
    }),
  );

  // Timers can run late after the device sleeps, so recheck when the tab is shown again.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") followClock();
  });

  markPressed();
  followClock();
}
