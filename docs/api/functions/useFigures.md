[**tinky-figures**](../README.md)

---

[tinky-figures](../globals.md) / useFigures

# Function: useFigures()

> **useFigures**(): [`FiguresMap`](../interfaces/FiguresMap.md)

A React hook that provides a set of figure characters appropriate for the current environment.

This hook leverages `useApp()` from `tinky` to access environment details and determines
whether to return the full Unicode character set or a fallback ASCII-compatible set.

Use this hook to ensure your CLI output renders correctly across different terminals,
including those with limited character support (e.g., standard Windows CMD).

## Returns

[`FiguresMap`](../interfaces/FiguresMap.md)

A `FiguresMap` object containing the character set (Unicode or ASCII fallback).

## Example

```tsx
import { useFigures } from "tinky-figures";
import { Text } from "tinky";

function StatusMessage() {
  const figures = useFigures();

  return <Text>{figures.tick} Operation completed successfully.</Text>;
}
```
