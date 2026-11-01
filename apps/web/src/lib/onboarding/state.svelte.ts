// Onboarding's shared state and the actions that change it. Rules live in
// rules.ts.

import {
  HARD_MESSAGE,
  INTRO_MESSAGE,
  MAX_CHANNELS,
  MAX_CIRCLE,
  MAX_PATHS,
  nextConsent,
  toggle,
  type Person,
} from "#/lib/onboarding/rules.ts";

export type Account = "google" | "email" | null;

class Onboarding {
  step = $state(1);
  notice = $state("");
  channels = $state<readonly string[]>([]);
  paths = $state<readonly string[]>([]);
  circle = $state<readonly Person[]>([]);
  draftName = $state("");
  draftPhone = $state("");
  intro = $state(INTRO_MESSAGE);
  hardMessage = $state(HARD_MESSAGE);
  time = $state("08:00");
  email = $state("");
  account = $state<Account>(null);

  // Keys the circle's list; a plain field, since nothing renders it.
  #lastId = 0;

  go = (step: number) => {
    this.step = step;
    this.notice = "";
    // Each step starts scrolled to the top.
    document.getElementById("onboarding")?.scrollTo(0, 0);
  };
  next = () => this.go(this.step + 1);
  back = () => this.go(this.step - 1);

  toggleChannel = (c: string) => {
    const r = toggle(this.channels, c, MAX_CHANNELS);
    this.channels = r.list;
    this.notice = r.refused
      ? "Five is the ceiling — a sixth channel dilutes the day rather than " +
        "widening it. Drop one to swap it."
      : "";
  };

  togglePath = (p: string) => {
    const r = toggle(this.paths, p, MAX_PATHS);
    this.paths = r.list;
    this.notice = r.refused ? "Two at a time." : "";
  };

  addPerson = () => {
    const name = this.draftName.trim();
    if (!name) {
      this.notice = "A name, at least — the number can wait.";
      return;
    }
    if (this.circle.length >= MAX_CIRCLE) {
      this.notice = "Four is the ceiling.";
      return;
    }
    const person = { id: ++this.#lastId, name, phone: this.draftPhone.trim() };
    this.circle = [...this.circle, { ...person, consent: "pending" }];
    this.draftName = "";
    this.draftPhone = "";
    this.notice = "";
  };

  cycleConsent = (id: number) => {
    this.circle = this.circle.map((p) =>
      p.id === id ? { ...p, consent: nextConsent(p.consent) } : p,
    );
  };

  pickContacts = () => {
    this.notice =
      "The contact picker belongs to the app, not the browser. " +
      "Type a name and number instead.";
  };

  signIn = (how: "google" | "email") => {
    this.account = how;
    this.next();
  };
}

export const onboarding = new Onboarding();
