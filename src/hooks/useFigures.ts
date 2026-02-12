import { useMemo } from "react";
import { useApp } from "tinky";
import { FiguresMap } from "../types/figures";
import { unicodeFigures } from "../data/unicode";
import { asciiFigures } from "../data/ascii";

/**
 * Detect if Unicode is supported in the current terminal environment.
 *
 * This function checks various environment variables and platform settings to determine
 * if the terminal is capable of displaying Unicode characters comprehensively.
 * It prioritizes the `TINKY_UNICODE` environment variable if set.
 *
 * Adapted from `sindresorhus/is-unicode-supported`.
 *
 * @param platform - The operating system platform (default: `process.platform`).
 * @param env - The environment variables object (default: `process.env`).
 * @returns `true` if Unicode is supported, `false` otherwise.
 */
export function isUnicodeSupported(
  platform: string = process.platform,
  env: Record<string, string | undefined> = process.env,
): boolean {
  // If explicitly set via environment variable, use that
  if (env.TINKY_UNICODE === "true") {
    return true;
  }
  if (env.TINKY_UNICODE === "false") {
    return false;
  }

  const { TERM, TERM_PROGRAM } = env;

  if (platform !== "win32") {
    return TERM !== "linux"; // Linux console (kernel)
  }

  return (
    Boolean(env.WT_SESSION) || // Windows Terminal
    Boolean(env.TERMINUS_SUBLIME) || // Terminus (<0.2.27)
    env.ConEmuTask === "{cmd::Cmder}" || // ConEmu and cmder
    TERM_PROGRAM === "Terminus-Sublime" ||
    TERM_PROGRAM === "vscode" ||
    TERM === "xterm-256color" ||
    TERM === "alacritty" ||
    TERM === "rxvt-unicode" ||
    TERM === "rxvt-unicode-256color" ||
    env.TERMINAL_EMULATOR === "JetBrains-JediTerm"
  );
}

/**
 * A React hook that provides a set of figure characters appropriate for the current environment.
 *
 * This hook leverages `useApp()` from `tinky` to access environment details and determines
 * whether to return the full Unicode character set or a fallback ASCII-compatible set.
 *
 * Use this hook to ensure your CLI output renders correctly across different terminals,
 * including those with limited character support (e.g., standard Windows CMD).
 *
 * @returns A `FiguresMap` object containing the character set (Unicode or ASCII fallback).
 *
 * @example
 * ```tsx
 * import { useFigures } from 'tinky-figures';
 * import { Text } from 'tinky';
 *
 * function StatusMessage() {
 *   const figures = useFigures();
 *
 *   return (
 *     <Text>
 *       {figures.tick} Operation completed successfully.
 *     </Text>
 *   );
 * }
 * ```
 */
export function useFigures(): FiguresMap {
  const { platform, env } = useApp();
  const figures = useMemo(() => {
    return isUnicodeSupported(platform, env) ? unicodeFigures : asciiFigures;
  }, [platform, env]);
  return figures;
}
