// The only module that loads Svelte's runtime. today.astro imports it
// dynamically, and only when gate.ts says this visit needs onboarding.
import { mount } from "svelte";
import Onboarding from "../../components/onboarding/Onboarding.svelte";
import { markOnboarded } from "./gate.ts";

// Inserted into <main> before the footer, where the overlay always sat.
export function mountOnboarding(main: HTMLElement) {
  mount(Onboarding, {
    target: main,
    anchor: main.querySelector("footer") ?? undefined,
    props: { onfinish: markOnboarded },
  });
}
