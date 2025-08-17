import { describe, it, expect } from "vitest";
import { clamp } from "../src/math";

describe("clamp", () => {
  it("clamps within [min,max]", () => {
    expect(clamp(10, 0, 5)).toBe(5);
  });
});
