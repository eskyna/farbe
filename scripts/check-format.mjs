import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isTextFile, listFiles, relative } from './file-utils.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let failures = 0;

function report(file, message) {
  console.error(`format: ${relative(rootDir, file)} - ${message}`);
  failures += 1;
}

for (const file of listFiles(rootDir, isTextFile)) {
  const text = fs.readFileSync(file, 'utf8');
  if (text.includes('\r')) report(file, 'CRLF/CR-Zeilenenden gefunden');
  if (!text.endsWith('\n')) report(file, 'fehlender finaler Zeilenumbruch');

  const lines = text.split('\n');
  lines.forEach((line, index) => {
    if (/[\t ]+$/.test(line)) report(file, `Trailing Whitespace in Zeile ${index + 1}`);
  });
}

if (failures) {
  console.error(`format: ${failures} Problem(e). Bitte npm run format ausfuehren.`);
  process.exit(1);
}

console.log('format: OK.');

