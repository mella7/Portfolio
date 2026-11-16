// Loads settings from a .env file in the project root, if there is one.
// Lines look like KEY=value; "#" starts a comment; quotes around the value
// are optional. Variables already set in the environment win, so a real
// environment variable always overrides the file.

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export function loadEnv(file = join(dirname(fileURLToPath(import.meta.url)), "..", ".env")) {
  if (!existsSync(file)) return false;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = /^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)$/.exec(line);
    if (!match) continue;
    let value = match[2].trim();
    const quoted = /^(["'])(.*)\1$/.exec(value);
    if (quoted) value = quoted[2];
    else value = value.replace(/\s+#.*$/, ""); // trailing comment on an unquoted value
    if (process.env[match[1]] === undefined) process.env[match[1]] = value;
  }
  return true;
}
