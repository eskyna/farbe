import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const distDir = path.resolve(process.argv[2] || 'dist');
const HEX_PATTERN = /^#[0-9a-f]{6}$/i;
const EXPECTED_PALETTE_COUNT = 12;
const EXPECTED_PALETTE_SLUGS = ['hell_kalt', 'hell_warm', 'tief_kalt', 'tief_warm', 'kalt_sanft', 'kalt_rein', 'warm_sanft', 'warm_rein', 'sanft_warm', 'sanft_kalt', 'rein_warm', 'rein_kalt'];

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
  'assets/app-icon.png',
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
assert(readText('palette-app.js').includes('getColorGlossary'), 'Dist enthaelt keine detaillierten Farbglossare.');
assert(readText('styles.css').includes('color-glossary-profile-grid'), 'Dist enthaelt keine Glossar-Profil-Stile.');
assert(readText('i18n.js').includes('glossary:'), 'Dist enthaelt keine Glossar-Uebersetzungen.');
assert(fileExists('icons/icon-192.png'), 'Zentrales 192px-App-Icon fehlt.');
assert(fileExists('icons/icon-512.png'), 'Zentrales 512px-App-Icon fehlt.');
assert(fileExists('icons/icon-maskable-192.png'), 'Zentrales maskierbares 192px-App-Icon fehlt.');
assert(fileExists('icons/icon-maskable-512.png'), 'Zentrales maskierbares 512px-App-Icon fehlt.');
for (const size of [120, 152, 167, 180]) {
  assert(fileExists(`icons/apple-touch-icon-${size}.png`), `Apple Touch Icon ${size}px fehlt.`);
}
assert(readText('index.html').includes('apple-mobile-web-app-status-bar-style'), 'Uebersicht enthaelt keine iOS-Standalone-Metadaten.');
assert(readText('palette-app.js').includes('isIosDevice'), 'Dist enthaelt keine iOS-Installationserkennung.');
assert(readText('palette-app.js').includes('openIosInstallSheet'), 'Dist enthaelt keine iOS-Installationsanleitung.');

const commonText = requiredFiles
  .filter((file) => /\.(html|js|css|json|webmanifest)$/.test(file))
  .map(readText)
  .join('\n');
assert(!/__[A-Z0-9_]+__/.test(commonText), 'Dist enthaelt noch Template-Platzhalter.');

const palettes = evaluatePalettes();
assert(Array.isArray(palettes) && palettes.length === EXPECTED_PALETTE_COUNT, `Dist muss ${EXPECTED_PALETTE_COUNT} Paletten enthalten, gefunden: ${palettes?.length}.`);
assert(palettes.map((palette) => palette.slug).join('|') === EXPECTED_PALETTE_SLUGS.join('|'), 'Dist-Paletten entsprechen nicht der neuen 12er-Struktur.');

for (const palette of palettes) {
  assert(fileExists(`${palette.slug}/index.html`), `Palette ${palette.slug}: index.html fehlt.`);
  assert(fileExists(`${palette.slug}/manifest.webmanifest`), `Palette ${palette.slug}: manifest fehlt.`);

  const paletteHtml = readText(`${palette.slug}/index.html`);
  assert(paletteHtml.includes('customerName'), `Palette ${palette.slug}: Personalisierungsplatz fehlt im HTML.`);
  assert(paletteHtml.includes('v' + version.version), `Palette ${palette.slug}: Splashscreen zeigt nicht die aktuelle Version.`);
  assert(paletteHtml.includes('cameraScanner'), `Palette ${palette.slug}: Live-Scanner fehlt im HTML.`);
  assert(paletteHtml.includes('scannerCancel'), `Palette ${palette.slug}: Scanner-Abbrechen-Button fehlt im HTML.`);
  assert(paletteHtml.includes('scanResultClose'), `Palette ${palette.slug}: Ergebnis-Schliessen-Button fehlt im HTML.`);
  assert(paletteHtml.includes('iosInstallSheet'), `Palette ${palette.slug}: iOS-Installationsdialog fehlt im HTML.`);
  assert(paletteHtml.includes('apple-touch-icon-180.png'), `Palette ${palette.slug}: Apple-Touch-Icons fehlen im HTML.`);
  assert(paletteHtml.includes('apple-mobile-web-app-status-bar-style'), `Palette ${palette.slug}: iOS-Standalone-Metadaten fehlen.`);

  const manifest = readJson(`${palette.slug}/manifest.webmanifest`);
  assert(manifest.start_url?.includes(`/${palette.slug}/`), `Palette ${palette.slug}: start_url zeigt nicht auf die Palette.`);
  assert(Array.isArray(manifest.icons) && manifest.icons.length >= 4, `Palette ${palette.slug}: Manifest braucht 192px-/512px-Icons fuer any und maskable.`);
  const iconMatrix = new Map();

  for (const icon of manifest.icons) {
    const iconPath = String(icon.src || '').replace(/^\.\.\//, '').replace(/^\/farbe\//, '');
    assert(fileExists(iconPath), `Palette ${palette.slug}: Manifest-Icon fehlt: ${icon.src}`);
    iconMatrix.set(`${icon.sizes}:${icon.purpose || 'any'}`, iconPath);
  }

  assert(iconMatrix.get('192x192:any') === 'icons/icon-192.png', `Palette ${palette.slug}: 192px-any-Icon verweist nicht auf das zentrale App-Icon.`);
  assert(iconMatrix.get('512x512:any') === 'icons/icon-512.png', `Palette ${palette.slug}: 512px-any-Icon verweist nicht auf das zentrale App-Icon.`);
  assert(iconMatrix.get('192x192:maskable') === 'icons/icon-maskable-192.png', `Palette ${palette.slug}: 192px-maskable-Icon fehlt oder ist falsch.`);
  assert(iconMatrix.get('512x512:maskable') === 'icons/icon-maskable-512.png', `Palette ${palette.slug}: 512px-maskable-Icon fehlt oder ist falsch.`);
  assert(fileExists(`icons/${palette.slug}-192.png`), `Palette ${palette.slug}: Legacy-192px-Icon fuer gecachte Android-Manifeste fehlt.`);
  assert(fileExists(`icons/${palette.slug}-512.png`), `Palette ${palette.slug}: Legacy-512px-Icon fuer gecachte Android-Manifeste fehlt.`);
  assert(fileExists(`icons/${palette.slug}-apple-touch-icon.png`), `Palette ${palette.slug}: Legacy-Apple-Icon fehlt.`);
  assert(fileExists(`icons/${palette.slug}.png`), `Palette ${palette.slug}: Legacy-Quell-Icon fehlt.`);

  assert(Array.isArray(palette.colors) && palette.colors.length === 24, `Palette ${palette.slug}: colors muss 24 Farben haben.`);
  for (const hex of palette.colors) {
    assert(HEX_PATTERN.test(hex), `Palette ${palette.slug}: ungueltiger Hex-Wert '${hex}'.`);
  }
}

if (!process.exitCode) {
  console.log(`validate-dist: OK (${palettes.length} Paletten, Version ${version.version}).`);
}

