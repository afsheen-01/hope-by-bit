// Onboarding's state and the actions that change it. One object, shared by
// every step component; Svelte re-renders whatever reads a field that moved.
// The rules themselves live in rules.ts, so this file is only "what happens
// when someone taps".

import {
  HARD_MESSAGE, INTRO_MESSAGE, MAX_CHANNELS, MAX_CIRCLE, MAX_PATHS,
  nextConsent, toggle, type Person,
} from "./rules.ts";

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

  go = (step: number) => {
    this.step = step;
    this.notice = "";
    // A new question starts at the top, not wherever the last one was
    // scrolled to.
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
    if (!name) { this.notice = "A name, at least — the number can wait."; return; }
    if (this.circle.length >= MAX_CIRCLE) { this.notice = "Four is the ceiling."; return; }
    this.circle = [...this.circle, { name, phone: this.draftPhone.trim(), consent: "pending" }];
    this.draftName = "";
    this.draftPhone = "";
    this.notice = "";
  };

  cycleConsent = (i: number) => {
    this.circle = this.circle.map((p, j) => (j === i ? { ...p, consent: nextConsent(p.consent) } : p));
  };

  pickContacts = () => {
    this.notice = "The contact picker belongs to the app, not the browser. " +
      "Type a name and number instead.";
  };

  signIn = (how: "google" | "email") => {
    this.account = how;
    this.next();
  };
}

export const onboarding = new Onboarding();
