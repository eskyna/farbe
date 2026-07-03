import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listFiles, relative } from './file-utils.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlFiles = listFiles(rootDir, (file) => path.extname(file).toLowerCase() === '.html');
const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
let failures = 0;

function report(file, message) {
  console.error(`lint-html: ${relative(rootDir, file)} - ${message}`);
  failures += 1;
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  if (!/^<!doctype html>/i.test(html.trimStart())) report(file, 'doctype fehlt oder steht nicht am Anfang');
  if (!/<title>[^<]+<\/title>/i.test(html)) report(file, 'title fehlt');

  const ids = new Set();
  for (const match of html.matchAll(/\sid="([^"]+)"/g)) {
    const id = match[1];
    if (ids.has(id)) report(file, `doppelte id: ${id}`);
    ids.add(id);
  }

  const stack = [];
  for (const match of html.matchAll(/<\/?([a-zA-Z][a-zA-Z0-9-]*)(?:\s[^>]*)?>/g)) {
    const raw = match[0];
    const tag = match[1].toLowerCase();
    if (raw.startsWith('<!') || raw.startsWith('<?') || VOID_TAGS.has(tag) || raw.endsWith('/>')) continue;
    if (!raw.startsWith('</')) {
      stack.push(tag);
      continue;
    }
    const last = stack.pop();
    if (last !== tag) {
      report(file, `Tag-Reihenfolge wirkt ungueltig: erwartet </${last || 'nichts'}>, gefunden </${tag}>`);
      break;
    }
  }
  if (stack.length) report(file, `nicht geschlossene Tags: ${stack.slice(-5).join(', ')}`);
}

if (failures) process.exit(1);
console.log(`lint-html: OK (${htmlFiles.length} Dateien).`);

