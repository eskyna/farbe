import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isTextFile, listFiles, relative } from './file-utils.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let changed = 0;

for (const file of listFiles(rootDir, isTextFile)) {
  const original = fs.readFileSync(file, 'utf8');
  const formatted = original
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[\t ]+$/g, ''))
    .join('\n')
    .replace(/\n*$/g, '\n');

  if (formatted !== original) {
    fs.writeFileSync(file, formatted, 'utf8');
    console.log(`formatted ${relative(rootDir, file)}`);
    changed += 1;
  }
}

console.log(`format: ${changed ? `${changed} Datei(en) bereinigt` : 'OK'}.`);

