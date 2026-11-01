import assert from "node:assert/strict";
import { test } from "node:test";
import { canEmailLink, initials, nextConsent, to12, to24, toggle } from "#/lib/onboarding/rules.ts";

test("toggle adds, removes, and refuses past the ceiling", () => {
  assert.deepEqual(toggle(["a"], "b", 2), { list: ["a", "b"], refused: false });
  assert.deepEqual(toggle(["a", "b"], "a", 2), { list: ["b"], refused: false });
  assert.deepEqual(toggle(["a", "b"], "c", 2), { list: ["a", "b"], refused: true });
});

test("initials takes up to two words, falls back to ?", () => {
  assert.equal(initials("sam lee jones"), "SL");
  assert.equal(initials("  "), "?");
});

test("consent cycles pending → confirmed → declined → pending", () => {
  assert.equal(nextConsent(nextConsent(nextConsent("pending"))), "pending");
  assert.equal(nextConsent("pending"), "confirmed");
});

test("time converts both ways across noon and midnight", () => {
  for (const t of ["00:05", "08:00", "12:30", "23:59"]) {
    const { hour, minute, meridiem } = to12(t);
    assert.equal(to24(hour, minute, meridiem), t);
  }
  assert.deepEqual(to12("00:05"), { hour: 12, minute: 5, meridiem: "AM" });
});

test("email link needs an @", () => {
  assert.equal(canEmailLink("you"), false);
  assert.equal(canEmailLink("you@x"), true);
});
