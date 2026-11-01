<!-- Step 3: the circle. Only people who reply YES are reachable. -->
<script lang="ts">
  import Button from "#/components/ui/Button.svelte";
  import Field from "#/components/ui/Field.svelte";
  import StepHeadline from "#/components/onboarding/StepHeadline.svelte";
  import Notice from "#/components/ui/Notice.svelte";
  import Spacer from "#/components/ui/Spacer.svelte";
  import StepHeader from "#/components/onboarding/StepHeader.svelte";
  import StepText from "#/components/onboarding/StepText.svelte";
  import CircleMember from "#/components/onboarding/CircleMember.svelte";
  import { MAX_CIRCLE } from "#/lib/onboarding/rules.ts";
  import { onboarding as s } from "#/lib/onboarding/state.svelte.ts";

  const n = $derived(s.circle.length);
</script>

<StepHeader step={3} onback={s.back} />
<StepHeadline>Who should we tell, if you ask?</StepHeadline>
<StepText variant="body">
  Two to four people. Each one is asked first — only a YES makes someone reachable.
</StepText>

{#if n}
  <div class="mt-4 flex flex-wrap gap-2">
    {#each s.circle as person (person.id)}
      <CircleMember {person} onclick={() => s.cycleConsent(person.id)} />
    {/each}
  </div>
  <StepText variant="stub">
    There’s no backend yet to send the ask or hear back — tap a person to move them through pending
    → confirmed → declined, standing in for a reply arriving.
  </StepText>
{/if}

<Notice text={s.notice} />

{#if n < MAX_CIRCLE}
  <div class="mt-5 flex items-end gap-2">
    <Field
      name="draftName"
      label="Name"
      placeholder="Sam"
      class="flex-1"
      bind:value={s.draftName}
    />
    <Field
      name="draftPhone"
      label="Number"
      placeholder="Optional"
      type="tel"
      class="flex-1"
      bind:value={s.draftPhone}
    />
  </div>
  <Button variant="quiet" act="add" onclick={s.addPerson}>Add</Button>
  <Button variant="quiet" act="pick" onclick={s.pickContacts}>Choose from contacts</Button>
  <StepText variant="stub">
    The picker belongs to the phone — the app receives the contacts you select and nothing else.
  </StepText>
{/if}

<Field name="intro" label="What each of them receives now:" multiline bind:value={s.intro} />
<Field
  name="hardMessage"
  label="And what they’d receive in a hard moment. Writing it here, calm, is the point — the hard moment itself asks nothing of you."
  multiline
  bind:value={s.hardMessage}
/>

<Spacer />
<Button act="next" disabled={n === 0} onclick={s.next}>Send the asks</Button>
<Button variant="skip" act="skip" onclick={s.next}>Skip for now</Button>
<StepText variant="crisis">
  Numbers are held encrypted, used for this and nothing else, and released when someone is removed
  or the account is deleted.
</StepText>
