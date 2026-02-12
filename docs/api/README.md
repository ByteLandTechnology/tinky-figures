**tinky-figures**

---

# tinky-figures

Unicode symbols with ASCII fallbacks for tinky applications - matching the figures npm package character set.

## Installation

```bash
npm install tinky-figures
```

## Usage

```tsx
import { useFigures } from "tinky-figures";

function MyComponent() {
  const figures = useFigures();

  return (
    <>
      <text>{figures.tick} Success!</text>
      <text>{figures.arrowRight} Next step</text>
    </>
  );
}
```

## Features

- ✨ **Full figures compatibility** - Uses the same character set as sindresorhus/figures
- 🔧 **Automatic Unicode detection** - Detects terminal Unicode support via tinky env
- 🎨 **ASCII fallbacks** - Gracefully degrades to ASCII when Unicode isn't supported
- ⚛️ **React Hook API** - Clean `useFigures` hook designed for tinky applications

## Unicode Detection

The hook automatically detects Unicode support based on the `env` object from tinky:

1. **Explicit `TINKY_UNICODE` flag** - If `env.TINKY_UNICODE` is set to `'true'` or `'false'`, uses that value
2. **CI environment** - Disables Unicode in CI environments (checks `env.CI`)
3. **Terminal type** - Checks `env.TERM` for unsupported terminals (e.g., `'dumb'`)
4. **Platform** - Windows CMD and older PowerShell don't support Unicode well unless a modern terminal emulator is detected via `TERM`.

## API

### `useFigures()`

React hook that returns appropriate figures based on the environment from Tinky's `useApp` context.

**Returns:** `FiguresMap` - Object containing all figure characters

### `isUnicodeSupported(platform?, env?)`

Detects if the current environment supports Unicode.

- **platform** (optional): Platform string (default: `process.platform`)
- **env** (optional): Environment variables object (default: `process.env`)
- **Returns:** `boolean` - `true` if Unicode is supported, `false` otherwise

### `unicodeFigures`

Direct access to the full Unicode symbol map (`FiguresMap`).

### `asciiFigures`

Direct access to the ASCII fallback symbol map (`FiguresMap`).

## License

MIT
