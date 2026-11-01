<!-- Auto/Light/Dark buttons. Hidden until lib/theme-switch.ts wires them up;
     without JavaScript the system theme applies. -->
<script lang="ts">
  import circleHalf from "@phosphor-icons/core/assets/regular/circle-half.svg?raw";
  import moon from "@phosphor-icons/core/assets/regular/moon.svg?raw";
  import sun from "@phosphor-icons/core/assets/regular/sun.svg?raw";

  const OPTIONS = [
    { choice: "auto", label: "Auto theme", icon: circleHalf },
    { choice: "light", label: "Light theme", icon: sun },
    { choice: "dark", label: "Dark theme", icon: moon },
  ];
</script>

<div
  id="theme"
  role="group"
  aria-label="Theme"
  class="fixed top-4 right-4 z-30 hidden gap-[3px] rounded-pill border border-stroke-1 bg-fill-2 p-[3px] shadow-[0_2px_12px_-4px_var(--shade)]"
>
  {#each OPTIONS as o (o.choice)}
    <button
      type="button"
      data-choice={o.choice}
      aria-label={o.label}
      class="grid size-9 cursor-pointer place-items-center rounded-pill text-text-3 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-pressed:bg-accent aria-pressed:text-on-accent [&_svg]:size-4.5"
    >
      <!-- Inlined so icons take currentColor. Bundled SVG, not user input. -->
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html o.icon}
    </button>
  {/each}
</div>
