import assert from "node:assert/strict";
import test from "node:test";
import { PAYMENT_URL } from "../lib/payment.ts";

test("uses the league Venmo payment link", () => {
  assert.equal(
    PAYMENT_URL,
    "https://venmo.com/zsimonson?txn=pay&amount=10.00&note=WANGHAF",
  );
});
