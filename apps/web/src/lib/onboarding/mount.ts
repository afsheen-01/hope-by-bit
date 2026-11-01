// The only module that loads Svelte's runtime. today.astro imports it
// dynamically, and only when gate.ts says this visit needs onboarding.
import { mount, type Component } from "svelte";
import Onboarding from "../../components/onboarding/Onboarding.svelte";
import { markOnboarded } from "./gate.ts";

// `astro check` types a .svelte import as an Astro island (props plus
// client:* directives), even inside a .ts file, so svelte's own mount()
// rejects it there; svelte-check, which sees the real component type,
// accepts it as is. The cast restores what the component actually is.
const component = Onboarding as unknown as Component<{ onfinish: () => void }>;

// Added inside <main>, just before the footer.
export function mountOnboarding(main: HTMLElement) {
  mount(component, {
    target: main,
    anchor: main.querySelector("footer") ?? undefined,
    props: { onfinish: markOnboarded },
  });
}
