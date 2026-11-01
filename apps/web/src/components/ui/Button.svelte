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

  const focus = "focus-visible:outline-2 focus-visible:outline-accent";
  const filled = [
    "mt-4 flex h-tap w-full items-center justify-center rounded-control",
    "fs-16 leading-none font-medium active:scale-[0.985]",
    "disabled:cursor-not-allowed disabled:opacity-45",
    focus,
    "focus-visible:outline-offset-3",
  ];
  const VARIANTS = {
    primary: [filled, "bg-accent text-on-accent enabled:hover:bg-accent-press"],
    quiet: [filled, "border border-stroke-1 bg-fill-2 text-text-1 enabled:hover:bg-fill-3"],
    skip: [
      "mt-2 block h-12 w-full rounded-control fs-15 text-text-2",
      "hover:bg-fill-2 hover:text-text-1",
      focus,
      "focus-visible:outline-offset-2",
    ],
  };
</script>

<button class={["cursor-pointer transition", VARIANTS[variant]]} data-act={act} {disabled} {onclick}
  >{@render children()}</button
>
