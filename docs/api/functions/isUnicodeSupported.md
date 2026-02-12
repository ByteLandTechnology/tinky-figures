[**tinky-figures**](../README.md)

---

[tinky-figures](../globals.md) / isUnicodeSupported

# Function: isUnicodeSupported()

> **isUnicodeSupported**(`platform?`, `env?`): `boolean`

Detect if Unicode is supported in the current terminal environment.

This function checks various environment variables and platform settings to determine
if the terminal is capable of displaying Unicode characters comprehensively.
It prioritizes the `TINKY_UNICODE` environment variable if set.

Adapted from `sindresorhus/is-unicode-supported`.

## Parameters

### platform?

`string` = `process.platform`

The operating system platform (default: `process.platform`).

### env?

`Record`\<`string`, `string` \| `undefined`\> = `process.env`

The environment variables object (default: `process.env`).

## Returns

`boolean`

`true` if Unicode is supported, `false` otherwise.
