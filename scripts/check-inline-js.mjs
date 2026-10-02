import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const SCRIPT_BLOCK = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/gi;
const files = process.argv.slice(2);
let failures = 0;

for (const file of files) {
  const html = readFileSync(file, "utf8");
  const blocks = [...html.matchAll(SCRIPT_BLOCK)];

  if (blocks.length === 0) {
    console.log(`${file}: no inline <script> blocks`);
    continue;
  }

  blocks.forEach((block, index) => {
    const temp = join(tmpdir(), `inline-script-${process.pid}-${index}.js`);
    writeFileSync(temp, block[1]);
    const result = spawnSync(process.execPath, ["--check", temp], { encoding: "utf8" });

    if (result.status !== 0) {
      failures += 1;
      console.error(`\n${file} -> inline <script> #${index + 1}`);
      console.error(result.stderr.trim());
    } else {
      console.log(`${file} -> inline <script> #${index + 1}: OK`);
    }
  });
}

if (failures > 0) {
  console.error(`\n${failures} inline script block(s) failed to parse.`);
  process.exit(1);
}
