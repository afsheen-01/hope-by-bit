<!-- One person and their consent state. Tapping fakes a reply until there's a backend. -->
<script lang="ts">
  import { initials, type Person } from "../../lib/onboarding/rules.ts";

  let { person, onclick }: { person: Person; onclick: () => void } = $props();
</script>

<button
  class="group inline-flex cursor-pointer items-center gap-2 rounded-pill border border-stroke-1 bg-accent-tint py-1 pr-4 pl-1 fs-14 text-text-1 transition hover:border-stroke-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
  data-consent={person.consent}
  aria-label="{person.name} — {person.consent}. Tap to change."
  {onclick}
>
  <span
    class="inline-flex size-[26px] flex-none items-center justify-center rounded-pill bg-accent fs-10 font-semibold tracking-[0.02em] text-on-accent"
    >{initials(person.name)}</span
  ><span class="group-data-[consent=declined]:line-through group-data-[consent=declined]:opacity-70"
    >{person.name}</span
  ><span
    class="size-[7px] flex-none rounded-pill bg-text-3 group-data-[consent=confirmed]:bg-accent-contrast group-data-[consent=declined]:bg-stroke-2"
  ></span><span class="fs-12 text-text-3">{person.consent}</span>
</button>
