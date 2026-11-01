// The only module that loads Svelte; imported only on a first visit.
import { mount, type Component } from "svelte";
import OnboardingFlow from "#/components/onboarding/OnboardingFlow.svelte";
import { markOnboarded } from "#/lib/onboarding/gate.ts";

// astro check mistypes .svelte imports in .ts files as Astro islands, which
// mount() rejects. svelte-check is fine; the cast restores the real type.
const component = OnboardingFlow as unknown as Component<{ onfinish: () => void }>;

// Added inside <main>, just before the footer.
export function mountOnboarding(main: HTMLElement) {
  mount(component, {
    target: main,
    anchor: main.querySelector("footer") ?? undefined,
    props: { onfinish: markOnboarded },
  });
}
