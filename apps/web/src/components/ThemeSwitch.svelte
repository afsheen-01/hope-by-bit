<!-- The Auto/Light/Dark buttons. Built into the page but hidden until
     lib/theme.ts makes them work. Without JavaScript they stay hidden and
     the site follows the system's light/dark setting instead. -->
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
    <!-- Inlined so the icon takes currentColor. The markup is Phosphor's SVG,
         bundled at build time — never user input. -->
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    <button type="button" data-choice={o.choice} aria-label={o.label}>{@html o.icon}</button>
  {/each}
</div>
