<!-- Summary of the answers before showing today's story. -->
<script lang="ts">
  import Button from "#/components/ui/Button.svelte";
  import StepHeadline from "#/components/onboarding/StepHeadline.svelte";
  import Spacer from "#/components/ui/Spacer.svelte";
  import StepHeader from "#/components/onboarding/StepHeader.svelte";
  import StepText from "#/components/onboarding/StepText.svelte";
  import { confirmed, names, plural } from "#/lib/onboarding/rules.ts";
  import { onboarding as s } from "#/lib/onboarding/state.svelte.ts";

  const yes = $derived(confirmed(s.circle).length);

  const rowCls = "flex gap-3 border-b border-b-stroke-1 py-3 last:border-b-0";
  const termCls = "w-24 flex-none text-fg-subtle";
  const valueCls = "flex-1 text-pretty text-fg";
</script>

{#snippet muted(text: string)}<span class="fs-12 text-fg-subtle">{text}</span>{/snippet}

<StepHeader step="done" onback={s.back} />
<StepHeadline>That’s everything.</StepHeadline>
<StepText variant="body">
  One good thing, one small thing, every day — starting tomorrow at {s.time}. We’re glad you’re
  here.
</StepText>
<!-- Bottom margin matches the 1em a <dl> had before Tailwind's reset. -->
<dl class="mt-5 mb-[1em] fs-14 leading-[1.6]">
  <div class={rowCls}>
    <dt class={termCls}>proof about</dt>
    <dd class={valueCls}>{s.channels.join(", ")}</dd>
  </div>
  <div class={rowCls}>
    <dt class={termCls}>carrying</dt>
    <dd class={valueCls}>
      {#if s.paths.length}{s.paths.join(", ")}{:else}{@render muted("nothing set")}{/if}
    </dd>
  </div>
  <div class={rowCls}>
    <dt class={termCls}>your people</dt>
    <dd class={valueCls}>
      {#if s.circle.length}
        {names(s.circle)}
        {@render muted(`(${yes} ${plural(yes, "reply", "replies")} in)`)}
      {:else}
        {@render muted("none yet")}
      {/if}
    </dd>
  </div>
  <div class={rowCls}>
    <dt class={termCls}>arriving</dt>
    <dd class={valueCls}>{s.time}</dd>
  </div>
  <div class={rowCls}>
    <dt class={termCls}>account</dt>
    <dd class={valueCls}>
      {#if s.account}{s.account === "google" ? "Google" : s.email}{:else}{@render muted(
          "this phone only",
        )}{/if}
    </dd>
  </div>
</dl>
<Spacer />
<Button act="home" onclick={() => location.assign("/today")}>See today’s story</Button>
<StepText variant="bottom">
  Every step can be revisited from settings, and each one stands as answered once given.
</StepText>
