<!-- Summary of the answers before showing today's story. -->
<script lang="ts">
  import Button from "../../ui/Button.svelte";
  import StepHeader from "../../ui/StepHeader.svelte";
  import { confirmed, names, plural } from "../../../lib/onboarding/rules.ts";
  import { onboarding as s } from "../../../lib/onboarding/state.svelte.ts";

  let { onhome }: { onhome: () => void } = $props();

  const yes = $derived(confirmed(s.circle).length);
</script>

<StepHeader step="done" onback={s.back} />
<h1 class="headline">That’s everything.</h1>
<p class="body">
  One good thing, one small thing, every day — starting tomorrow at {s.time}. We’re glad you’re
  here.
</p>
<dl class="summary">
  <div>
    <dt>proof about</dt>
    <dd>{s.channels.join(", ")}</dd>
  </div>
  <div>
    <dt>carrying</dt>
    <dd>
      {#if s.paths.length}{s.paths.join(", ")}{:else}<span class="person-state">nothing set</span
        >{/if}
    </dd>
  </div>
  <div>
    <dt>your people</dt>
    <dd>
      {#if s.circle.length}{names(s.circle)}
        <span class="person-state">({yes} {plural(yes, "reply", "replies")} in)</span>{:else}<span
          class="person-state">none yet</span
        >{/if}
    </dd>
  </div>
  <div>
    <dt>arriving</dt>
    <dd>{s.time}</dd>
  </div>
  <div>
    <dt>account</dt>
    <dd>
      {#if s.account}{s.account === "google" ? "Google" : s.email}{:else}<span class="person-state"
          >this phone only</span
        >{/if}
    </dd>
  </div>
</dl>
<div class="spacer"></div>
<Button act="home" onclick={onhome}>See today’s story</Button>
<div class="bottom">
  Every step can be revisited from settings, and each one stands as answered once given.
</div>
