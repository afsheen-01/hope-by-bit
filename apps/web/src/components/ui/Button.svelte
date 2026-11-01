<!-- Onboarding's three button styles: primary (filled), quiet (outlined)
     and skip (plain text). `act` is written to data-act to name the action,
     which also gives tests a stable way to find the button. -->
<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    variant?: "primary" | "quiet" | "skip";
    act?: string;
    disabled?: boolean;
    onclick?: () => void;
    children: Snippet;
  };
  let { variant = "primary", act, disabled = false, onclick, children }: Props = $props();

  const cls = $derived({ primary: "btn", quiet: "btn btn-quiet", skip: "skip" }[variant]);
</script>

<button class={cls} data-act={act} {disabled} {onclick}>{@render children()}</button>
