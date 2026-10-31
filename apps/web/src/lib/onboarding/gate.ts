// Whether this visit runs onboarding. Kept apart from mount.ts so the check
// itself never pulls in Svelte: only a device that needs onboarding fetches it.
//
// It runs once per device — there's no account yet (O3), so "once" means
// "on this device", the same thing signing out returns you to.
const ONBOARDED = "hopebybit:onboarded";

// The landing page's "Get started" links to /today?start, which runs
// onboarding again even on a device that has finished it once.
export function shouldOnboard(): boolean {
  const url = new URL(location.href);
  if (url.searchParams.has("start")) {
    localStorage.removeItem(ONBOARDED);
    // Drop it from the address, so a reload after finishing reads the story.
    url.searchParams.delete("start");
    history.replaceState(null, "", url);
  }
  return !localStorage.getItem(ONBOARDED);
}

export const markOnboarded = () => localStorage.setItem(ONBOARDED, "1");
