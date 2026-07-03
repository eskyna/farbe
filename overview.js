const grid = document.getElementById('overviewGrid');

initializeSplashScreen();
registerServiceWorker();

function renderOverview() {
  grid.innerHTML = '';
  window.ESKYNA_PALETTES.forEach((palette) => {
    const card = document.createElement('a');
    card.className = 'choice-card';
    card.href = './' + palette.slug + '/';
    card.setAttribute('aria-label', palette.name);

    const mini = document.createElement('div');
    mini.className = 'choice-mini';
    palette.colors.forEach((hex) => {
      const sw = document.createElement('span');
      sw.style.background = hex;
      mini.appendChild(sw);
    });

    const name = document.createElement('div');
    name.className = 'choice-name';
    name.textContent = palette.name;

    card.appendChild(mini);
    card.appendChild(name);
    grid.appendChild(card);
  });
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  const basePath = '/farbe/';
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: basePath }).catch(() => {});
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
