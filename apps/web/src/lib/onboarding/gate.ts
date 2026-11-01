// Decides whether to show onboarding, without loading Svelte. "Done" is
// remembered per browser in localStorage (there are no accounts yet).
const ONBOARDED = "hopebybit:onboarded";

// ?start (from "Get started") reruns onboarding.
export function shouldOnboard(): boolean {
  const url = new URL(location.href);
  if (url.searchParams.has("start")) {
    localStorage.removeItem(ONBOARDED);
    // Remove ?start so reloading doesn't restart onboarding.
    url.searchParams.delete("start");
    history.replaceState(null, "", url);
  }
  return !localStorage.getItem(ONBOARDED);
}

export const markOnboarded = () => localStorage.setItem(ONBOARDED, "1");
