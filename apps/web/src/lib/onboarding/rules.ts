// Onboarding's content and rules: data and pure functions, no DOM.
import { MOCK_USER_NAME } from "../../data/mock.ts";

/* Pick up to five: more would dilute the day. */
export const CHANNELS = [
  "medicine",
  "climate",
  "wild places",
  "kindness",
  "science",
  "your city",
  "rights",
  "food",
] as const;

/* Grief leads, as the deepest path. */
export const PATHS = ["grief", "illness", "burnout", "loneliness", "worry"] as const;

export const STEPS = 5;
export const MAX_CHANNELS = 5;
export const MIN_CHANNELS = 3;
export const MAX_PATHS = 2;
export const MAX_CIRCLE = 4;

export const INTRO_MESSAGE =
  `Hope By Bit: ${MOCK_USER_NAME} chose you as someone to reach out to when ` +
  "things are heavy. Reply YES to be reachable, STOP to decline.";

export const HARD_MESSAGE =
  `${MOCK_USER_NAME} is having a hard moment and asked me to let you know. ` +
  "A call or a text would mean a lot right now.";

export type Consent = "pending" | "confirmed" | "declined";
export type Person = Readonly<{ name: string; phone: string; consent: Consent }>;

/* Adds or removes `value`. Past `max`, nothing changes and `refused` is
   set so the screen can say why. */
export function toggle<T>(list: readonly T[], value: T, max: number) {
  if (list.includes(value)) return { list: list.filter((v) => v !== value), refused: false };
  if (list.length >= max) return { list, refused: true };
  return { list: [...list, value], refused: false };
}

export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("") || "?";

/* Cycles consent on tap, standing in for real replies. */
export const nextConsent = (c: Consent): Consent =>
  (({ pending: "confirmed", confirmed: "declined", declined: "pending" }) as const)[c];

export const confirmed = (circle: readonly Person[]) =>
  circle.filter((p) => p.consent === "confirmed");

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
