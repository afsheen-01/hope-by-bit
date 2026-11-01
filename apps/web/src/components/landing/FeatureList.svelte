<!-- The landing page's feature list (content in data/features.ts). -->
<script lang="ts">
  import { FEATURES } from "#/data/features.ts";
</script>

<section class="mt-12 grid gap-8 border-y border-y-stroke-1 py-10">
  {#each FEATURES as f (f.title)}
    <article>
      <h2 class="mb-2 fs-17 font-medium text-fg">{f.title}</h2>
      <p class="text-fg-muted">{f.body}</p>
    </article>
  {/each}
</section>
