import assert from "node:assert/strict";
import test from "node:test";
import { isLeagueAdmin } from "../lib/admin.ts";

test("only Tristan can grade league results", () => {
  assert.equal(isLeagueAdmin("tristancwaddell@gmail.com"), true);
  assert.equal(isLeagueAdmin("TRISTANCWADDELL@GMAIL.COM"), true);
  assert.equal(isLeagueAdmin("other@example.com"), false);
});
