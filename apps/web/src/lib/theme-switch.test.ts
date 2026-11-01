import assert from "node:assert/strict";
import { test } from "node:test";
import { autoTheme, msUntilNextSwitch } from "#/lib/theme-switch.ts";

const at = (hour: number, minute = 0) => new Date(2026, 0, 15, hour, minute);
const HOUR = 60 * 60 * 1000;

test("auto theme is light from 6am to 6pm", () => {
  assert.equal(autoTheme(at(5, 59)), "dark");
  assert.equal(autoTheme(at(6)), "light");
  assert.equal(autoTheme(at(17, 59)), "light");
  assert.equal(autoTheme(at(18)), "dark");
});

test("next switch is the coming 6am or 6pm", () => {
  assert.equal(msUntilNextSwitch(at(5)), 1 * HOUR);
  assert.equal(msUntilNextSwitch(at(12)), 6 * HOUR);
  assert.equal(msUntilNextSwitch(at(20)), 10 * HOUR);
});
