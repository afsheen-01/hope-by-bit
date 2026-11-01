<!-- Auto/Light/Dark buttons. Hidden until lib/theme.ts wires them up;
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

<div id="theme" role="group" aria-label="Theme">
  {#each OPTIONS as o (o.choice)}
    <!-- Inlined so icons take currentColor. Bundled SVG, not user input. -->
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    <button type="button" data-choice={o.choice} aria-label={o.label}>{@html o.icon}</button>
  {/each}
</div>
