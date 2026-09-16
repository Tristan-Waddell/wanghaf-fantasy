import assert from "node:assert/strict";
import test from "node:test";
import { getDefaultParlayStake, PAYMENT_URL } from "../lib/payment.ts";

test("defaults the parlay stake to five dollars per miss", () => {
  assert.equal(getDefaultParlayStake(0), 0);
  assert.equal(getDefaultParlayStake(3), 15);
});

test("uses the league Venmo payment link", () => {
  assert.equal(
    PAYMENT_URL,
    "https://venmo.com/zsimonson?txn=pay&amount=5.00&note=WANGHAF",
  );
});
