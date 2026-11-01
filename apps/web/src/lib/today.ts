// Today's story. Returns mock data until real stories are published;
// `Bit` is the shape the page relies on.
import { MOCK_STORY } from "../data/mock.ts";

export type Bit = Readonly<{
  date: string;
  headline: string;
  figure: string;
  figureCap: string;
  body: string;
  source: string;
  ask: string;
  // 2–3 small, free actions doable right now (P7, product/principles.md).
  movements: readonly string[];
}>;

export const today = (): Bit => MOCK_STORY;
