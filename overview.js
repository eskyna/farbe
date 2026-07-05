const grid = document.getElementById('overviewGrid');
const I18N = window.ESKYNA_I18N || createOverviewFallbackI18n();

I18N.applyDocumentLanguage();
document.title = I18N.getOverviewTitle();
applyOverviewTranslations();
initializeSplashScreen();
registerServiceWorker();

function applyOverviewTranslations() {
  const brandWord = document.querySelector('.brand-farbe');
  const header = document.querySelector('.hero');
  const logoLink = document.querySelector('.hero-logo-link');
  const logo = document.querySelector('.hero-logo');

  if (brandWord) brandWord.textContent = I18N.t('ui.brandWord');
  if (header) header.setAttribute('aria-label', I18N.t('ui.brandAria'));
  if (logoLink) logoLink.setAttribute('aria-label', I18N.t('ui.openEskyna'));
  if (logo) logo.setAttribute('alt', I18N.t('ui.symbolAlt'));
  if (grid) grid.setAttribute('aria-label', I18N.t('ui.overviewSelection'));
}

function renderOverview() {
  grid.innerHTML = '';
  window.ESKYNA_PALETTES.forEach((palette) => {
    const paletteLabel = I18N.formatPaletteName(palette.name);
    const card = document.createElement('a');
    card.className = 'choice-card';
    card.href = './' + palette.slug + '/';
    card.setAttribute('aria-label', paletteLabel);

    const mini = document.createElement('div');
    mini.className = 'choice-mini';
    palette.colors.forEach((hex) => {
      const sw = document.createElement('span');
      sw.style.background = hex;
      mini.appendChild(sw);
    });

    const name = document.createElement('div');
    name.className = 'choice-name';
    name.textContent = paletteLabel;

    card.appendChild(mini);
    card.appendChild(name);
    grid.appendChild(card);
  });
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  const basePath = '/farbe/';
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: basePath, updateViaCache: 'none' }).catch(() => {});
  });
}

renderOverview();

function initializeSplashScreen() {
  const splashScreen = document.getElementById('splashScreen');
  if (!splashScreen) return;

  const hideSplash = () => {
    splashScreen.classList.add('splash-hide');
    window.setTimeout(() => splashScreen.remove(), 650);
  };

  splashScreen.addEventListener('click', hideSplash, { once: true });
  window.addEventListener('load', () => window.setTimeout(hideSplash, 1750), { once: true });
  window.setTimeout(hideSplash, 3200);
}

function createOverviewFallbackI18n() {
  const paletteTerms = { hell: 'Light', kalt: 'Cool', warm: 'Warm', tief: 'Deep', sanft: 'Soft', rein: 'Pure', light: 'Light', cool: 'Cool', clear: 'Clear', deep: 'Deep', soft: 'Soft' };
  return {
    applyDocumentLanguage() {},
    getOverviewTitle() { return 'ESKYNA Farbe'; },
    t(path) {
      return {
        'ui.brandWord': 'Farbe',
        'ui.brandAria': 'ESKYNA Farbe',
        'ui.openEskyna': 'ESKYNA Website öffnen',
        'ui.symbolAlt': 'ESKYNA Symbol',
        'ui.overviewSelection': 'Farbkarten Auswahl'
      }[path] || path;
    },
    formatPaletteName(name) {
      return String(name || '').split(/\s+/).filter(Boolean).map((part) => paletteTerms[part] || part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
    }
  };
}

