import { describe, it, expect } from "vitest";
import { mainSymbols, fallbackSymbols } from "figures";
import { unicodeFigures, asciiFigures } from "../src/data";
import { FiguresMap } from "../src/types/figures";

describe("Figures Library Compatibility", () => {
  const ourKeys = Object.keys(unicodeFigures).sort();
  const figuresKeys = Object.keys(mainSymbols).sort();

  it("should have all keys from the figures library", () => {
    const missingKeys = figuresKeys.filter((key) => !ourKeys.includes(key));
    expect(
      missingKeys,
      "We should implement all keys present in the figures library",
    ).toEqual([]);
  });

  it("should not have extra keys that are not in the figures library", () => {
    const extraKeys = ourKeys.filter((key) => !figuresKeys.includes(key));
    // It's okay to have extra keys if they are intentional, but let's list them
    const intentionalExtras = [
      "arrowUpLeft",
      "arrowUpRight",
      "arrowDownLeft",
      "arrowDownRight",
      "topLeftCorner",
      "topRightCorner",
      "bottomLeftCorner",
      "bottomRightCorner",
      "teeUp",
      "teeDown",
      "teeLeft",
      "teeRight",
      "circleQuestion",
    ];
    const unexpectedExtras = extraKeys.filter(
      (key) => !intentionalExtras.includes(key),
    );
    expect(
      unexpectedExtras,
      "Extra keys found that are not in figures library",
    ).toEqual([]);
  });

  describe("Unicode Symbols", () => {
    figuresKeys.forEach((key) => {
      it(`should match Unicode symbol for ${key}`, () => {
        const ourValue = unicodeFigures[key as keyof FiguresMap];
        const figuresValue = (mainSymbols as Record<string, string>)[key];
        expect(ourValue, `Unicode symbol for ${key} mismatch`).toBe(
          figuresValue,
        );
      });
    });
  });

  describe("ASCII Fallback Symbols", () => {
    figuresKeys.forEach((key) => {
      it(`should match ASCII fallback symbol for ${key}`, () => {
        const ourValue = asciiFigures[key as keyof FiguresMap];
        const figuresValue = (fallbackSymbols as Record<string, string>)[key];
        expect(ourValue, `ASCII fallback symbol for ${key} mismatch`).toBe(
          figuresValue,
        );
      });
    });
  });

  describe("Consistency", () => {
    it("should have identical keys in both unicode and ascii sets", () => {
      const unicodeSet = Object.keys(unicodeFigures).sort();
      const asciiSet = Object.keys(asciiFigures).sort();
      expect(unicodeSet).toEqual(asciiSet);
    });
  });

  describe("Intentional Extras", () => {
    const extras: Record<string, { unicode: string; ascii: string }> = {
      arrowUpLeft: { unicode: "↖", ascii: "\\" },
      arrowUpRight: { unicode: "↗", ascii: "/" },
      arrowDownLeft: { unicode: "↙", ascii: "/" },
      arrowDownRight: { unicode: "↘", ascii: "\\" },
      circleQuestion: { unicode: "❔", ascii: "(?)" },
      topLeftCorner: { unicode: "┌", ascii: "┌" },
      topRightCorner: { unicode: "┐", ascii: "┐" },
      bottomLeftCorner: { unicode: "└", ascii: "└" },
      bottomRightCorner: { unicode: "┘", ascii: "┘" },
      teeUp: { unicode: "┴", ascii: "┴" },
      teeDown: { unicode: "┬", ascii: "┬" },
      teeLeft: { unicode: "┤", ascii: "┤" },
      teeRight: { unicode: "├", ascii: "├" },
    };

    Object.entries(extras).forEach(([key, values]) => {
      it(`should have correct values for extra: ${key}`, () => {
        expect(unicodeFigures[key as keyof FiguresMap]).toBe(values.unicode);
        expect(asciiFigures[key as keyof FiguresMap]).toBe(values.ascii);
      });
    });
  });
});
