import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { listFiles, relative } from './file-utils.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jsFiles = listFiles(rootDir, (file) => ['.js', '.mjs', '.cjs'].includes(path.extname(file).toLowerCase()));
let failures = 0;

for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    console.error(`lint-js: ${relative(rootDir, file)}`);
    if (result.stderr) console.error(result.stderr.trim());
    if (result.stdout) console.error(result.stdout.trim());
    failures += 1;
  }
}

if (failures) process.exit(1);
console.log(`lint-js: OK (${jsFiles.length} Dateien).`);

