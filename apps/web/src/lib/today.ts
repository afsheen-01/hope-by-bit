// Today's story. For now this returns a fixed example, and the page labels
// it as a placeholder. When a backend publishes real stories, only the body
// of `today()` should change: the `Bit` shape is what the page relies on.

export type Bit = Readonly<{
  date: string;
  headline: string;
  figure: string;
  figureCap: string;
  body: string;
  source: string;
  ask: string;
  // Two or three small physical actions: free, no signup, doable right now
  // (P7 in product/principles.md).
  movements: readonly string[];
}>;

export const today = (): Bit => ({
  date: "Thursday",
  headline: "Malaria vaccine reaches 20 million children",
  figure: "13%",
  figureCap: "fewer deaths from any cause among vaccinated under-fives",
  body:
    "Twenty-three African countries have folded the vaccine into routine " +
    "immunisation. Malaria has killed half a million children a year for " +
    "as long as anyone has been counting. That number is moving.",
  source: "Gavi · WHO",
  ask: "Now one small thing, while you're here. Whichever is nearest — they all count the same.",
  movements: ["A glass of water", "Stand up and stretch", "Ninety seconds outside"],
});
