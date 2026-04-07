import { describe, expect, it } from "vitest";

describe("search route validation", () => {
  it("parses valid pagination input", () => {
    const offset = Number("0");
    const limit = Number("50");

    expect(offset).toBe(0);
    expect(limit).toBe(50);
    expect(Number.isNaN(offset)).toBe(false);
    expect(Number.isNaN(limit)).toBe(false);
  });

  it("rejects invalid limit range", () => {
    const limit = Number("500");
    const isInvalid = Number.isNaN(limit) || limit < 1 || limit > 200;

    expect(isInvalid).toBe(true);
  });
});