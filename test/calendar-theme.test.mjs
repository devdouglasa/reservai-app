import assert from "node:assert/strict";
import { test } from "node:test";
import { addDays, monthCells, shiftMonth } from "../src/lib/calendar.ts";
import { lightColors, darkColors } from "../src/theme/tokens.ts";

function luminance(hex) {
  const rgb = hex
    .slice(1)
    .match(/../g)
    .map((value) => parseInt(value, 16) / 255)
    .map((value) =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    );
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
test("theme text and action colors meet WCAG AA in both appearances", () => {
  for (const colors of [lightColors, darkColors]) {
    for (const [foreground, background] of [
      ["text", "background"],
      ["text", "surface"],
      ["muted", "surface"],
      ["muted", "background"],
      ["onPrimary", "primary"],
      ["primary", "surfaceAlt"],
      ["onAccent", "accent"],
      ["success", "successBg"],
      ["warning", "warningBg"],
      ["danger", "dangerBg"],
      ["neutral", "neutralBg"],
    ]) {
      assert.ok(
        contrast(colors[foreground], colors[background]) >= 4.5,
        `${foreground}/${background}: ${contrast(colors[foreground], colors[background]).toFixed(2)}`,
      );
    }
  }
});
test("calendar handles leap years, month transitions and year boundaries", () => {
  assert.equal(addDays("2028-02-28", 1), "2028-02-29");
  assert.equal(addDays("2028-02-29", 1), "2028-03-01");
  assert.equal(shiftMonth("2026-12", 1), "2027-01");
  assert.equal(shiftMonth("2027-01", -1), "2026-12");
  assert.equal(monthCells("2028-02").filter(Boolean).length, 29);
  assert.equal(monthCells("2026-11")[0], "2026-11-01");
});
test("the booking horizon remains ninety calendar days across a year boundary", () => {
  assert.equal(addDays("2026-11-06", 90), "2027-02-04");
});
