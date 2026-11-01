<!-- A labelled text input or textarea, bound to a value. `class` replaces
     the outer spacing, e.g. "flex-1" inside a row. -->
<script lang="ts">
  type Props = {
    name: string;
    label: string;
    value: string;
    placeholder?: string;
    type?: "text" | "tel" | "email";
    multiline?: boolean;
    class?: string;
  };
  let {
    name,
    label,
    value = $bindable(),
    placeholder,
    type = "text",
    multiline = false,
    class: outer = "mt-5",
  }: Props = $props();

  const id = $derived(`f-${name}`);
  const control = [
    "block w-full rounded-control border border-stroke-1 bg-fill-2 p-4 fs-16 text-text-1",
    "transition placeholder:text-text-3",
    "focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-1",
    "focus-visible:outline-accent",
  ];
</script>

<div class={outer}>
  <label for={id} class="mb-2 block fs-13 leading-caption text-pretty text-text-3">{label}</label>
  {#if multiline}
    <textarea {id} rows="3" class={[control, "min-h-[148px] resize-y leading-[1.55]"]} bind:value
    ></textarea>
  {:else}
    <input {id} {type} {placeholder} class={[control, "h-tap"]} bind:value />
  {/if}
</div>
