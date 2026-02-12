/**
 * tinky-figures
 *
 * A library providing Unicode symbols with automatic ASCII fallbacks for Tinky applications.
 * It matches the character set of the popular `figures` npm package.
 *
 * @packageDocumentation
 */

export { useFigures, isUnicodeSupported } from "./hooks/useFigures";
export type { FiguresMap } from "./types/figures";
export { unicodeFigures, asciiFigures } from "./data";
