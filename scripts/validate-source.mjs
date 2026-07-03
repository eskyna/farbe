import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const REQUIRED_FILES = [
  'bin/generate',
  'index.html',
  'templates/palette.html',
  'templates/dist-README.md',
  'styles.css',
  'palette-app.js',
  'overview.js',
  'palettes.js',
  'i18n.js',
  'sw.js',
  'behave.ini',
  'features/README.md',
  'features/environment.py',
  'features/steps/requirements_steps.py',
  'features/support/inspect-app.mjs',
  'features/requirements_palette_content.feature',
  'features/requirements_color_guidance.feature',
  'features/requirements_responsive_layout.feature',
  'features/requirements_pwa_behavior.feature',
  'features/requirements_personalization.feature',
  'features/requirements_project_quality.feature',
  'assets/sign_gold.png',
  'assets/app-background.jpg',
  'assets/splash-portrait.jpg',
  'assets/splash-landscape.jpg'
];

const UI_TRANSLATION_KEYS = [
  'ui.brandWord',
  'ui.customerFor',
  'ui.brandAria',
  'ui.brandAriaFor',
  'ui.pageTitleFor',
  'ui.colorCheck',
  'ui.styleQuestion',
  'ui.installApp',
  'ui.updateApp',
  'ui.colorKnowledge',
  'ui.styleKnowledge',
  'ui.combine',
  'ui.fitMeter',
  'ui.glossaryProfile',
  'ui.glossaryFashion',
  'ui.glossaryShopping',
  'ui.glossaryRelated',
  'glossary.kicker',
  'glossary.profileSummary',
  'glossary.formulas.hero',
  'scan.scannerAria',
  'scan.close',
  'scan.closeShort',
  'scan.cancel',
  'scan.light.good',
  'scan.light.tooDark',
  'scan.light.tooYellow',
  'scan.light.shadow',
  'scan.verdict.veryGood',
  'scan.verdict.unsure',
  'scan.nearestThree'
];

const SUPPORTED_LANGUAGES = ['de', 'en', 'ru'];
const PALETTE_TERMS = new Set(['light', 'cool', 'clear', 'deep', 'warm', 'soft']);
const HEX_PATTERN = /^#[0-9a-f]{6}$/i;

function fail(message) {
  console.error(`validate-source: ${message}`);
  process.exitCode = 1;
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readText(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(rootDir, relativePath));
}

function evaluatePalettes(relativePath = 'palettes.js') {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(readText(relativePath), sandbox, { filename: relativePath });
  return sandbox.window.ESKYNA_PALETTES;
}

function evaluateI18n(language) {
  const documentElement = {
    lang: '',
    attributes: {},
    setAttribute(name, value) {
      this.attributes[name] = value;
    }
  };
  const sandbox = {
    URLSearchParams,
    window: { location: { search: `?lang=${language}` } },
    navigator: { languages: [language], language },
    document: { documentElement }
  };
  vm.createContext(sandbox);
  vm.runInContext(readText('i18n.js'), sandbox, { filename: 'i18n.js' });
  return sandbox.window.ESKYNA_I18N;
}

function flattenGrid(grid) {
  return grid.flatMap((row) => row);
}

function slugFromName(name) {
  return String(name).trim().replace(/\s+/g, '_');
}

for (const file of REQUIRED_FILES) {
  assert(fileExists(file), `Pflichtdatei fehlt: ${file}`);
}

const packageJson = JSON.parse(readText('package.json'));
const requirementsText = readText('requirements-dev.txt');
const ciText = readText('.github/workflows/ci.yml');
const featureFiles = fs.readdirSync(path.join(rootDir, 'features')).filter((file) => /^requirements_.*\.feature$/.test(file));
assert(requirementsText.includes('behave=='), 'requirements-dev.txt muss Behave als Python-Dev-Abhaengigkeit enthalten.');
assert(packageJson.scripts?.['test:bdd']?.includes('behave'), 'package.json braucht ein test:bdd-Skript fuer Behave.');
assert(packageJson.scripts?.check?.includes('npm run test:bdd'), 'npm run check muss die Behave-Cucumber-Tests ausfuehren.');
assert(ciText.includes('npm run check'), 'CI muss npm run check und damit die Behave-Cucumber-Tests ausfuehren.');
assert(featureFiles.length >= 5, `Mindestens 5 Requirement-Feature-Dateien erwartet, gefunden: ${featureFiles.length}.`);

const palettes = evaluatePalettes();
assert(Array.isArray(palettes), 'window.ESKYNA_PALETTES wurde nicht gefunden.');
assert(palettes.length === 24, `Es muessen genau 24 Paletten sein, gefunden: ${palettes.length}.`);

const slugs = new Set();
const ids = new Set();

for (const palette of palettes) {
  assert(Number.isInteger(palette.id), `Palette ohne numerische id: ${JSON.stringify(palette)}`);
  assert(!ids.has(palette.id), `Doppelte Palette-id: ${palette.id}`);
  ids.add(palette.id);

  assert(typeof palette.slug === 'string' && palette.slug.length > 0, `Palette ${palette.id}: slug fehlt.`);
  assert(!slugs.has(palette.slug), `Doppelter Palette-slug: ${palette.slug}`);
  slugs.add(palette.slug);

  assert(slugFromName(palette.name) === palette.slug, `Palette ${palette.slug}: slug passt nicht zum Namen '${palette.name}'.`);
  for (const term of String(palette.name).split(/\s+/)) {
    assert(PALETTE_TERMS.has(term), `Palette ${palette.slug}: unbekannter Palettenbegriff '${term}'.`);
  }

  assert(Array.isArray(palette.grid) && palette.grid.length === 6, `Palette ${palette.slug}: Hochkant-Grid muss 6 Zeilen haben.`);
  for (const [rowIndex, row] of palette.grid.entries()) {
    assert(Array.isArray(row) && row.length === 4, `Palette ${palette.slug}: Zeile ${rowIndex + 1} muss 4 Farben haben.`);
  }

  const flattened = flattenGrid(palette.grid);
  assert(Array.isArray(palette.colors) && palette.colors.length === 24, `Palette ${palette.slug}: colors muss 24 Farben haben.`);
  assert(flattened.join('|') === palette.colors.join('|'), `Palette ${palette.slug}: grid und colors unterscheiden sich.`);

  for (const hex of palette.colors) {
    assert(HEX_PATTERN.test(hex), `Palette ${palette.slug}: ungueltiger Hex-Wert '${hex}'.`);
  }

  const iconWithSlug = `icons/${palette.slug}.png`;
  const iconWithSpaces = `icons/${palette.name}.png`;
  assert(fileExists(iconWithSlug) || fileExists(iconWithSpaces), `Palette ${palette.slug}: Quell-Icon fehlt.`);
  assert(fileExists(`images/${palette.name}.png`), `Palette ${palette.slug}: Referenzbild fehlt.`);
}

const sourceTexts = ['palette-app.js', 'overview.js', 'i18n.js', 'templates/palette.html', 'index.html'].map(readText).join('\n');
assert(!/Feldnummer|field number/i.test(sourceTexts), 'UI darf keine Feldnummern erwaehnen.');
assert(!sourceTexts.includes('Foto wählen'), 'Button-Text "Foto wählen" darf nicht mehr verwendet werden.');
assert(sourceTexts.includes('customerName'), 'Personalisierter Kundinnenname muss im Template/Frontend verdrahtet sein.');
assert(sourceTexts.includes('CUSTOMER_NAME_QUERY_KEYS'), 'Personalisierte Links muessen im Frontend dokumentiert verarbeitet werden.');
assert(sourceTexts.includes('splash-version'), 'Splashscreen muss die App-Version in der unteren Zeile anzeigen.');
assert(sourceTexts.includes('SCAN_POINT_LAYOUT'), 'Farbe pruefen muss mehrere Messpunkte statt einzelner Pixel auswerten.');
assert(sourceTexts.includes('findNearestColors(sampled, activePalette, 3)'), 'Farbe pruefen muss die drei naechsten Farbpass-Toene zeigen.');
assert(sourceTexts.includes('assessLightQuality'), 'Farbe pruefen muss Lichtqualitaet bewerten.');
assert(sourceTexts.includes('scannerCancel'), 'Farbe pruefen braucht einen sichtbaren Zurueck-zur-Farbkarte-Button.');
assert(sourceTexts.includes('scanResultClose'), 'Farberkennung braucht einen sichtbaren Button zurueck zur Farbkarte.');
assert(sourceTexts.includes('closeScanResult'), 'Farberkennung muss Ergebnis und Vorschau wieder ausblenden koennen.');
assert(sourceTexts.includes('scannerSessionId'), 'Farbe pruefen muss laufende Kamera-Starts beim Schliessen sauber abbrechen.');
assert(sourceTexts.includes('getColorGlossary'), 'Vollbild-Farben muessen detaillierte Glossarseiten erzeugen.');
assert(sourceTexts.includes('color-glossary-profile-grid'), 'Glossarseiten muessen ein Farbprofil anzeigen.');
assert(sourceTexts.includes('renderGlossaryRelatedColors'), 'Glossarseiten muessen nahe Farbpass-Toene anzeigen.');

for (const language of SUPPORTED_LANGUAGES) {
  const i18n = evaluateI18n(language);
  assert(i18n?.getLanguage?.() === language, `i18n erkennt '${language}' nicht korrekt.`);
  for (const key of UI_TRANSLATION_KEYS) {
    const value = i18n.t(key, { label: 'Test', name: 'Melissa' });
    assert(typeof value === 'string' && value && value !== key, `i18n ${language}: Key fehlt: ${key}`);
  }
  for (const palette of palettes.slice(0, 3)) {
    const label = i18n.formatPaletteName(palette.name);
    assert(typeof label === 'string' && label.split(/\s+/).length === 3, `i18n ${language}: Palettenname wirkt unvollstaendig.`);
  }
}

if (!process.exitCode) {
  console.log(`validate-source: OK (${palettes.length} Paletten, ${SUPPORTED_LANGUAGES.length} Sprachen, ${featureFiles.length} Feature-Dateien).`);
}

