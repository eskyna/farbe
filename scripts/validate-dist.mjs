import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const distDir = path.resolve(process.argv[2] || 'dist');
const HEX_PATTERN = /^#[0-9a-f]{6}$/i;

function fail(message) {
  console.error(`validate-dist: ${message}`);
  process.exitCode = 1;
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readText(relativePath) {
  return fs.readFileSync(path.join(distDir, relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(distDir, relativePath));
}

function evaluatePalettes() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(readText('palettes.js'), sandbox, { filename: 'dist/palettes.js' });
  return sandbox.window.ESKYNA_PALETTES;
}

assert(fs.existsSync(distDir), `Build-Verzeichnis existiert nicht: ${distDir}`);

const requiredFiles = [
  'index.html',
  'manifest.webmanifest',
  'version.json',
  'sw.js',
  'styles.css',
  'palette-app.js',
  'overview.js',
  'palettes.js',
  'i18n.js',
  'assets/sign_gold.png',
  'assets/app-background.jpg',
  'assets/splash-portrait.jpg',
  'assets/splash-landscape.jpg'
];

for (const file of requiredFiles) {
  assert(fileExists(file), `Pflichtdatei fehlt im Dist: ${file}`);
}

const version = readJson('version.json');
assert(typeof version.version === 'string' && version.version.length > 0, 'version.json braucht eine version.');
assert(readText('sw.js').includes(version.version), 'sw.js enthaelt nicht die Build-Version aus version.json.');
assert(readText('index.html').includes('v' + version.version), 'Uebersicht-Splashscreen zeigt nicht die aktuelle Version.');

const commonText = requiredFiles
  .filter((file) => /\.(html|js|css|json|webmanifest)$/.test(file))
  .map(readText)
  .join('\n');
assert(!/__[A-Z0-9_]+__/.test(commonText), 'Dist enthaelt noch Template-Platzhalter.');

const palettes = evaluatePalettes();
assert(Array.isArray(palettes) && palettes.length === 24, `Dist muss 24 Paletten enthalten, gefunden: ${palettes?.length}.`);

for (const palette of palettes) {
  assert(fileExists(`${palette.slug}/index.html`), `Palette ${palette.slug}: index.html fehlt.`);
  assert(fileExists(`${palette.slug}/manifest.webmanifest`), `Palette ${palette.slug}: manifest fehlt.`);

  const paletteHtml = readText(`${palette.slug}/index.html`);
  assert(paletteHtml.includes('customerName'), `Palette ${palette.slug}: Personalisierungsplatz fehlt im HTML.`);
  assert(paletteHtml.includes('v' + version.version), `Palette ${palette.slug}: Splashscreen zeigt nicht die aktuelle Version.`);
  assert(paletteHtml.includes('cameraScanner'), `Palette ${palette.slug}: Live-Scanner fehlt im HTML.`);
  assert(paletteHtml.includes('scannerCancel'), `Palette ${palette.slug}: Scanner-Abbrechen-Button fehlt im HTML.`);
  assert(paletteHtml.includes('scanResultClose'), `Palette ${palette.slug}: Ergebnis-Schliessen-Button fehlt im HTML.`);

  const manifest = readJson(`${palette.slug}/manifest.webmanifest`);
  assert(manifest.start_url?.includes(`/${palette.slug}/`), `Palette ${palette.slug}: start_url zeigt nicht auf die Palette.`);
  assert(Array.isArray(manifest.icons) && manifest.icons.length >= 2, `Palette ${palette.slug}: Manifest braucht mindestens 192px- und 512px-Icons.`);

  for (const icon of manifest.icons) {
    const iconPath = String(icon.src || '').replace(/^\.\.\//, '').replace(/^\/farbe\//, '');
    assert(fileExists(iconPath), `Palette ${palette.slug}: Manifest-Icon fehlt: ${icon.src}`);
  }

  assert(Array.isArray(palette.colors) && palette.colors.length === 24, `Palette ${palette.slug}: colors muss 24 Farben haben.`);
  for (const hex of palette.colors) {
    assert(HEX_PATTERN.test(hex), `Palette ${palette.slug}: ungueltiger Hex-Wert '${hex}'.`);
  }
}

if (!process.exitCode) {
  console.log(`validate-dist: OK (${palettes.length} Paletten, Version ${version.version}).`);
}

