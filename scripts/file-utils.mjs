import fs from 'node:fs';
import path from 'node:path';

const IGNORED_DIRS = new Set(['.git', 'node_modules', 'dist', 'coverage', '.ruff_cache', '__pycache__']);
const TEXT_EXTENSIONS = new Set([
  '.cjs',
  '.css',
  '.feature',
  '.html',
  '.ini',
  '.js',
  '.json',
  '.md',
  '.mjs',
  '.py',
  '.toml',
  '.txt',
  '.webmanifest',
  '.yml',
  '.yaml'
]);
const TEXT_FILENAMES = new Set(['.editorconfig', '.gitignore', '.nvmrc', 'AGENTS.md']);

export function listFiles(rootDir, predicate = () => true) {
  const results = [];
  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      const absolutePath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(absolutePath);
        continue;
      }
      if (entry.isFile() && predicate(absolutePath)) results.push(absolutePath);
    }
  }
  walk(rootDir);
  return results.sort();
}

export function isTextFile(absolutePath) {
  const name = path.basename(absolutePath);
  const ext = path.extname(absolutePath).toLowerCase();
  return TEXT_FILENAMES.has(name) || TEXT_EXTENSIONS.has(ext);
}

export function relative(rootDir, absolutePath) {
  return path.relative(rootDir, absolutePath).replaceAll(path.sep, '/');
}

