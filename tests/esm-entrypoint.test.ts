import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

describe("package ESM entrypoint", () => {
  it("can be imported by Node ESM without module resolution errors", () => {
    const entryUrl = pathToFileURL(resolve(process.cwd(), "lib/index.js")).href;
    const script = `import(${JSON.stringify(entryUrl)}).catch((error) => {
      console.error(error?.message ?? error);
      process.exit(1);
    });`;
    const result = spawnSync(
      process.execPath,
      ["--input-type=module", "-e", script],
      {
        encoding: "utf8",
      },
    );

    expect(result.status, result.stderr || result.stdout).toBe(0);
  });
});
