<!-- A labelled text input or textarea, bound to a value. -->
<script lang="ts">
  type Props = {
    name: string;
    label: string;
    value: string;
    placeholder?: string;
    type?: "text" | "tel" | "email";
    multiline?: boolean;
  };
  let { name, label, value = $bindable(), placeholder, type = "text", multiline = false }: Props = $props();

  const id = `f-${name}`;
</script>

<div class="field">
  <label for={id}>{label}</label>
  {#if multiline}
    <textarea {id} rows="3" bind:value></textarea>
  {:else}
    <input {id} {type} {placeholder} bind:value />
  {/if}
</div>
