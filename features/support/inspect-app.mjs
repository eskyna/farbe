import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const rootDir = process.cwd();
const command = process.argv[2] || '';
const language = process.argv[3] || 'de';
const slug = process.argv[4] || 'light_warm_clear';

function readText(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function makeClassList(initial = []) {
  const classes = new Set(initial);
  return {
    add: (...names) => names.forEach((name) => classes.add(name)),
    remove: (...names) => names.forEach((name) => classes.delete(name)),
    contains: (name) => classes.has(name),
    toggle: (name, force) => {
      if (force === undefined) {
        if (classes.has(name)) {
          classes.delete(name);
          return false;
        }
        classes.add(name);
        return true;
      }
      if (force) classes.add(name);
      else classes.delete(name);
      return Boolean(force);
    },
    toArray: () => Array.from(classes)
  };
}

function createElementFactory() {
  const elements = new Map();

  function makeElement(id) {
    return {
      id,
      className: '',
      textContent: '',
      innerHTML: '',
      disabled: false,
      children: [],
      dataset: {},
      attributes: {},
      style: {
        setProperty(name, value) {
          this[name] = value;
        }
      },
      classList: makeClassList(id === 'splashScreen' || id === 'colorFullscreen' ? ['hidden'] : []),
      setAttribute(name, value) {
        this.attributes[name] = value;
      },
      appendChild(child) {
        this.children.push(child);
        return child;
      },
      addEventListener() {},
      remove() {
        this.removed = true;
      },
      querySelector() {
        return makeElement('query');
      },
      querySelectorAll() {
        return [];
      },
      closest() {
        return null;
      },
      getContext() {
        return {
          clearRect() {},
          drawImage() {},
          getImageData() {
            return { data: new Uint8ClampedArray(4) };
          }
        };
      }
    };
  }

  function getElementById(id) {
    if (!elements.has(id)) elements.set(id, makeElement(id));
    return elements.get(id);
  }

  return { makeElement, getElementById };
}

function createBrowserSandbox({ query = '', activeSlug = slug, activeLanguage = language } = {}) {
  const { makeElement, getElementById } = createElementFactory();
  const documentElement = makeElement('html');
  const body = makeElement('body');
  const window = {
    ESKYNA_PALETTE_SLUG: activeSlug,
    ESKYNA_BASE_PATH: '/farbe/',
    location: { pathname: `/farbe/${activeSlug}/`, search: query || `?lang=${activeLanguage}` },
    navigator: {
      languages: [activeLanguage],
      language: activeLanguage,
      standalone: false,
      userAgent: 'BDD'
    },
    addEventListener() {},
    matchMedia: () => ({ matches: false }),
    setTimeout: () => 0,
    setInterval: () => 0
  };
  const document = {
    body,
    documentElement,
    hidden: false,
    getElementById,
    createElement: makeElement,
    addEventListener() {},
    querySelector() {
      return makeElement('query');
    },
    querySelectorAll() {
      return [];
    }
  };

  return {
    window,
    document,
    navigator: window.navigator,
    location: window.location,
    URLSearchParams,
    console,
    Image: class {},
    FileReader: class {},
    Uint8ClampedArray,
    setTimeout: window.setTimeout,
    clearTimeout() {}
  };
}

function evaluateI18n(activeLanguage) {
  const sandbox = createBrowserSandbox({ activeLanguage });
  vm.createContext(sandbox);
  vm.runInContext(readText('i18n.js'), sandbox, { filename: 'i18n.js' });
  const i18n = sandbox.window.ESKYNA_I18N;
  return {
    language: i18n.getLanguage(),
    labels: {
      brandWord: i18n.t('ui.brandWord'),
      colorCheck: i18n.t('ui.colorCheck'),
      styleQuestion: i18n.t('ui.styleQuestion'),
      installApp: i18n.t('ui.installApp'),
      updateApp: i18n.t('ui.updateApp'),
      colorKnowledge: i18n.t('ui.colorKnowledge'),
      styleKnowledge: i18n.t('ui.styleKnowledge'),
      combine: i18n.t('ui.combine'),
      scanScanner: i18n.t('scan.scannerAria'),
      scanLightGood: i18n.t('scan.light.good'),
      scanLightTooDark: i18n.t('scan.light.tooDark'),
      scanLightTooYellow: i18n.t('scan.light.tooYellow'),
      scanLightShadow: i18n.t('scan.light.shadow'),
      scanVerdict: i18n.t('scan.verdict.veryGood', { score: '91' }),
      scanNearestThree: i18n.t('scan.nearestThree'),
      glossaryProfile: i18n.t('ui.glossaryProfile'),
      glossaryFashion: i18n.t('ui.glossaryFashion'),
      glossaryShopping: i18n.t('ui.glossaryShopping'),
      glossaryRelated: i18n.t('ui.glossaryRelated')
    },
    paletteName: i18n.formatPaletteName('light warm clear'),
    pageTitleFor: i18n.getPageTitle('light warm clear', 'Melissa'),
    fitPerfect: i18n.getFit('perfect'),
    fitAway: i18n.getFit('away')
  };
}

function evaluateColorGuidance(activeLanguage) {
  const sandbox = createBrowserSandbox({ activeLanguage });
  vm.createContext(sandbox);
  vm.runInContext(readText('i18n.js'), sandbox, { filename: 'i18n.js' });
  vm.runInContext(readText('palettes.js'), sandbox, { filename: 'palettes.js' });
  const appCode = readText('palette-app.js') + `
    window.__bddColorReport = window.ESKYNA_PALETTES.map((palette) => ({
      slug: palette.slug,
      names: palette.colors.map((hex, index) => describeColor(hex, index, palette).name),
      stories: palette.colors.map((hex, index) => getColorStory(hex, index, palette)),
      glossaries: palette.colors.map((hex, index) => getColorGlossary(hex, index, palette))
    }));
  `;
  vm.runInContext(appCode, sandbox, { filename: 'palette-app.js' });
  return sandbox.window.__bddColorReport;
}

if (command === 'i18n') {
  console.log(JSON.stringify(evaluateI18n(language)));
} else if (command === 'colors') {
  console.log(JSON.stringify(evaluateColorGuidance(language)));
} else {
  fail('Usage: node features/support/inspect-app.mjs <i18n|colors> [language] [slug]');
}

