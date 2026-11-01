<!-- The landing page's feature list (content in data/constants.ts). -->
<script lang="ts">
  import { FEATURES } from "../../data/constants.ts";
</script>

<section class="features">
  {#each FEATURES as f (f.title)}
    <article class="feature">
      <h2>{f.title}</h2>
      <p>{f.body}</p>
    </article>
  {/each}
</section>
