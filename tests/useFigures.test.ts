import { describe, it, expect, vi } from "vitest";
import { useApp } from "tinky";
import { fallbackSymbols } from "figures";
import { useFigures } from "../src";
import { isUnicodeSupported } from "../src/hooks/useFigures";
import { unicodeFigures } from "../src/data/unicode";
import { asciiFigures } from "../src/data/ascii";

// Mock React's useMemo for hook tests
vi.mock("react", () => ({
  useMemo: (fn: () => unknown) => fn(),
  useContext: vi.fn(),
}));

// Mock useApp from tinky
vi.mock("tinky", () => ({
  useApp: vi.fn(() => ({
    exit: vi.fn(),
    platform: "linux",
    env: { TERM: "xterm-256color" },
  })),
}));

describe("detectUnicodeSupport", () => {
  it("should return true when TINKY_UNICODE is explicitly true", () => {
    expect(isUnicodeSupported("linux", { TINKY_UNICODE: "true" })).toBe(true);
  });

  it("should return false when TINKY_UNICODE is explicitly false", () => {
    expect(isUnicodeSupported("linux", { TINKY_UNICODE: "false" })).toBe(false);
  });

  describe("Non-Windows platforms", () => {
    it("should return false on Linux console (TERM=linux)", () => {
      expect(isUnicodeSupported("linux", { TERM: "linux" })).toBe(false);
    });

    it("should return true for other terms on Linux", () => {
      expect(isUnicodeSupported("linux", { TERM: "xterm-256color" })).toBe(
        true,
      );
    });

    it("should return true for macOS", () => {
      expect(isUnicodeSupported("darwin", { TERM: "xterm-256color" })).toBe(
        true,
      );
    });
  });

  describe("Windows platform", () => {
    it("should return true for Windows Terminal (WT_SESSION)", () => {
      expect(isUnicodeSupported("win32", { WT_SESSION: "some-id" })).toBe(true);
    });

    it("should return true for VS Code", () => {
      expect(isUnicodeSupported("win32", { TERM_PROGRAM: "vscode" })).toBe(
        true,
      );
    });

    it("should return true for xterm-256color on Windows", () => {
      expect(isUnicodeSupported("win32", { TERM: "xterm-256color" })).toBe(
        true,
      );
    });

    it("should return false for default Windows console", () => {
      expect(isUnicodeSupported("win32", {})).toBe(false);
    });
  });
});

describe("useFigures hook", () => {
  it("should return unicode figures when unicode is supported (linux + xterm)", () => {
    vi.mocked(useApp).mockReturnValue({
      exit: vi.fn(),
      platform: "linux",
      env: { TERM: "xterm-256color" },
    });

    const figures = useFigures();
    expect(figures.tick).toBe("✔");
    expect(figures.info).toBe("ℹ");
  });

  it("should return unicode figures for linux console by default", () => {
    vi.mocked(useApp).mockReturnValue({
      exit: vi.fn(),
      platform: "linux",
      env: { TERM: "xterm" },
    });

    const figures = useFigures();
    expect(figures.tick).toBe("✔");
  });

  it("should respect TINKY_UNICODE environment variable", () => {
    vi.mocked(useApp).mockReturnValue({
      exit: vi.fn(),
      platform: "linux",
      env: { TINKY_UNICODE: "false" },
    });

    const figures = useFigures();
    expect(figures.tick).toBe("√");
  });

  it("should automatically use env from useApp context", () => {
    vi.mocked(useApp).mockReturnValue({
      exit: vi.fn(),
      platform: "linux",
      env: { TERM: "xterm-256color" },
    });

    // Unicode should be supported on linux with xterm
    const figures = useFigures();
    expect(figures.tick).toBe("✔");
  });

  it("should work when platform and env are missing", () => {
    vi.mocked(useApp).mockReturnValue({
      exit: vi.fn(),
      platform: "",
      env: {},
    });

    const figures = useFigures();
    // Default should be unicode
    expect(figures.tick).toBe("✔");
  });
});

describe("Character consistency", () => {
  it("should have the same keys in unicode and ascii figures", () => {
    const unicodeKeys = Object.keys(unicodeFigures).sort();
    const asciiKeys = Object.keys(asciiFigures).sort();
    expect(unicodeKeys).toEqual(asciiKeys);
  });

  it("should have non-empty unicode characters", () => {
    Object.values(unicodeFigures).forEach((value) => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it("should have non-empty ascii characters (except intentionally empty)", () => {
    // Some Unicode characters have no ASCII equivalent in figures library
    const figuresEmptyChars = Object.entries(fallbackSymbols)
      .filter(([, value]) => value.length === 0)
      .map(([key]) => key);

    Object.entries(asciiFigures).forEach(([key, value]) => {
      if (!figuresEmptyChars.includes(key)) {
        expect(
          value.length,
          `ASCII character ${key} should not be empty`,
        ).toBeGreaterThan(0);
      }
    });
  });

  it("should have different values for unicode vs ascii (where applicable)", () => {
    const keysWithDifferentValues = [
      "tick",
      "info",
      "warning",
      "cross",
      "pointer",
      "radioOn",
      "checkboxOn",
    ];

    keysWithDifferentValues.forEach((key) => {
      expect(unicodeFigures[key]).not.toBe(asciiFigures[key]);
    });
  });
});
