const paletteGrid = document.getElementById('paletteGrid');
const photoInput = document.getElementById('photoInput');
const previewWrap = document.getElementById('previewWrap');
const previewCanvas = document.getElementById('previewCanvas');
const result = document.getElementById('result');
const installButton = document.getElementById('installButton');
const installHint = document.getElementById('installHint');
const colorFullscreen = document.getElementById('colorFullscreen');
const ctx = previewCanvas.getContext('2d', { willReadFrequently: true });
const MATCH_THRESHOLD = 18;
let deferredInstallPrompt = null;
let fullscreenColor = null;

const slugFromPage = window.ESKYNA_PALETTE_SLUG || location.pathname.split('/').filter(Boolean).pop();
const activePalette = window.ESKYNA_PALETTES.find((p) => p.slug === slugFromPage) || window.ESKYNA_PALETTES[0];

document.title = activePalette.appName;
const titleNode = document.getElementById('pageTitle');
const paletteNameNode = document.getElementById('paletteName');
if (titleNode) titleNode.textContent = activePalette.name;
if (paletteNameNode) paletteNameNode.textContent = activePalette.name;

renderPalette();
photoInput.addEventListener('change', handlePhoto);
registerServiceWorker();
initializeInstallPrompt();
initializeColorFullscreen();

function renderPalette() {
  paletteGrid.innerHTML = '';
  activePalette.grid.flat().forEach((hex, index) => {
    const tile = document.createElement('div');
    tile.className = 'swatch';
    tile.style.background = hex;
    tile.style.setProperty('--label', readableTextColor(hex));
    tile.style.setProperty('--text-shadow', readableTextColor(hex) === '#fff' ? '0 1px 2px rgba(0,0,0,.55)' : '0 1px 2px rgba(255,255,255,.35)');
    tile.textContent = '';
    tile.title = activePalette.name + ' · Feld ' + (Math.floor(index / 4) + 1) + '/' + ((index % 4) + 1);
    tile.addEventListener('click', () => toggleColorFullscreen(hex));
    paletteGrid.appendChild(tile);
  });
}

function initializeColorFullscreen() {
  if (!colorFullscreen) return;
  colorFullscreen.addEventListener('click', closeColorFullscreen);
}

function toggleColorFullscreen(hex) {
  if (!colorFullscreen) return;

  if (!colorFullscreen.classList.contains('hidden') && fullscreenColor === hex) {
    closeColorFullscreen();
    return;
  }

  fullscreenColor = hex;
  colorFullscreen.style.background = hex;
  colorFullscreen.classList.remove('hidden');
  colorFullscreen.setAttribute('aria-hidden', 'false');
}

function closeColorFullscreen() {
  if (!colorFullscreen) return;
  colorFullscreen.classList.add('hidden');
  colorFullscreen.setAttribute('aria-hidden', 'true');
  fullscreenColor = null;
}

function handlePhoto(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      drawImageToCanvas(img);
      previewWrap.classList.remove('hidden');
      analyzeCanvas();
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function drawImageToCanvas(img) {
  const maxSide = 1200;
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);
  previewCanvas.width = width;
  previewCanvas.height = height;
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
}

function analyzeCanvas() {
  const sampled = sampleCenterColor(previewCanvas, ctx);
  const match = findNearestColor(sampled, activePalette);
  const isInPalette = match.delta <= MATCH_THRESHOLD;
  const row = Math.floor(match.index / 4) + 1;
  const col = (match.index % 4) + 1;

  result.classList.remove('hidden');
  result.innerHTML = `
    <div class="color-chip" style="background:${sampled.hex}" title="Gemessene Foto-Farbe"></div>
    <div class="result-main">
      <div class="result-title">${isInPalette ? 'Auf dieser Palette' : 'Nicht auf dieser Palette'}</div>
      <div class="result-meta">
        Gemessene Farbe gespeichert<br>
        Nächster Ton: Feld ${row}/${col}<br>
        Abstand: ΔE ${match.delta.toFixed(1)}
      </div>
    </div>
    <div class="color-chip" style="background:${match.hex}" title="Nächster Palettenton"></div>
  `;
}

function sampleCenterColor(canvas, context) {
  const w = canvas.width;
  const h = canvas.height;
  const size = Math.max(24, Math.round(Math.min(w, h) * 0.16));
  const x = Math.round((w - size) / 2);
  const y = Math.round((h - size) / 2);
  const image = context.getImageData(x, y, size, size).data;
  const pixels = [];

  for (let i = 0; i < image.length; i += 4) {
    const r = image[i];
    const g = image[i + 1];
    const b = image[i + 2];
    const a = image[i + 3];
    if (a < 250) continue;
    const lum = relativeLuminance(r, g, b);
    pixels.push({ r, g, b, lum });
  }

  if (!pixels.length) return { r: 0, g: 0, b: 0, hex: '#000000', lab: rgbToLab(0, 0, 0) };

  pixels.sort((a, b) => a.lum - b.lum);
  const cut = Math.floor(pixels.length * 0.12);
  const trimmed = pixels.slice(cut, pixels.length - cut);
  const use = trimmed.length ? trimmed : pixels;

  let r = 0, g = 0, b = 0;
  use.forEach((p) => { r += p.r; g += p.g; b += p.b; });
  r = Math.round(r / use.length);
  g = Math.round(g / use.length);
  b = Math.round(b / use.length);
  return { r, g, b, hex: rgbToHex(r, g, b), lab: rgbToLab(r, g, b) };
}

function findNearestColor(sampled, palette) {
  let best = null;
  palette.colors.forEach((hex, index) => {
    const rgb = hexToRgb(hex);
    const lab = rgbToLab(rgb.r, rgb.g, rgb.b);
    const delta = ciede2000(sampled.lab, lab);
    if (!best || delta < best.delta) best = { hex, index, delta };
  });
  return best;
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  const basePath = window.ESKYNA_BASE_PATH || '/farbe/';
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../sw.js', { scope: basePath }).catch(() => {});
  });
}

function initializeInstallPrompt() {
  if (!installButton) return;

  installButton.classList.remove('hidden');
  installButton.disabled = false;

  if (isStandaloneMode()) {
    installButton.disabled = true;
    showInstallHint('Diese App ist bereits installiert.');
    return;
  }

  installButton.addEventListener('click', handleInstallClick);

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installButton.disabled = false;
    showInstallHint('Installieren Sie diese Palette als App auf Ihrem Gerät.');
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    installButton.disabled = true;
    showInstallHint('Die App wurde installiert.');
  });

  if (isIosSafari()) {
    showInstallHint('Auf iPhone oder iPad: Tippen Sie auf Teilen und dann auf Zum Home-Bildschirm.');
    return;
  }

  showInstallHint('Tippen Sie auf App installieren. Falls kein Dialog erscheint, nutzen Sie das Browser-Menue und dann Installieren oder Zum Startbildschirm hinzufuegen.');
}

async function handleInstallClick() {
  if (!deferredInstallPrompt) {
    if (isIosSafari()) {
      showInstallHint('Auf iPhone oder iPad: Tippen Sie auf Teilen und dann auf Zum Home-Bildschirm.');
      return;
    }
    showInstallHint('Bitte nutzen Sie das Browser-Menue und waehlen Sie Installieren oder Zum Startbildschirm hinzufuegen.');
    return;
  }

  installButton.disabled = true;
  await deferredInstallPrompt.prompt();
  const { outcome } = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;

  if (outcome === 'accepted') {
    installButton.disabled = true;
    showInstallHint('Die Installation wurde gestartet.');
    return;
  }

  installButton.disabled = false;
  showInstallHint('Die Installation wurde abgebrochen. Sie koennen es erneut versuchen.');
}

function showInstallHint(message) {
  if (!installHint) return;
  installHint.textContent = message;
  installHint.classList.remove('hidden');
}

function isStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function isIosSafari() {
  const userAgent = window.navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(userAgent);
  const isWebKit = /WebKit/.test(userAgent);
  const isCriOS = /CriOS/.test(userAgent);
  return isIos && isWebKit && !isCriOS;
}

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('').toUpperCase();
}

function relativeLuminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function readableTextColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  return relativeLuminance(r, g, b) < 128 ? '#fff' : '#111';
}

function rgbToLab(r, g, b) {
  let [x, y, z] = rgbToXyz(r, g, b);
  x /= 95.047;
  y /= 100.000;
  z /= 108.883;
  x = labPivot(x);
  y = labPivot(y);
  z = labPivot(z);
  return { L: (116 * y) - 16, a: 500 * (x - y), b: 200 * (y - z) };
}

function rgbToXyz(r, g, b) {
  r = srgbToLinear(r / 255);
  g = srgbToLinear(g / 255);
  b = srgbToLinear(b / 255);
  r *= 100; g *= 100; b *= 100;
  return [
    r * 0.4124 + g * 0.3576 + b * 0.1805,
    r * 0.2126 + g * 0.7152 + b * 0.0722,
    r * 0.0193 + g * 0.1192 + b * 0.9505
  ];
}

function srgbToLinear(v) {
  return v > 0.04045 ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92;
}

function labPivot(v) {
  return v > 0.008856 ? Math.cbrt(v) : (7.787 * v) + (16 / 116);
}

function ciede2000(lab1, lab2) {
  const L1 = lab1.L, a1 = lab1.a, b1 = lab1.b;
  const L2 = lab2.L, a2 = lab2.a, b2 = lab2.b;
  const kL = 1, kC = 1, kH = 1;
  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const Cbar = (C1 + C2) / 2;
  const Cbar7 = Math.pow(Cbar, 7);
  const G = 0.5 * (1 - Math.sqrt(Cbar7 / (Cbar7 + Math.pow(25, 7))));
  const a1p = (1 + G) * a1;
  const a2p = (1 + G) * a2;
  const C1p = Math.sqrt(a1p * a1p + b1 * b1);
  const C2p = Math.sqrt(a2p * a2p + b2 * b2);
  const h1p = hp(a1p, b1);
  const h2p = hp(a2p, b2);
  const dLp = L2 - L1;
  const dCp = C2p - C1p;
  const dhp = deltaHp(C1p, C2p, h1p, h2p);
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(deg2rad(dhp / 2));
  const Lpbar = (L1 + L2) / 2;
  const Cpbar = (C1p + C2p) / 2;
  const hpbar = meanHp(C1p, C2p, h1p, h2p);
  const T = 1
    - 0.17 * Math.cos(deg2rad(hpbar - 30))
    + 0.24 * Math.cos(deg2rad(2 * hpbar))
    + 0.32 * Math.cos(deg2rad(3 * hpbar + 6))
    - 0.20 * Math.cos(deg2rad(4 * hpbar - 63));
  const dTheta = 30 * Math.exp(-Math.pow((hpbar - 275) / 25, 2));
  const Rc = 2 * Math.sqrt(Math.pow(Cpbar, 7) / (Math.pow(Cpbar, 7) + Math.pow(25, 7)));
  const Sl = 1 + (0.015 * Math.pow(Lpbar - 50, 2)) / Math.sqrt(20 + Math.pow(Lpbar - 50, 2));
  const Sc = 1 + 0.045 * Cpbar;
  const Sh = 1 + 0.015 * Cpbar * T;
  const Rt = -Math.sin(deg2rad(2 * dTheta)) * Rc;
  return Math.sqrt(
    Math.pow(dLp / (kL * Sl), 2) +
    Math.pow(dCp / (kC * Sc), 2) +
    Math.pow(dHp / (kH * Sh), 2) +
    Rt * (dCp / (kC * Sc)) * (dHp / (kH * Sh))
  );
}

function hp(a, b) {
  if (a === 0 && b === 0) return 0;
  const hue = rad2deg(Math.atan2(b, a));
  return hue >= 0 ? hue : hue + 360;
}

function deltaHp(C1p, C2p, h1p, h2p) {
  if (C1p * C2p === 0) return 0;
  const diff = h2p - h1p;
  if (Math.abs(diff) <= 180) return diff;
  return diff > 180 ? diff - 360 : diff + 360;
}

function meanHp(C1p, C2p, h1p, h2p) {
  if (C1p * C2p === 0) return h1p + h2p;
  const diff = Math.abs(h1p - h2p);
  if (diff <= 180) return (h1p + h2p) / 2;
  return (h1p + h2p) < 360 ? (h1p + h2p + 360) / 2 : (h1p + h2p - 360) / 2;
}

function deg2rad(deg) { return deg * Math.PI / 180; }
function rad2deg(rad) { return rad * 180 / Math.PI; }
