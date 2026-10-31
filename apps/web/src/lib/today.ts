// Today's story. W2 replaces the body of `today()` with a fetch of
// `/bits/today` from the backend; the shape it returns is the contract.
// Placeholder until then — there is no backend yet, and the page says so.

export type Bit = Readonly<{
  date: string;
  headline: string;
  figure: string;
  figureCap: string;
  body: string;
  source: string;
  ask: string;
  // Two or three, all body-sized: free, no signup, finishable now (P7).
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
