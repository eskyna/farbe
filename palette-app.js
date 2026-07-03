const paletteGrid = document.getElementById('paletteGrid');
const photoInput = document.getElementById('photoInput');
const previewWrap = document.getElementById('previewWrap');
const previewCanvas = document.getElementById('previewCanvas');
const result = document.getElementById('result');
const installButton = document.getElementById('installButton');
const updateButton = document.getElementById('updateButton');
const installHint = document.getElementById('installHint');
const splashScreen = document.getElementById('splashScreen');
const colorFullscreen = document.getElementById('colorFullscreen');
const ctx = previewCanvas.getContext('2d', { willReadFrequently: true });
const MATCH_THRESHOLD = 18;
let deferredInstallPrompt = null;
let fullscreenColor = null;
let fullscreenColorIndex = null;
let refreshingForUpdate = false;
let waitingServiceWorker = null;

const slugFromPage = window.ESKYNA_PALETTE_SLUG || location.pathname.split('/').filter(Boolean).pop();
const activePalette = window.ESKYNA_PALETTES.find((p) => p.slug === slugFromPage) || window.ESKYNA_PALETTES[0];

document.title = activePalette.appName;
const titleNode = document.getElementById('pageTitle');
const paletteNameNode = document.getElementById('paletteName');
if (titleNode) titleNode.textContent = formatPaletteName(activePalette.name);
if (paletteNameNode) paletteNameNode.textContent = formatPaletteName(activePalette.name);

initializeSplashScreen();
renderPalette();
photoInput.addEventListener('change', handlePhoto);
registerServiceWorker();
initializeInstallPrompt();
initializeColorFullscreen();
initializeResultColorChips();

function renderPalette() {
  paletteGrid.innerHTML = '';
  activePalette.grid.flat().forEach((hex, index) => {
    const tile = document.createElement('div');
    const colorName = describeColor(hex).name;
    tile.className = 'swatch';
    tile.style.background = hex;
    tile.style.setProperty('--label', readableTextColor(hex));
    tile.style.setProperty('--text-shadow', readableTextColor(hex) === '#fff' ? '0 1px 2px rgba(0,0,0,.55)' : '0 1px 2px rgba(255,255,255,.35)');
    tile.textContent = '';
    tile.title = colorName + ' · ' + activePalette.name + ' · Feld ' + (Math.floor(index / 4) + 1) + '/' + ((index % 4) + 1);
    tile.setAttribute('role', 'button');
    tile.setAttribute('tabindex', '0');
    tile.setAttribute('aria-label', colorName + ' erklären');
    tile.addEventListener('click', () => toggleColorFullscreen(hex, index));
    tile.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleColorFullscreen(hex, index);
      }
    });
    paletteGrid.appendChild(tile);
  });
}

function initializeColorFullscreen() {
  if (!colorFullscreen) return;
  colorFullscreen.addEventListener('click', closeColorFullscreen);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !colorFullscreen.classList.contains('hidden')) {
      closeColorFullscreen();
    }
  });
}

function initializeResultColorChips() {
  if (!result) return;
  result.addEventListener('click', (event) => {
    const chip = event.target.closest('[data-fullscreen-color]');
    if (!chip) return;
    toggleColorFullscreen(chip.dataset.fullscreenColor, -1);
  });
}

function toggleColorFullscreen(hex, index) {
  if (!colorFullscreen) return;

  if (!colorFullscreen.classList.contains('hidden') && fullscreenColor === hex && fullscreenColorIndex === index) {
    closeColorFullscreen();
    return;
  }

  showColorFullscreen(hex, index);
}

function showColorFullscreen(hex, index) {
  const story = getColorStory(hex, index, activePalette);
  const isDark = readableTextColor(hex) === '#fff';
  const hasFieldIndex = Number.isInteger(index) && index >= 0;
  const fieldLabel = hasFieldIndex ? 'Feld ' + (Math.floor(index / 4) + 1) + '/' + ((index % 4) + 1) : 'Gemessene Farbe';

  fullscreenColor = hex;
  fullscreenColorIndex = index;
  colorFullscreen.style.background = `radial-gradient(circle at 74% 18%, rgba(255,255,255,${isDark ? '.16' : '.42'}), transparent 20rem), ${hex}`;
  colorFullscreen.classList.toggle('is-dark', isDark);
  colorFullscreen.classList.toggle('is-light', !isDark);
  colorFullscreen.innerHTML = `
    <button class="color-fullscreen-close" type="button" aria-label="Farbansicht schließen">×</button>
    <article class="color-fullscreen-card" aria-label="Erklärung zu ${escapeHtml(story.name)}">
      <div class="color-fullscreen-kicker">Farbwissen · ${escapeHtml(fieldLabel)}</div>
      <div class="color-fullscreen-head">
        <span class="color-fullscreen-dot" style="background:${hex}"></span>
        <div>
          <h2>${escapeHtml(story.name)}</h2>
          <p class="color-fullscreen-hex">${escapeHtml(hex)}</p>
        </div>
      </div>
      <p class="color-fullscreen-tone">${escapeHtml(story.tone)}</p>
      <div class="color-fullscreen-section">
        <span>Stilwissen</span>
        <p>${escapeHtml(story.fact)}</p>
      </div>
      <div class="color-fullscreen-section">
        <span>Kombinieren</span>
        <p>${escapeHtml(story.combinations)}</p>
      </div>
      <p class="color-fullscreen-footnote">Tippe außerhalb der Karte, um zurück zur Farbkarte zu kommen.</p>
    </article>
  `;

  const card = colorFullscreen.querySelector('.color-fullscreen-card');
  const closeButton = colorFullscreen.querySelector('.color-fullscreen-close');
  if (card) card.addEventListener('click', (event) => event.stopPropagation());
  if (closeButton) {
    closeButton.addEventListener('click', (event) => {
      event.stopPropagation();
      closeColorFullscreen();
    });
  }

  colorFullscreen.classList.remove('hidden');
  colorFullscreen.setAttribute('aria-hidden', 'false');
}

function closeColorFullscreen() {
  if (!colorFullscreen) return;
  colorFullscreen.classList.add('hidden');
  colorFullscreen.setAttribute('aria-hidden', 'true');
  colorFullscreen.classList.remove('is-dark', 'is-light');
  colorFullscreen.innerHTML = '';
  fullscreenColor = null;
  fullscreenColorIndex = null;
}

function getColorStory(hex, index, palette) {
  const color = describeColor(hex);
  const paletteNote = getPaletteCombinationNote(palette.name);
  const depthNote = getPaletteDepthNote(palette.name);
  return {
    name: color.name,
    tone: color.tone + ' · ' + formatPaletteName(palette.name),
    fact: color.fact,
    combinations: color.combinations + ' ' + paletteNote + ' ' + depthNote
  };
}

function describeColor(hex) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const h = hsl.h;
  const s = hsl.s;
  const l = hsl.l;

  if (l >= 0.92 && s <= 0.22) {
    return colorStory(
      l > 0.97 ? 'Klares Weiß' : 'Cremeweiß',
      'hell, leicht und sehr neutral',
      'Weiß bringt optische Ruhe in eine Palette und macht kräftige Farben sofort moderner. In der Mode wirkt Weiß besonders hochwertig, wenn Stoffstruktur sichtbar bleibt – etwa bei Baumwolle, Seide oder Leinen.',
      'Kombiniere es als Frischefläche zu fast jedem Ton der Palette. Besonders edel wirkt es mit Camel, Gold, Marine, Espresso oder einem einzigen kräftigen Akzent.'
    );
  }

  if (s <= 0.12) {
    if (l < 0.20) {
      return colorStory(
        'Graphit',
        'dunkel, ruhig und klar',
        'Graphit ist die weichere Alternative zu reinem Schwarz. Es wirkt elegant, ohne helle oder zarte Farben so stark zu überdecken wie Tiefschwarz.',
        'Trage Graphit als Rahmenfarbe zu hellen Tönen, Rosé, Creme oder kühlem Blau. Für mehr Leichtigkeit reicht oft ein heller Schuh oder Schmuck in Gold beziehungsweise Silber.'
      );
    }
    if (l < 0.55) {
      return colorStory(
        'Taupegrau',
        'gedämpft, neutral und vielseitig',
        'Taupe lebt zwischen Grau und Braun und ist deshalb ein sehr erwachsener Neutralton. In Outfits verbindet es farbige Teile, ohne selbst laut zu werden.',
        'Sehr schön zu Creme, Altrosa, Salbei, Denim oder Burgunder. Ton-in-Ton mit Sand und Braun wirkt es besonders ruhig und luxuriös.'
      );
    }
    return colorStory(
      'Greige',
      'hell, sanft und neutral',
      'Greige ist ein Mischton aus Grau und Beige und wirkt dadurch weniger hart als reines Grau. Er ist ideal, wenn ein Look hochwertig, aber nicht streng aussehen soll.',
      'Nutze Greige als Basis zu Pastell, Camel, Weiß oder gedämpften Beerentönen. Mit klaren Farben sorgt es für Balance.'
    );
  }

  if (isBrownHue(h, s, l)) {
    if (l < 0.24) {
      return colorStory(
        'Espresso',
        'tief, warm und elegant',
        'Espresso ist ein luxuriöser Dunkelton und wirkt oft weicher als Schwarz. In Leder, Strick oder Wolle bekommt er besonders viel Tiefe.',
        'Kombiniere Espresso mit Creme, Karamell, Gold, Koralle oder Petrol. Als Accessoirefarbe macht er helle Outfits sofort angezogener.'
      );
    }
    if (l < 0.43) {
      return colorStory(
        h < 28 ? 'Schokobraun' : 'Cognacbraun',
        'warm, geerdet und hochwertig',
        'Brauntöne gehören zu den wichtigsten Neutralfarben der Mode, weil sie natürliche Materialien wie Leder, Wildleder und Wolle besonders edel wirken lassen. Cognac bringt dabei mehr Lebendigkeit als dunkles Braun.',
        'Sehr gut zu Creme, Gold, Oliv, Denim, Terrakotta oder Petrol. Mit Weiß wirkt Braun frisch, mit Beige besonders weich.'
      );
    }
    if (l < 0.66) {
      return colorStory(
        'Camel',
        'warm, weich und klassisch',
        'Camel ist ein Outerwear-Klassiker und macht selbst einfache Outfits angezogen. Der Ton wirkt luxuriös, weil er an Kaschmir, Mantelstoffe und feine Lederwaren erinnert.',
        'Kombiniere Camel mit Creme, Espresso, Gold, Rot, Oliv oder Denim. Monochrom mit Sand und Beige entsteht ein sehr eleganter Look.'
      );
    }
    return colorStory(
      'Sandbeige',
      'hell, warm und zurückhaltend',
      'Sandbeige ist ein leiser Neutralton und lässt Schnitte, Stoffe und Schmuck stärker wirken. Es ist ideal, wenn Farbe nur eine elegante Bühne sein soll.',
      'Trage Sandbeige zu Weiß, Camel, Koralle, warmem Grün oder Braun. Für mehr Kontur helfen dunkle Schuhe, Gürtel oder Tasche.'
    );
  }

  if (h < 12 || h >= 350) {
    if (l < 0.32) {
      return colorStory(
        'Burgunderrot',
        'tief, sinnlich und edel',
        'Burgunderrot wird in Abendmode und Tailoring gern als weichere Alternative zu Schwarz eingesetzt. Es bringt Tiefe, ohne kühl oder hart zu wirken.',
        'Besonders schön zu Creme, Espresso, Camel, Rosé oder Navy. Als Lippenstift-, Schuh- oder Taschenfarbe setzt Burgunder einen eleganten Akzent.'
      );
    }
    return colorStory(
      h >= 350 ? 'Kirschrot' : 'Tomatenrot',
      'klar, lebendig und aufmerksamkeitsstark',
      'Rot ist eine der stärksten Signalfarben in der Mode: Schon kleine Flächen lenken den Blick. Es funktioniert deshalb sehr gut für Schuhe, Lippen, Nägel, Taschen oder ein Statement-Teil.',
      'Kombiniere Rot mit Creme, Weiß, Denim, Camel oder Braun. Für einen modernen Look reicht oft ein rotes Detail zu ruhigen Basics.'
    );
  }

  if (h < 26) {
    return colorStory(
      l > 0.62 ? 'Koralle' : 'Terrakotta',
      'warm, lebendig und sonnengeküsst',
      'Koralle und Terrakotta bringen Wärme ins Gesicht und wirken weniger streng als klassisches Rot. In der Mode funktionieren sie besonders gut in fließenden Stoffen, Strick und sommerlichen Accessoires.',
      'Kombiniere sie mit Creme, Sand, Gold, warmem Braun oder Oliv. Als Akzent beleben sie neutrale Looks sofort.'
    );
  }

  if (h < 45) {
    return colorStory(
      l > 0.66 ? 'Apricot' : 'Rostorange',
      'warm, weich und freundlich',
      'Orange wirkt in der Mode am tragbarsten, wenn es leicht gebrochen ist – als Apricot, Rost oder Kupfer. Diese Töne sehen oft hochwertiger aus als sehr neonhafte Orangetöne.',
      'Sehr harmonisch zu Creme, Camel, Cognac, Oliv und warmem Denim. Mit einem dunklen Neutralton bekommt Orange mehr Eleganz.'
    );
  }

  if (h < 70) {
    if (l > 0.72) {
      return colorStory(
        'Vanillegelb',
        'hell, warm und freundlich',
        'Helles Gelb bringt Licht in ein Outfit und wirkt weicher als kräftiges Sonnengelb. In Blusen, Strick oder Tüchern ist es ein eleganter Frischegeber.',
        'Kombiniere Vanillegelb mit Creme, Sand, Camel, hellem Denim oder warmem Grau. Kleine Goldakzente greifen die Wärme schön auf.'
      );
    }
    return colorStory(
      h < 53 ? 'Goldgelb' : 'Zitronengelb',
      'strahlend, optimistisch und auffällig',
      'Gelb zieht den Blick stark an und wirkt in der Mode besonders modern, wenn es bewusst dosiert wird. Als Tasche, Schuh, Tuch oder Top kann es einem neutralen Look sofort Energie geben.',
      'Sehr gut zu Weiß, Creme, Denim, Navy, Oliv oder Braun. Wenn der Ton sehr klar ist, sollten die Begleiter eher schlicht bleiben.'
    );
  }

  if (h < 165) {
    if (h < 90) {
      return colorStory(
        l < 0.36 ? 'Olivgrün' : 'Lindgrün',
        'natürlich, warm und stilvoll',
        'Oliv ist eine Mode-Neutralfarbe: Es ist farbig, wirkt aber fast so vielseitig wie Braun oder Grau. Lindgrün bringt die frischere, hellere Seite derselben Farbfamilie.',
        'Kombiniere Grün mit Creme, Braun, Camel, Gold, Koralle oder Denim. Für mehr Eleganz funktionieren klare Schnitte und ruhige Accessoires.'
      );
    }
    if (l < 0.28) {
      return colorStory(
        'Tannengrün',
        'tief, ruhig und luxuriös',
        'Tannengrün ist ein klassischer Edelton und wirkt besonders stark in Samt, Wolle, Seide oder Leder. Es gibt dunklen Looks Tiefe, ohne so hart zu sein wie Schwarz.',
        'Sehr schön zu Creme, Gold, Cognac, Rosé, Burgunder oder Navy. Mit hellen Neutralfarben wirkt Tannengrün sofort frischer.'
      );
    }
    return colorStory(
      s < 0.38 ? 'Salbeigrün' : 'Smaragdgrün',
      s < 0.38 ? 'sanft, natürlich und modern' : 'klar, kostbar und präsent',
      s < 0.38
        ? 'Salbeigrün wirkt wie ein ruhiger Neutralton mit Naturbezug. Es ist ideal, wenn ein Outfit farbig, aber nicht laut sein soll.'
        : 'Smaragdgrün wird oft als Schmucksteinfarbe gelesen und wirkt dadurch sofort hochwertig. Es ist ein guter Statement-Ton, weil er intensiv ist, aber weniger aggressiv als Rot.',
      s < 0.38
        ? 'Kombiniere Salbei mit Creme, Greige, Taupe, Rosé oder Denim. Ton-in-Ton mit Beige wirkt es sehr weich.'
        : 'Kombiniere Smaragd mit Creme, Schwarzbraun, Gold, Navy oder einem kleinen Pink-Akzent. Große Flächen brauchen ruhige Begleiter.'
    );
  }

  if (h < 200) {
    return colorStory(
      l < 0.30 ? 'Petrol' : 'Türkis',
      'frisch, elegant und farbig ohne laut zu sein',
      'Petrol und Türkis liegen zwischen Blau und Grün. Genau diese Mischung macht sie in der Mode so spannend: Sie wirken frisch, aber erwachsener als viele reine Blautöne.',
      'Kombiniere Petrol mit Creme, Braun, Gold, Rost, Koralle oder Navy. Türkis wirkt sehr klar mit Weiß und sommerlich mit Sand.'
    );
  }

  if (h < 250) {
    if (l < 0.25) {
      return colorStory(
        'Nachtblau',
        'tief, seriös und elegant',
        'Nachtblau ist ein Business- und Abendklassiker. Es bietet die Tiefe von Schwarz, wirkt aber oft weicher und lässt sich sehr gut mit Schmuckfarben kombinieren.',
        'Sehr schön zu Weiß, Creme, Silber, Gold, Burgunder, Hellblau oder Camel. Für klare Looks kombiniere es mit einem einzigen hellen Kontrast.'
      );
    }
    return colorStory(
      'Kobaltblau',
      'klar, kühl und ausdrucksstark',
      'Kobaltblau wirkt grafisch und modern, besonders wenn der Schnitt schlicht ist. Es ist ideal, um Basics sofort frischer und bewusster wirken zu lassen.',
      'Kombiniere Kobalt mit Weiß, Navy, Silber, Denim, Pink oder einem kleinen Gelbakzent. Bei sehr klaren Blautönen darf der Rest reduziert bleiben.'
    );
  }

  if (h < 320) {
    return colorStory(
      l < 0.34 ? 'Aubergine' : 'Violett',
      'kreativ, weich und geheimnisvoll',
      'Violett- und Auberginetöne wirken weniger erwartbar als Rot oder Blau. In der Mode geben sie einem Outfit Individualität, ohne zwingend laut zu sein.',
      'Kombiniere sie mit Creme, Taupe, Grau, Gold, Rosé oder Tannengrün. Aubergine ist besonders elegant zu Espresso und weichen Wollstoffen.'
    );
  }

  if (h < 350) {
    if (l < 0.38) {
      return colorStory(
        'Beerenton',
        'tief, feminin und elegant',
        'Beerentöne verbinden die Energie von Rot mit der Weichheit von Violett. Deshalb wirken sie auffällig, aber meist edler und ruhiger als reines Pink.',
        'Kombiniere Beere mit Creme, Taupe, Anthrazit, Navy, Rosé oder Gold. Als Akzent ist Beere ideal zu neutralen Outfits.'
      );
    }
    return colorStory(
      l > 0.70 ? 'Puderrosa' : 'Rosenpink',
      'frisch, weich und feminin',
      'Rosé und Pink können ein Outfit sofort leichter wirken lassen. Besonders erwachsen wirken sie, wenn Schnitt und Material klar bleiben – etwa bei Blazer, Bluse, Strick oder Seide.',
      'Kombiniere Rosé mit Creme, Taupe, Camel, Denim oder Braun. Kräftigeres Pink wirkt modern zu Weiß, Navy oder einem klaren Grünakzent.'
    );
  }

  return colorStory(
    'Farbton',
    'individuell und ausdrucksstark',
    'Jeder Farbton verändert seine Wirkung durch Material, Licht und Kombination. Matte Stoffe wirken ruhiger, glänzende Stoffe stärker und festlicher.',
    'Kombiniere diesen Ton mit einem hellen Neutral, einem dunklen Neutral und maximal einem weiteren Akzent aus der Palette.'
  );
}

function colorStory(name, tone, fact, combinations) {
  return { name, tone, fact, combinations };
}

function isBrownHue(h, s, l) {
  return h >= 15 && h <= 58 && ((l < 0.56 && s < 0.72) || (l < 0.40 && s < 0.95));
}

function getPaletteCombinationNote(name) {
  const value = String(name).toLowerCase();
  if (value.includes('warm')) {
    return 'In einer warmen Palette wirken Creme, Gold, Camel, Cognac und warme Naturtöne besonders verbindend.';
  }
  if (value.includes('cool')) {
    return 'In einer kühlen Palette verbinden Weiß, Silber, Taupe, Navy und kühle Rosé- oder Beerentöne den Look besonders sauber.';
  }
  return 'Wähle dazu einen hellen und einen dunklen Ton aus deiner Farbkarte, damit der Look bewusst und nicht zufällig wirkt.';
}

function getPaletteDepthNote(name) {
  const value = String(name).toLowerCase();
  const notes = [];
  if (value.includes('light')) notes.push('Bei Light-Paletten bleiben große Flächen am schönsten hell; dunkle Töne lieber als Kontur einsetzen.');
  if (value.includes('deep')) notes.push('Bei Deep-Paletten darf der Kontrast spürbar sein; helle Töne funktionieren besonders gut als Lichtakzent.');
  if (value.includes('clear')) notes.push('Clear-Paletten vertragen klare Kanten, glatte Stoffe und bewusst gesetzte Kontraste.');
  if (value.includes('soft')) notes.push('Soft-Paletten wirken besonders edel mit Ton-in-Ton, matteren Stoffen und sanften Übergängen.');
  return notes.join(' ');
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0));
        break;
      case g:
        h = ((b - r) / d + 2);
        break;
      default:
        h = ((r - g) / d + 4);
        break;
    }
    h *= 60;
  }

  return { h, s, l };
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  }[char]));
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

  const sampledName = describeColor(sampled.hex).name;
  const matchName = describeColor(match.hex).name;

  result.classList.remove('hidden');
  result.innerHTML = `
    <button class="color-chip" type="button" style="background:${sampled.hex}" title="${escapeHtml(sampledName)} erklären" aria-label="Gemessene Farbe ${escapeHtml(sampledName)} erklären" data-fullscreen-color="${sampled.hex}"></button>
    <div class="result-main">
      <div class="result-title">${isInPalette ? 'Auf dieser Palette' : 'Nicht auf dieser Palette'}</div>
      <div class="result-meta">
        Gemessene Farbe: ${escapeHtml(sampledName)}<br>
        Nächster Ton: ${escapeHtml(matchName)} · Feld ${row}/${col}<br>
        Abstand: ΔE ${match.delta.toFixed(1)}
      </div>
    </div>
    <button class="color-chip" type="button" style="background:${match.hex}" title="${escapeHtml(matchName)} erklären" aria-label="Nächsten Palettenton ${escapeHtml(matchName)} erklären" data-fullscreen-color="${match.hex}"></button>
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

function initializeSplashScreen() {
  if (!splashScreen) return;

  const hideSplash = () => {
    splashScreen.classList.add('splash-hide');
    window.setTimeout(() => splashScreen.remove(), 650);
  };

  splashScreen.addEventListener('click', hideSplash, { once: true });
  window.addEventListener('load', () => window.setTimeout(hideSplash, 1750), { once: true });
  window.setTimeout(hideSplash, 3200);
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  const basePath = window.ESKYNA_BASE_PATH || '/farbe/';

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('../sw.js', { scope: basePath });

      if (registration.waiting && navigator.serviceWorker.controller) {
        showUpdateButton(registration.waiting);
      }

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateButton(newWorker);
          }
        });
      });

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshingForUpdate) return;
        refreshingForUpdate = true;
        window.location.reload();
      });

      registration.update().catch(() => {});
    } catch (error) {
      // Kein sichtbarer Fehler: Die Farbkarte funktioniert auch ohne Service Worker.
    }
  });
}

function showUpdateButton(worker) {
  if (!updateButton || !worker) return;

  waitingServiceWorker = worker;
  hideInstallButton();
  updateButton.disabled = false;
  updateButton.classList.remove('hidden');
  document.body.classList.add('has-update');
}

function initializeInstallPrompt() {
  if (!installButton) return;

  hideInstallButton();

  if (updateButton) {
    updateButton.addEventListener('click', handleUpdateClick);
  }

  if (isStandaloneMode()) return;

  installButton.addEventListener('click', handleInstallClick);

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    showInstallButton();
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    hideInstallButton();
  });

}

async function handleInstallClick() {
  if (!deferredInstallPrompt) return;

  installButton.disabled = true;
  await deferredInstallPrompt.prompt();
  const { outcome } = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;

  if (outcome === 'accepted') {
    hideInstallButton();
    return;
  }

  installButton.disabled = false;
  showInstallButton();
}

function handleUpdateClick() {
  if (!waitingServiceWorker) return;

  updateButton.disabled = true;
  updateButton.textContent = 'Aktualisiere ...';
  waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
}

function showInstallButton() {
  if (!installButton || isStandaloneMode() || document.body.classList.contains('has-update')) return;
  installButton.disabled = false;
  installButton.classList.remove('hidden');
  document.body.classList.add('has-install');
}

function hideInstallButton() {
  if (!installButton) return;
  installButton.classList.add('hidden');
  installButton.disabled = true;
  document.body.classList.remove('has-install');
}

function showInstallHint(message) {
  if (!installHint) return;
  installHint.textContent = message || '';
  installHint.classList.toggle('hidden', !message);
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

function formatPaletteName(name) {
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
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
