<!-- The Auto/Light/Dark control. Rendered at build time and hidden until
     lib/theme.ts wires it up — without JavaScript it stays hidden, which is
     correct: the system preference already carries both grounds. -->
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
    <button type="button" data-choice={o.choice} aria-label={o.label}>{@html o.icon}</button>
  {/each}
</div>
