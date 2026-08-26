import assert from "node:assert/strict";
import test from "node:test";
import { getWeekStatus } from "../lib/dates.ts";

const startsAt = new Date("2026-09-14T04:00:00.000Z");
const locksAt = new Date("2026-09-17T21:00:00.000Z");

test("a week is upcoming before Monday midnight New York time", () => {
  assert.equal(getWeekStatus(startsAt, locksAt, new Date("2026-09-14T03:59:59Z")), "upcoming");
});

test("a week is open from Monday through the Thursday cutoff", () => {
  assert.equal(getWeekStatus(startsAt, locksAt, startsAt), "open");
  assert.equal(getWeekStatus(startsAt, locksAt, new Date("2026-09-17T20:59:59Z")), "open");
});

test("a week locks exactly at Thursday 5 PM New York time", () => {
  assert.equal(getWeekStatus(startsAt, locksAt, locksAt), "locked");
});
