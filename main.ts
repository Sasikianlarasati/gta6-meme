// gta6-meme-x-01 entry: hands the X post's address to the grader.
//
// The entry is the post itself — a GTA 6 meme my agent made, posted on X
// from a public account with make.fun (or @makefunai) and my play code in its
// text. This program only copies POST.json from the repository root to the
// grader's output directory, where the gate reads it. Node 22, standard
// library only, no network, no wall clock, deterministic: the same input
// bytes always produce the same output bytes.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });

// Validate POST.json before copying, so a malformed file fails loudly here
// instead of silently handing the gate an unusable address.
const source = join(BOT_DIR, 'POST.json');
let parsed: unknown;
try {
  parsed = JSON.parse(readFileSync(source, 'utf8')) as unknown;
} catch (err) {
  console.error(`POST.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}
if (
  typeof parsed !== 'object' ||
  parsed === null ||
  typeof (parsed as { url?: unknown }).url !== 'string'
) {
  console.error('POST.json must be a JSON object with a string "url" field.');
  process.exit(1);
}
try {
  copyFileSync(source, join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
