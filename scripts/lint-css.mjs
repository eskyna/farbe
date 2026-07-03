import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listFiles, relative } from './file-utils.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cssFiles = listFiles(rootDir, (file) => path.extname(file).toLowerCase() === '.css');
let failures = 0;

function report(file, message) {
  console.error(`lint-css: ${relative(rootDir, file)} - ${message}`);
  failures += 1;
}

for (const file of cssFiles) {
  const text = fs.readFileSync(file, 'utf8');
  const withoutComments = text.replace(/\/\*[\s\S]*?\*\//g, '');

  const openComments = (text.match(/\/\*/g) || []).length;
  const closeComments = (text.match(/\*\//g) || []).length;
  if (openComments !== closeComments) report(file, 'CSS-Kommentar nicht geschlossen');

  let depth = 0;
  for (const [index, char] of [...withoutComments].entries()) {
    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;
    if (depth < 0) {
      report(file, `schliessende Klammer ohne oeffnende Klammer bei Zeichen ${index}`);
      depth = 0;
    }
  }
  if (depth !== 0) report(file, 'CSS-Klammern sind nicht ausgeglichen');

  const invalidShortHex = withoutComments.match(/#[0-9a-fA-F]{1,2}(?![0-9a-fA-F])/g) || [];
  if (invalidShortHex.length) report(file, `verdaechtige Hex-Farbe: ${invalidShortHex[0]}`);
}

if (failures) process.exit(1);
console.log(`lint-css: OK (${cssFiles.length} Dateien).`);

