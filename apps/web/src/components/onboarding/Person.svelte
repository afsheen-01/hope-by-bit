<!-- One person in the circle, with their consent visible on them rather
     than summarised once underneath. Tapping stands in for a reply arriving. -->
<script lang="ts">
  import { initials, type Person } from "../../lib/onboarding/rules.ts";

  let { person, onclick }: { person: Person; onclick: () => void } = $props();
</script>

<button class="person" data-consent={person.consent} aria-label="{person.name} — {person.consent}. Tap to change." {onclick}>
  <span class="avatar">{initials(person.name)}</span><span class="name">{person.name}</span><span class="status-dot"></span><span class="person-state">{person.consent}</span>
</button>
