import assert from "node:assert/strict";
import test from "node:test";
import {
  americanToDecimal,
  calculateParlay,
  formatAmericanOdds,
  parseAmericanOdds,
} from "../lib/odds.ts";

test("parses valid American odds and rejects invalid values", () => {
  assert.equal(parseAmericanOdds("-110"), -110);
  assert.equal(parseAmericanOdds("+150"), 150);
  assert.equal(parseAmericanOdds(" 200 "), 200);
  assert.equal(parseAmericanOdds("-100"), null);
  assert.equal(parseAmericanOdds("2.5"), null);
  assert.equal(parseAmericanOdds("even"), null);
});

test("converts positive and negative American odds", () => {
  assert.equal(americanToDecimal(150), 2.5);
  assert.equal(americanToDecimal(-200), 1.5);
});

test("calculates a league-wide parlay from every leg", () => {
  const result = calculateParlay([-110, 150], 10);

  assert.ok(Math.abs(result.decimalOdds - 4.772727) < 0.000001);
  assert.ok(Math.abs(result.profit - 37.727272) < 0.000001);
  assert.ok(Math.abs(result.totalReturn - 47.727272) < 0.000001);
});

test("returns zero values for an empty betslip", () => {
  assert.deepEqual(calculateParlay([]), {
    decimalOdds: 0,
    profit: 0,
    totalReturn: 0,
  });
});

test("formats positive American odds with an explicit plus sign", () => {
  assert.equal(formatAmericanOdds(120), "+120");
  assert.equal(formatAmericanOdds(-105), "-105");
});

