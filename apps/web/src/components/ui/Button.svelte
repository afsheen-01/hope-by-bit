<!-- Primary, quiet or skip button. `act` becomes data-act, a stable hook
     for tests. -->
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
