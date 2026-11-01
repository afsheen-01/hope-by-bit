// Wires up ThemeSwitch.svelte. Plain TypeScript, so pages don't need Svelte.

export type Theme = "light" | "dark";
export type ThemeChoice = Theme | "auto";
export const CHOICES: readonly ThemeChoice[] = ["auto", "light", "dark"];

// Light 6am–6pm, otherwise dark; not real sunrise. Base.astro duplicates
// this, so keep the two in sync.
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
  // Recheck every 15 minutes in case 6am/6pm passes with the tab open.
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
