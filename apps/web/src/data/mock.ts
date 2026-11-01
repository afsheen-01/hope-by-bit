// Stand-in data until there's a backend and accounts. Replace these, not the
// code that reads them.
import type { Bit } from "#/lib/story.ts";

// Shown on /today until real stories are published.
export const MOCK_STORY: Bit = {
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
};

// The signed-in user's name, used in the circle's default messages.
export const MOCK_USER_NAME = "[Name]";
