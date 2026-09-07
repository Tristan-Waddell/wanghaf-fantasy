import assert from "node:assert/strict";
import test from "node:test";
import {
  getPriorWeekNumber,
  isPickResult,
  missedPickNames,
} from "../lib/results.ts";

test("identifies the immediately prior league week", () => {
  assert.equal(getPriorWeekNumber(1), null);
  assert.equal(getPriorWeekNumber(2), 1);
  assert.equal(getPriorWeekNumber(18), 17);
});

test("accepts only league pick results", () => {
  assert.equal(isPickResult("hit"), true);
  assert.equal(isPickResult("push"), true);
  assert.equal(isPickResult("miss"), true);
  assert.equal(isPickResult("void"), false);
});

test("returns payment-banner names for missed picks only", () => {
  assert.deepEqual(
    missedPickNames([
      { displayName: "Taco", result: "miss" },
      { displayName: "Tristan", result: "hit" },
      { displayName: "Jordan", result: "push" },
      { displayName: "Jules", result: null },
    ]),
    ["Taco"],
  );
});
