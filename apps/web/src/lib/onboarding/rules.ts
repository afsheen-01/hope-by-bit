// Onboarding's content and rules — data and pure functions, no DOM.
// Five questions, four of them skippable, and then today's story.

/* Eight, and the ceiling is five — a sixth channel dilutes the day
   rather than widening it. */
export const CHANNELS = [
  "medicine", "climate", "wild places", "kindness",
  "science", "your city", "rights", "food",
] as const;

/* Grief leads, as the deepest path. */
export const PATHS = ["grief", "illness", "burnout", "loneliness", "worry"] as const;

export const STEPS = 5;
export const MAX_CHANNELS = 5;
export const MIN_CHANNELS = 3;
export const MAX_PATHS = 2;
export const MAX_CIRCLE = 4;

/* Stands in for the signed-in person's name, same placeholder
   product/features.md's own message templates use — there's no account yet
   to read a real one from. */
const NAME = "[Name]";

export const INTRO_MESSAGE =
  `Hope By Bit: ${NAME} chose you as someone to reach out to when ` +
  "things are heavy. Reply YES to be reachable, STOP to decline.";

export const HARD_MESSAGE =
  `${NAME} is having a hard moment and asked me to let you know. ` +
  "A call or a text would mean a lot right now.";

export type Consent = "pending" | "confirmed" | "declined";
export type Person = Readonly<{ name: string; phone: string; consent: Consent }>;

/* toggle : ([a], a, Int) -> { list: [a], refused: Bool }
   Reaching past the ceiling keeps what's there and reports the
   refusal, so the caller can explain it rather than fail silently. */
export function toggle<T>(list: readonly T[], value: T, max: number) {
  if (list.includes(value)) return { list: list.filter((v) => v !== value), refused: false };
  if (list.length >= max) return { list, refused: true };
  return { list: [...list, value], refused: false };
}

export const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join("") || "?";

/* Standing in for replies arriving, which in the app come back from
   the backend rather than from a tap. */
export const nextConsent = (c: Consent): Consent =>
  ({ pending: "confirmed", confirmed: "declined", declined: "pending" } as const)[c];

export const confirmed = (circle: readonly Person[]) => circle.filter((p) => p.consent === "confirmed");

export const names = (people: readonly Person[]) => people.map((p) => p.name).join(", ");

export const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

export const canEmailLink = (email: string) => email.includes("@");

// The time field speaks 12-hour; state keeps "HH:MM" in 24.
export type Meridiem = "AM" | "PM";
export function to12(hhmm: string) {
  const [h24, minute] = hhmm.split(":").map(Number);
  return { hour: ((h24 + 11) % 12) + 1, minute, meridiem: (h24 >= 12 ? "PM" : "AM") as Meridiem };
}
export function to24(hour: number, minute: number, meridiem: Meridiem) {
  const h = (hour % 12) + (meridiem === "PM" ? 12 : 0);
  return `${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}
