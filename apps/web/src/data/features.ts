// Fixed site content. Tone: product/features.md.

export type Feature = Readonly<{ title: string; body: string }>;

// The landing page's feature list, in display order.
export const FEATURES: readonly Feature[] = [
  {
    title: "One story a day",
    body:
      "Matched to three to five things you pick — medicine, climate, wild places, kindness, " +
      "science, your city, rights, food. One story, then the screen ends. You're done, and " +
      "that's the point.",
  },
  {
    title: "Something your body can do",
    body:
      "A glass of water. Stand up and stretch. Ninety seconds outside. Nothing costs anything, " +
      "nothing needs a signup, and none of it asks you to wait for a better week.",
  },
  {
    title: "Keep the ones that matter",
    body:
      "The wall is everything you did and kept, newest first — a total that only grows. On a bad " +
      "day it's proof you were here for it, and it belongs to you.",
  },
  {
    title: "Break the loop",
    body:
      "For your head, alone, open as often as the day needs. Sixty seconds: a breath, one of " +
      "your own kept stories, one sensory question. It costs nothing and never leaves your phone.",
  },
  {
    title: "Check in",
    body:
      "For your people. Two or three chosen in advance, each one agreeing first. One tap sends " +
      "the message you wrote while it was calm — so there's nothing to find the words for now.",
  },
];
