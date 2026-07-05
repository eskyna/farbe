const paletteGrid = document.getElementById('paletteGrid');
const photoInput = document.getElementById('photoInput');
const scanButton = document.getElementById('scanButton');
const previewWrap = document.getElementById('previewWrap');
const previewCanvas = document.getElementById('previewCanvas');
const scanSessionToolbar = document.getElementById('scanSessionToolbar');
const scanSessionTitle = document.getElementById('scanSessionTitle');
const scanResultClose = document.getElementById('scanResultClose');
const result = document.getElementById('result');
const installButton = document.getElementById('installButton');
const updateButton = document.getElementById('updateButton');
const installHint = document.getElementById('installHint');
const iosInstallSheet = document.getElementById('iosInstallSheet');
const iosInstallClose = document.getElementById('iosInstallClose');
const iosInstallKicker = document.getElementById('iosInstallKicker');
const iosInstallTitle = document.getElementById('iosInstallTitle');
const iosInstallIntro = document.getElementById('iosInstallIntro');
const iosInstallStepOpenSafari = document.getElementById('iosInstallStepOpenSafari');
const iosInstallStepShare = document.getElementById('iosInstallStepShare');
const iosInstallStepAdd = document.getElementById('iosInstallStepAdd');
const iosInstallStepConfirm = document.getElementById('iosInstallStepConfirm');
const iosInstallSafariNote = document.getElementById('iosInstallSafariNote');
const iosInstallCopy = document.getElementById('iosInstallCopy');
const iosInstallDone = document.getElementById('iosInstallDone');
const splashScreen = document.getElementById('splashScreen');
const colorFullscreen = document.getElementById('colorFullscreen');
const cameraScanner = document.getElementById('cameraScanner');
const scannerVideo = document.getElementById('scannerVideo');
const scannerCanvas = document.getElementById('scannerCanvas');
const scannerQuality = document.getElementById('scannerQuality');
const scannerHint = document.getElementById('scannerHint');
const scannerClose = document.getElementById('scannerClose');
const scannerCloseLabel = scannerClose ? scannerClose.querySelector('.scanner-close-label') : null;
const scannerCancel = document.getElementById('scannerCancel');
const scannerCapture = document.getElementById('scannerCapture');
const scannerFileFallback = document.getElementById('scannerFileFallback');
const ctx = previewCanvas.getContext('2d', { willReadFrequently: true });
const scannerCtx = scannerCanvas ? scannerCanvas.getContext('2d', { willReadFrequently: true }) : null;
const ESKYNA_APP_VERSION = "__ESKYNA_APP_VERSION__";
const UPDATE_CHECK_INTERVAL = 15 * 60 * 1000;
const MATCH_THRESHOLD = 18;
const SCAN_TARGET_RADIUS_RATIO = 0.18;
const SCAN_POINT_LAYOUT = [
  [0, 0],
  [-0.46, 0],
  [0.46, 0],
  [0, -0.46],
  [0, 0.46],
  [-0.34, -0.34],
  [0.34, -0.34],
  [-0.34, 0.34],
  [0.34, 0.34],
  [-0.68, 0],
  [0.68, 0],
  [0, -0.68],
  [0, 0.68]
];
const SCANNER_QUALITY_INTERVAL = 520;
const CUSTOMER_NAME_STORAGE_PREFIX = 'eskyna-farbe-customer-name:';
const CUSTOMER_NAME_QUERY_KEYS = ['name', 'kundin', 'customer', 'client'];
let deferredInstallPrompt = null;
let fullscreenColor = null;
let fullscreenColorIndex = null;
let refreshingForUpdate = false;
let waitingServiceWorker = null;
let forceUpdateReload = false;
let serviceWorkerRegistration = null;
let updateCheckTimer = null;
let cameraStream = null;
let scannerQualityTimer = null;
let scannerSessionId = 0;

const slugFromPage = window.ESKYNA_PALETTE_SLUG || location.pathname.split('/').filter(Boolean).pop();
const activePalette = window.ESKYNA_PALETTES.find((p) => p.slug === slugFromPage) || window.ESKYNA_PALETTES[0];
const I18N = window.ESKYNA_I18N || createFallbackI18n();
const activeCustomerName = initializeCustomerName(activePalette.slug || slugFromPage);

const COLOR_NAME_VARIANTS = {
  "de": {
    "whiteClear": [
      "Schneeweiß",
      "Porzellanweiß",
      "Kreideweiß",
      "Kristallweiß",
      "Optic White",
      "Reinweiß"
    ],
    "whiteCream": [
      "Cremeweiß",
      "Elfenbein",
      "Champagnerweiß",
      "Vanillecreme",
      "Eierschale",
      "Milchweiß"
    ],
    "graphite": [
      "Graphit",
      "Anthrazit",
      "Schiefergrau",
      "Tiefgrau",
      "Kohle",
      "Schwarzgrau",
      "Dunkelgraphit"
    ],
    "taupeGrey": [
      "Taupegrau",
      "Steingrau",
      "Rauchgrau",
      "Zinngrau",
      "Warmgrau",
      "Aschbraun",
      "Mushroom"
    ],
    "greige": [
      "Greige",
      "Leinengrau",
      "Perlgrau",
      "Kieselbeige",
      "Nebelbeige",
      "Soft Taupe"
    ],
    "espresso": [
      "Espresso",
      "Mokka",
      "Dunkler Kakao",
      "Kaffeebraun",
      "Schwarzbraun",
      "Röstbraun",
      "Bitterschokolade",
      "Tiefmokka",
      "Braunschwarz"
    ],
    "chocolateBrown": [
      "Schokobraun",
      "Kakaobraun",
      "Walnussbraun",
      "Maronenbraun",
      "Kastanienbraun",
      "Haselnussbraun",
      "Erdbraun",
      "Mahagoni"
    ],
    "cognacBrown": [
      "Cognacbraun",
      "Karamellbraun",
      "Lederbraun",
      "Tabakbraun",
      "Bernsteinbraun",
      "Kupferbraun",
      "Zimtbraun",
      "Toffee"
    ],
    "camel": [
      "Camel",
      "Kaschmirbeige",
      "Honigbeige",
      "Kamelhaar",
      "Goldbeige",
      "Haferbeige",
      "Nussbeige"
    ],
    "sandBeige": [
      "Sandbeige",
      "Saharabeige",
      "Leinenbeige",
      "Champagnerbeige",
      "Muschelbeige",
      "Nude Beige",
      "Vanillebeige",
      "Dünenbeige"
    ],
    "burgundy": [
      "Bordeaux",
      "Burgunderrot",
      "Merlot",
      "Granatrot",
      "Weinrot",
      "Schwarzkirsche",
      "Rubinbraun",
      "Cranberryrot",
      "Pflaumenrot",
      "Ochsenblut"
    ],
    "cherryRed": [
      "Kirschrot",
      "Rubinrot",
      "Mohnrot",
      "Klarrot",
      "Signalrot",
      "Apfelrot",
      "Erdbeerrot"
    ],
    "tomatoRed": [
      "Tomatenrot",
      "Paprikarot",
      "Geranienrot",
      "Warmrot",
      "Feuerrot",
      "Korallenrot"
    ],
    "coral": [
      "Koralle",
      "Lachsrot",
      "Hummerrot",
      "Papaya",
      "Wassermelone",
      "Melonenrot"
    ],
    "terracotta": [
      "Terrakotta",
      "Ziegelrot",
      "Rostrot",
      "Siena",
      "Tonrot",
      "Kupferrot"
    ],
    "apricot": [
      "Apricot",
      "Pfirsich",
      "Aprikosencreme",
      "Melba",
      "Soft Peach",
      "Nektarine",
      "Rosé-Apricot"
    ],
    "rustOrange": [
      "Rostorange",
      "Zimtorange",
      "Kupferorange",
      "Mango",
      "Kürbis",
      "Curryorange",
      "Amber Orange"
    ],
    "vanillaYellow": [
      "Vanillegelb",
      "Buttercreme",
      "Primelgelb",
      "Champagnergelb",
      "Cremegelb",
      "Sorbetgelb",
      "Maisgelb hell"
    ],
    "goldenYellow": [
      "Goldgelb",
      "Sonnengelb",
      "Safrangelb",
      "Honiggelb",
      "Maisgelb",
      "Bernsteingelb",
      "Senfgold"
    ],
    "lemonYellow": [
      "Zitronengelb",
      "Limonengelb",
      "Klargelb",
      "Frühlingsgelb",
      "Chartreusegelb",
      "Leuchtgelb",
      "Lindengelb",
      "Primelgelb klar"
    ],
    "oliveGreen": [
      "Olivgrün",
      "Moosgrün",
      "Khakioliv",
      "Artischocke",
      "Lorbeergrün",
      "Tannennadel",
      "Dunkles Erbsengrün"
    ],
    "limeGreen": [
      "Lindgrün",
      "Limettengrün",
      "Apfelgrün",
      "Pistazie",
      "Frühlingsgrün",
      "Chartreusegrün",
      "Birnengrün"
    ],
    "forestGreen": [
      "Tannengrün",
      "Waldgrün",
      "Flaschengrün",
      "Dunkelsmaragd",
      "Jagdgrün",
      "Piniengrün"
    ],
    "sageGreen": [
      "Salbeigrün",
      "Eukalyptus",
      "Schilfgrün",
      "Nebelgrün",
      "Graugrün",
      "Minzsalbei",
      "Staubiges Grün"
    ],
    "emeraldGreen": [
      "Smaragdgrün",
      "Jadegrün",
      "Malachit",
      "Kleeblattgrün",
      "Brillantgrün",
      "Viridiangrün",
      "Pfauengrün"
    ],
    "petrol": [
      "Petrol",
      "Tiefpetrol",
      "Teal",
      "Ozeanpetrol",
      "Blaugrün tief",
      "Pfauenblau",
      "Tintenpetrol"
    ],
    "turquoise": [
      "Türkis",
      "Aquamarin",
      "Lagunenblau",
      "Karibiktürkis",
      "Poolblau",
      "Minttürkis",
      "Eispetrol"
    ],
    "nightBlue": [
      "Nachtblau",
      "Marineblau",
      "Tintenblau",
      "Mitternachtsblau",
      "Dunkelnavy",
      "Preußischblau",
      "Schwarzblau"
    ],
    "cobaltBlue": [
      "Kobaltblau",
      "Royalblau",
      "Ultramarin",
      "Azurblau",
      "Klarblau",
      "Saphirblau",
      "Denimblau"
    ],
    "aubergine": [
      "Aubergine",
      "Dunkelviolett",
      "Pflaume",
      "Brombeere",
      "Dunkler Amethyst",
      "Violettbraun"
    ],
    "violet": [
      "Violett",
      "Flieder",
      "Amethyst",
      "Lavendelviolett",
      "Orchidee",
      "Veilchen",
      "Purpur"
    ],
    "berry": [
      "Beerenton",
      "Himbeerrot",
      "Brombeerrot",
      "Johannisbeere",
      "Cassis",
      "Fuchsia tief",
      "Magenta-Beere"
    ],
    "powderPink": [
      "Puderrosa",
      "Blush",
      "Rosé hell",
      "Balletrosa",
      "Nude Rosé",
      "Altrosa hell",
      "Zartrosa"
    ],
    "rosePink": [
      "Rosenpink",
      "Himbeerpink",
      "Fuchsia",
      "Pink",
      "Wassermelonenpink",
      "Bougainvillea",
      "Kirschblüte"
    ],
    "generic": [
      "Farbton",
      "Akzentton",
      "Modeton",
      "Nuanceton"
    ]
  },
  "en": {
    "whiteClear": [
      "Snow White",
      "Porcelain White",
      "Chalk White",
      "Crystal White",
      "Optic White",
      "Pure White"
    ],
    "whiteCream": [
      "Cream White",
      "Ivory",
      "Champagne White",
      "Vanilla Cream",
      "Eggshell",
      "Milk White"
    ],
    "graphite": [
      "Graphite",
      "Anthracite",
      "Slate Grey",
      "Deep Grey",
      "Charcoal",
      "Blackened Grey",
      "Dark Graphite"
    ],
    "taupeGrey": [
      "Taupe Grey",
      "Stone Grey",
      "Smoke Grey",
      "Pewter",
      "Warm Grey",
      "Ash Brown",
      "Mushroom"
    ],
    "greige": [
      "Greige",
      "Linen Grey",
      "Pearl Grey",
      "Pebble Beige",
      "Mist Beige",
      "Soft Taupe"
    ],
    "espresso": [
      "Espresso",
      "Mocha",
      "Dark Cocoa",
      "Coffee Brown",
      "Black Brown",
      "Roast Brown",
      "Bittersweet Chocolate",
      "Deep Mocha",
      "Brown Black"
    ],
    "chocolateBrown": [
      "Chocolate Brown",
      "Cocoa Brown",
      "Walnut Brown",
      "Chestnut Brown",
      "Marron",
      "Hazelnut Brown",
      "Earth Brown",
      "Mahogany"
    ],
    "cognacBrown": [
      "Cognac Brown",
      "Caramel Brown",
      "Leather Brown",
      "Tobacco Brown",
      "Amber Brown",
      "Copper Brown",
      "Cinnamon Brown",
      "Toffee"
    ],
    "camel": [
      "Camel",
      "Cashmere Beige",
      "Honey Beige",
      "Camel Hair",
      "Golden Beige",
      "Oat Beige",
      "Nut Beige"
    ],
    "sandBeige": [
      "Sand Beige",
      "Sahara Beige",
      "Linen Beige",
      "Champagne Beige",
      "Shell Beige",
      "Nude Beige",
      "Vanilla Beige",
      "Dune Beige"
    ],
    "burgundy": [
      "Bordeaux",
      "Burgundy",
      "Merlot",
      "Garnet Red",
      "Wine Red",
      "Black Cherry",
      "Brown Ruby",
      "Cranberry Red",
      "Plum Red",
      "Oxblood"
    ],
    "cherryRed": [
      "Cherry Red",
      "Ruby Red",
      "Poppy Red",
      "Clear Red",
      "Signal Red",
      "Apple Red",
      "Strawberry Red"
    ],
    "tomatoRed": [
      "Tomato Red",
      "Pepper Red",
      "Geranium Red",
      "Warm Red",
      "Fire Red",
      "Coral Red"
    ],
    "coral": [
      "Coral",
      "Salmon Red",
      "Lobster Red",
      "Papaya",
      "Watermelon",
      "Melon Red"
    ],
    "terracotta": [
      "Terracotta",
      "Brick Red",
      "Rust Red",
      "Sienna",
      "Clay Red",
      "Copper Red"
    ],
    "apricot": [
      "Apricot",
      "Peach",
      "Apricot Cream",
      "Melba",
      "Soft Peach",
      "Nectarine",
      "Rosy Apricot"
    ],
    "rustOrange": [
      "Rust Orange",
      "Cinnamon Orange",
      "Copper Orange",
      "Mango",
      "Pumpkin",
      "Curry Orange",
      "Amber Orange"
    ],
    "vanillaYellow": [
      "Vanilla Yellow",
      "Buttercream",
      "Primrose Yellow",
      "Champagne Yellow",
      "Cream Yellow",
      "Sorbet Yellow",
      "Light Corn Yellow"
    ],
    "goldenYellow": [
      "Golden Yellow",
      "Sun Yellow",
      "Saffron Yellow",
      "Honey Yellow",
      "Corn Yellow",
      "Amber Yellow",
      "Mustard Gold"
    ],
    "lemonYellow": [
      "Lemon Yellow",
      "Lime Yellow",
      "Clear Yellow",
      "Spring Yellow",
      "Chartreuse Yellow",
      "Bright Yellow",
      "Linden Yellow",
      "Clear Primrose"
    ],
    "oliveGreen": [
      "Olive Green",
      "Moss Green",
      "Khaki Olive",
      "Artichoke",
      "Laurel Green",
      "Pine Needle",
      "Deep Pea Green"
    ],
    "limeGreen": [
      "Linden Green",
      "Lime Green",
      "Apple Green",
      "Pistachio",
      "Spring Green",
      "Chartreuse Green",
      "Pear Green"
    ],
    "forestGreen": [
      "Pine Green",
      "Forest Green",
      "Bottle Green",
      "Deep Emerald",
      "Hunter Green",
      "Stone Pine Green"
    ],
    "sageGreen": [
      "Sage Green",
      "Eucalyptus",
      "Reed Green",
      "Mist Green",
      "Grey Green",
      "Mint Sage",
      "Dusty Green"
    ],
    "emeraldGreen": [
      "Emerald Green",
      "Jade Green",
      "Malachite",
      "Clover Green",
      "Brilliant Green",
      "Viridian",
      "Peacock Green"
    ],
    "petrol": [
      "Petrol",
      "Deep Petrol",
      "Teal",
      "Ocean Petrol",
      "Deep Blue Green",
      "Peacock Blue",
      "Ink Petrol"
    ],
    "turquoise": [
      "Turquoise",
      "Aquamarine",
      "Lagoon Blue",
      "Caribbean Turquoise",
      "Pool Blue",
      "Mint Turquoise",
      "Ice Petrol"
    ],
    "nightBlue": [
      "Night Blue",
      "Navy Blue",
      "Ink Blue",
      "Midnight Blue",
      "Dark Navy",
      "Prussian Blue",
      "Black Blue"
    ],
    "cobaltBlue": [
      "Cobalt Blue",
      "Royal Blue",
      "Ultramarine",
      "Azure Blue",
      "Clear Blue",
      "Sapphire Blue",
      "Denim Blue"
    ],
    "aubergine": [
      "Aubergine",
      "Deep Violet",
      "Plum",
      "Blackberry",
      "Dark Amethyst",
      "Violet Brown"
    ],
    "violet": [
      "Violet",
      "Lilac",
      "Amethyst",
      "Lavender Violet",
      "Orchid",
      "Viola",
      "Purple"
    ],
    "berry": [
      "Berry Tone",
      "Raspberry Red",
      "Blackberry Red",
      "Redcurrant",
      "Cassis",
      "Deep Fuchsia",
      "Magenta Berry"
    ],
    "powderPink": [
      "Powder Pink",
      "Blush",
      "Light Rosé",
      "Ballet Pink",
      "Nude Rosé",
      "Light Dusty Rose",
      "Soft Pink"
    ],
    "rosePink": [
      "Rose Pink",
      "Raspberry Pink",
      "Fuchsia",
      "Pink",
      "Watermelon Pink",
      "Bougainvillea",
      "Cherry Blossom"
    ],
    "generic": [
      "Color Tone",
      "Accent Tone",
      "Fashion Tone",
      "Nuance"
    ]
  },
  "ru": {
    "whiteClear": [
      "Снежно-белый",
      "Фарфоровый белый",
      "Меловой белый",
      "Кристальный белый",
      "Оптический белый",
      "Чистый белый"
    ],
    "whiteCream": [
      "Кремовый белый",
      "Айвори",
      "Шампанский белый",
      "Ванильный крем",
      "Яичная скорлупа",
      "Молочный белый"
    ],
    "graphite": [
      "Графит",
      "Антрацит",
      "Сланцевый серый",
      "Глубокий серый",
      "Угольный",
      "Чёрно-серый",
      "Тёмный графит"
    ],
    "taupeGrey": [
      "Тауп-серый",
      "Каменный серый",
      "Дымчатый серый",
      "Оловянный",
      "Тёплый серый",
      "Пепельно-коричневый",
      "Mushroom"
    ],
    "greige": [
      "Грейж",
      "Льняной серый",
      "Жемчужно-серый",
      "Галечный беж",
      "Туманный беж",
      "Мягкий тауп"
    ],
    "espresso": [
      "Эспрессо",
      "Мокка",
      "Тёмный какао",
      "Кофейный коричневый",
      "Чёрно-коричневый",
      "Обжаренный коричневый",
      "Горький шоколад",
      "Глубокий мокка",
      "Коричнево-чёрный"
    ],
    "chocolateBrown": [
      "Шоколадный коричневый",
      "Какао",
      "Ореховый коричневый",
      "Каштановый",
      "Марон",
      "Фундук",
      "Землистый коричневый",
      "Махагони"
    ],
    "cognacBrown": [
      "Коньячный коричневый",
      "Карамельный коричневый",
      "Кожаный коричневый",
      "Табачный коричневый",
      "Янтарный коричневый",
      "Медный коричневый",
      "Коричный коричневый",
      "Тоффи"
    ],
    "camel": [
      "Кэмел",
      "Кашемировый беж",
      "Медовый беж",
      "Верблюжья шерсть",
      "Золотистый беж",
      "Овсяный беж",
      "Ореховый беж"
    ],
    "sandBeige": [
      "Песочный беж",
      "Сахарский беж",
      "Льняной беж",
      "Шампанский беж",
      "Ракушечный беж",
      "Нюдовый беж",
      "Ванильный беж",
      "Дюнный беж"
    ],
    "burgundy": [
      "Бордо",
      "Бургунди",
      "Мерло",
      "Гранатовый красный",
      "Винный красный",
      "Чёрная вишня",
      "Коричневый рубин",
      "Клюквенный красный",
      "Сливовый красный",
      "Оксблад"
    ],
    "cherryRed": [
      "Вишнёвый красный",
      "Рубиновый красный",
      "Маковый красный",
      "Чистый красный",
      "Сигнальный красный",
      "Яблочный красный",
      "Клубничный красный"
    ],
    "tomatoRed": [
      "Томатный красный",
      "Перечный красный",
      "Гераниевый красный",
      "Тёплый красный",
      "Огненный красный",
      "Коралловый красный"
    ],
    "coral": [
      "Коралловый",
      "Лососевый красный",
      "Лобстеровый",
      "Папайя",
      "Арбузный",
      "Дынный красный"
    ],
    "terracotta": [
      "Терракота",
      "Кирпичный красный",
      "Ржавый красный",
      "Сиена",
      "Глиняный красный",
      "Медный красный"
    ],
    "apricot": [
      "Абрикосовый",
      "Персиковый",
      "Абрикосовый крем",
      "Мельба",
      "Мягкий персик",
      "Нектарин",
      "Розе-абрикос"
    ],
    "rustOrange": [
      "Ржаво-оранжевый",
      "Коричный оранжевый",
      "Медный оранжевый",
      "Манго",
      "Тыквенный",
      "Карри-оранжевый",
      "Янтарный оранжевый"
    ],
    "vanillaYellow": [
      "Ванильный жёлтый",
      "Масляный крем",
      "Примульный жёлтый",
      "Шампанский жёлтый",
      "Кремовый жёлтый",
      "Сорбетный жёлтый",
      "Светло-кукурузный"
    ],
    "goldenYellow": [
      "Золотистый жёлтый",
      "Солнечный жёлтый",
      "Шафрановый жёлтый",
      "Медовый жёлтый",
      "Кукурузный жёлтый",
      "Янтарный жёлтый",
      "Горчичное золото"
    ],
    "lemonYellow": [
      "Лимонный жёлтый",
      "Лаймовый жёлтый",
      "Чистый жёлтый",
      "Весенний жёлтый",
      "Шартрез-жёлтый",
      "Яркий жёлтый",
      "Липовый жёлтый",
      "Чистая примула"
    ],
    "oliveGreen": [
      "Оливковый зелёный",
      "Моховый зелёный",
      "Хаки-оливковый",
      "Артишок",
      "Лавровый зелёный",
      "Сосновая игла",
      "Глубокий гороховый"
    ],
    "limeGreen": [
      "Липовый зелёный",
      "Лаймовый зелёный",
      "Яблочный зелёный",
      "Фисташковый",
      "Весенний зелёный",
      "Шартрез-зелёный",
      "Грушевый зелёный"
    ],
    "forestGreen": [
      "Еловый зелёный",
      "Лесной зелёный",
      "Бутылочный зелёный",
      "Глубокий изумруд",
      "Охотничий зелёный",
      "Пиниевый зелёный"
    ],
    "sageGreen": [
      "Шалфейный зелёный",
      "Эвкалипт",
      "Камышовый зелёный",
      "Туманный зелёный",
      "Серо-зелёный",
      "Мятный шалфей",
      "Пыльный зелёный"
    ],
    "emeraldGreen": [
      "Изумрудный зелёный",
      "Нефритовый зелёный",
      "Малахит",
      "Клеверный зелёный",
      "Бриллиантовый зелёный",
      "Виридиан",
      "Павлиний зелёный"
    ],
    "petrol": [
      "Петроль",
      "Глубокий петроль",
      "Тил",
      "Океанский петроль",
      "Глубокий сине-зелёный",
      "Павлиний синий",
      "Чернильный петроль"
    ],
    "turquoise": [
      "Бирюзовый",
      "Аквамарин",
      "Лагунный синий",
      "Карибская бирюза",
      "Бассейновый синий",
      "Мятная бирюза",
      "Ледяной петроль"
    ],
    "nightBlue": [
      "Ночной синий",
      "Navy Blue",
      "Чернильный синий",
      "Полуночный синий",
      "Тёмный navy",
      "Прусский синий",
      "Чёрно-синий"
    ],
    "cobaltBlue": [
      "Кобальтовый синий",
      "Королевский синий",
      "Ультрамарин",
      "Лазурный синий",
      "Чистый синий",
      "Сапфировый синий",
      "Денимовый синий"
    ],
    "aubergine": [
      "Баклажановый",
      "Глубокий фиолетовый",
      "Сливовый",
      "Ежевичный",
      "Тёмный аметист",
      "Фиолетово-коричневый"
    ],
    "violet": [
      "Фиолетовый",
      "Сиреневый",
      "Аметист",
      "Лавандово-фиолетовый",
      "Орхидея",
      "Фиалковый",
      "Пурпурный"
    ],
    "berry": [
      "Ягодный тон",
      "Малиновый красный",
      "Ежевичный красный",
      "Красная смородина",
      "Кассис",
      "Глубокая фуксия",
      "Маджента-ягода"
    ],
    "powderPink": [
      "Пудрово-розовый",
      "Blush",
      "Светлый розе",
      "Балетный розовый",
      "Нюдовый розе",
      "Светлый пыльный розовый",
      "Нежно-розовый"
    ],
    "rosePink": [
      "Розовый",
      "Малиновый розовый",
      "Фуксия",
      "Pink",
      "Арбузный розовый",
      "Бугенвиллия",
      "Цвет вишни"
    ],
    "generic": [
      "Цветовой тон",
      "Акцентный тон",
      "Модный тон",
      "Нюанс"
    ]
  }
};
const COLOR_NAME_MODIFIERS = {
  "de": {
    "light": "hell",
    "deep": "tief",
    "dark": "dunkel",
    "clear": "klar",
    "soft": "sanft",
    "muted": "gedämpft",
    "warm": "warm",
    "cool": "kühl",
    "rich": "satt",
    "smoky": "rauchig",
    "bright": "leuchtend",
    "elegant": "edel"
  },
  "en": {
    "light": "light",
    "deep": "deep",
    "dark": "dark",
    "clear": "clear",
    "soft": "soft",
    "muted": "muted",
    "warm": "warm",
    "cool": "cool",
    "rich": "rich",
    "smoky": "smoky",
    "bright": "bright",
    "elegant": "elegant"
  },
  "ru": {
    "light": "светлый",
    "deep": "глубокий",
    "dark": "тёмный",
    "clear": "чистый",
    "soft": "мягкий",
    "muted": "приглушённый",
    "warm": "тёплый",
    "cool": "холодный",
    "rich": "насыщенный",
    "smoky": "дымчатый",
    "bright": "яркий",
    "elegant": "элегантный"
  }
};
const paletteColorNameCache = new Map();

I18N.applyDocumentLanguage();
document.title = I18N.getPageTitle(activePalette.name, activeCustomerName);
const titleNode = document.getElementById('pageTitle');
const paletteNameNode = document.getElementById('paletteName');
if (titleNode) titleNode.textContent = formatPaletteName(activePalette.name);
if (paletteNameNode) paletteNameNode.textContent = formatPaletteName(activePalette.name);

applyStaticTranslations();
initializeSplashScreen();
renderPalette();
if (photoInput) photoInput.addEventListener('change', handlePhoto);
initializeScanFlow();
registerServiceWorker();
initializeInstallPrompt();
initializeColorFullscreen();
initializeResultColorChips();

function initializeCustomerName(paletteSlug) {
  const fromUrl = readCustomerNameFromUrl();
  const storageKey = getCustomerNameStorageKey(paletteSlug);

  if (fromUrl) {
    writeCustomerNameToStorage(storageKey, fromUrl);
    return fromUrl;
  }

  return readCustomerNameFromStorage(storageKey);
}

function readCustomerNameFromUrl() {
  const params = new URLSearchParams(window.location.search || '');
  for (const key of CUSTOMER_NAME_QUERY_KEYS) {
    if (!params.has(key)) continue;
    const value = sanitizeCustomerName(params.get(key));
    if (value) return value;
  }
  return '';
}

function sanitizeCustomerName(value) {
  return String(value || '')
    .replace(/[\u0000-\u001F\u007F<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 36);
}

function getCustomerNameStorageKey(paletteSlug) {
  return CUSTOMER_NAME_STORAGE_PREFIX + String(paletteSlug || 'default');
}

function readCustomerNameFromStorage(storageKey) {
  try {
    return sanitizeCustomerName(window.localStorage.getItem(storageKey));
  } catch (error) {
    return '';
  }
}

function writeCustomerNameToStorage(storageKey, customerName) {
  try {
    window.localStorage.setItem(storageKey, customerName);
  } catch (error) {
    // Personalisierung ist ein Komfort-Feature; die Farbkarte funktioniert auch ohne localStorage.
  }
}

function applyStaticTranslations() {
  const paletteLabel = formatPaletteName(activePalette.name);
  const brandWord = document.querySelector('.brand-farbe');
  const customerName = document.getElementById('customerName');
  const header = document.querySelector('.hero');
  const logoLink = document.querySelector('.hero-logo-link');
  const logo = document.querySelector('.hero-logo');
  const appleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
  const palettePanel = document.querySelector('.palette-panel');
  const analysisPanel = document.querySelector('.analysis-panel');
  const actionBar = document.querySelector('.bottom-action-bar');
  const fileButtonText = document.querySelector('.bottom-file-button > span:last-of-type');
  const telegramButton = document.querySelector('.telegram-button');
  const scannerStage = document.querySelector('.camera-scanner');

  if (brandWord) brandWord.textContent = I18N.t('ui.brandWord');
  if (customerName) {
    customerName.textContent = activeCustomerName ? I18N.t('ui.customerFor', { name: activeCustomerName }) : '';
    customerName.classList.toggle('hidden', !activeCustomerName);
  }
  if (header) {
    header.setAttribute('aria-label', activeCustomerName ? I18N.t('ui.brandAriaFor', { name: activeCustomerName }) : I18N.t('ui.brandAria'));
  }
  if (appleTitle) {
    appleTitle.setAttribute('content', activeCustomerName ? I18N.t('ui.brandAriaFor', { name: activeCustomerName }) : I18N.t('ui.brandAria'));
  }
  if (logoLink) logoLink.setAttribute('aria-label', I18N.t('ui.openEskyna'));
  if (logo) logo.setAttribute('alt', I18N.t('ui.symbolAlt'));
  if (palettePanel) palettePanel.setAttribute('aria-label', I18N.t('ui.paletteSection', { palette: paletteLabel }));
  if (analysisPanel) analysisPanel.setAttribute('aria-label', I18N.t('ui.analysisSection'));
  if (actionBar) actionBar.setAttribute('aria-label', I18N.t('ui.actions'));
  if (fileButtonText) fileButtonText.textContent = I18N.t('ui.colorCheck');
  if (telegramButton) telegramButton.textContent = I18N.t('ui.styleQuestion');
  if (scannerStage) scannerStage.setAttribute('aria-label', I18N.t('scan.scannerAria'));
  if (scannerQuality) scannerQuality.textContent = I18N.t('scan.light.checking');
  if (scannerHint) scannerHint.textContent = I18N.t('scan.hint');
  if (scannerClose) scannerClose.setAttribute('aria-label', I18N.t('scan.close'));
  if (scannerCloseLabel) scannerCloseLabel.textContent = I18N.t('scan.closeShort');
  if (scannerCancel) scannerCancel.textContent = I18N.t('scan.cancel');
  if (scanSessionTitle) scanSessionTitle.textContent = I18N.t('ui.resultEyebrow');
  if (scanResultClose) scanResultClose.textContent = I18N.t('scan.cancel');
  if (scannerCapture) scannerCapture.textContent = I18N.t('scan.capture');
  if (scannerFileFallback) scannerFileFallback.textContent = I18N.t('scan.fileFallback');
  if (installButton) installButton.textContent = I18N.t('ui.installApp');
  if (updateButton) updateButton.textContent = I18N.t('ui.updateApp');
  if (iosInstallClose) iosInstallClose.setAttribute('aria-label', I18N.t('ui.iosInstallClose'));
  if (iosInstallKicker) iosInstallKicker.textContent = I18N.t('ui.iosInstallKicker');
  if (iosInstallTitle) iosInstallTitle.textContent = I18N.t('ui.iosInstallTitle');
  if (iosInstallStepOpenSafari) iosInstallStepOpenSafari.textContent = I18N.t('ui.iosInstallStepOpenSafari');
  if (iosInstallStepShare) iosInstallStepShare.textContent = I18N.t('ui.iosInstallStepShare');
  if (iosInstallStepAdd) iosInstallStepAdd.textContent = I18N.t('ui.iosInstallStepAdd');
  if (iosInstallStepConfirm) iosInstallStepConfirm.textContent = I18N.t('ui.iosInstallStepConfirm');
  if (iosInstallCopy) iosInstallCopy.textContent = I18N.t('ui.iosInstallCopy');
  if (iosInstallDone) iosInstallDone.textContent = I18N.t('ui.iosInstallDone');
  updateIosInstallSheetCopy();
  if (colorFullscreen) colorFullscreen.setAttribute('aria-label', I18N.t('ui.fullscreenAria'));
}

function createFallbackI18n() {
  const paletteTerms = { light: 'Light', cool: 'Cool', clear: 'Clear', deep: 'Deep', warm: 'Warm', soft: 'Soft' };
  const genericStory = {
    name: 'Color Tone',
    tone: 'individual and expressive',
    fact: 'Every color changes its effect through material, light and combination.',
    combinations: 'Combine this tone with one light neutral, one dark neutral and one accent from the palette.'
  };
  return {
    applyDocumentLanguage() {},
    t(path, replacements) {
      const fallback = {
        'ui.brandWord': 'Farbe',
        'ui.customerFor': 'für {name}',
        'ui.brandAria': 'ESKYNA Farbe',
        'ui.brandAriaFor': 'ESKYNA Farbe für {name}',
        'ui.colorKnowledgeHint': 'Antippen für Farbwissen',
        'ui.explainColor': '{color} erklären',
        'ui.measuredColor': 'Gemessene Farbe',
        'ui.fullscreenClose': 'Farbansicht schließen',
        'ui.explanationTo': 'Erklärung zu {color}',
        'ui.colorKnowledge': 'Farbwissen',
        'ui.styleKnowledge': 'Stilwissen',
        'ui.combine': 'Kombinieren',
        'ui.fullscreenFootnote': 'Tippe außerhalb der Karte, um zurück zur Farbkarte zu kommen.',
        'ui.glossaryProfile': 'Farbprofil',
        'ui.glossaryEffect': 'Wirkung',
        'ui.glossaryFashion': 'Modewissen',
        'ui.glossaryFormulas': 'Kombinationsformeln',
        'ui.glossaryMaterials': 'Material & Oberfläche',
        'ui.glossaryShopping': 'Shopping-Kompass',
        'ui.glossaryDosDonts': 'Dos & Don’ts',
        'ui.glossaryRelated': 'Nahe Farbpass-Töne',
        'glossary.kicker': 'Farbglossar',
        'glossary.labels.family': 'Farbfamilie',
        'glossary.labels.temperature': 'Temperatur',
        'glossary.labels.brightness': 'Helligkeit',
        'glossary.labels.clarity': 'Klarheit',
        'glossary.labels.depth': 'Tiefe',
        'glossary.labels.role': 'Rolle',
        'glossary.values.warm': 'warm',
        'glossary.values.cool': 'kühl',
        'glossary.values.neutral': 'neutral',
        'glossary.values.light': 'hell',
        'glossary.values.medium': 'mittelhell',
        'glossary.values.deep': 'tief',
        'glossary.values.clear': 'klar',
        'glossary.values.soft': 'gedämpft',
        'glossary.values.balanced': 'ausbalanciert',
        'glossary.values.airy': 'leicht',
        'glossary.values.grounded': 'erdend',
        'glossary.values.rich': 'satt',
        'glossary.role.lightSurface': 'eine Frischefläche, die Outfits öffnet',
        'glossary.role.depthAnchor': 'ein Tiefenanker, der Kontur gibt',
        'glossary.role.accent': 'ein Akzentton mit Energie',
        'glossary.role.connector': 'ein Verbindungston',
        'glossary.role.wardrobeColor': 'eine tragbare Garderobenfarbe',
        'glossary.intro': '{name} gehört zur Familie {family}, wirkt {temperature}, {brightness} und {clarity}. In deiner Farbkarte ist er {role}.',
        'glossary.profileSummary': 'Das Profil hilft beim Einkaufen: Temperatur, Helligkeit und Klarheit entscheiden, ob ein Ton wirklich passt.',
        'glossary.effectPrefix': 'Auf der Fläche wirkt {name} {tone}.',
        'glossary.fashionContext': 'Modewissen: Farbe verändert sich durch Schnitt, Fläche und Stoff.',
        'glossary.materialClear': 'Glatte Stoffe zeigen klare Farben besonders schön.',
        'glossary.materialSoft': 'Matte Oberflächen machen Farben ruhiger.',
        'glossary.materialDeep': 'Tiefe Farben wirken in Samt, Wolle oder Leder edel.',
        'glossary.materialLight': 'Helle Farben brauchen sichtbare Stoffqualität.',
        'glossary.materialBalanced': 'Glanz macht Farbe präsenter, matte Materialien machen sie alltagstauglicher.',
        'glossary.shoppingLookFor': 'Achte beim Einkaufen auf {lookFor}.',
        'glossary.shoppingAvoid': 'Sei vorsichtig bei {avoid}.',
        'glossary.lookFor.warm': 'warme Untertöne',
        'glossary.lookFor.cool': 'kühle Untertöne',
        'glossary.lookFor.neutral': 'saubere neutrale Untertöne',
        'glossary.lookFor.clear': 'frische klare Farben',
        'glossary.lookFor.soft': 'gebrochene weiche Nuancen',
        'glossary.avoid.warm': 'zu kühlen Varianten',
        'glossary.avoid.cool': 'zu warmen Varianten',
        'glossary.avoid.clear': 'stumpfen Varianten',
        'glossary.avoid.soft': 'neonartigen Varianten',
        'glossary.avoid.deep': 'flachen Farben ohne Tiefe',
        'glossary.avoid.light': 'zu schweren Begleitern',
        'glossary.formulas.hero': 'Als Hauptfarbe: {color} mit {neutral} beruhigen.',
        'glossary.formulas.accent': 'Als Akzent: {color} in Accessoires wiederholen.',
        'glossary.formulas.echo': 'Als Paletten-Echo: {color} mit {partner} kombinieren.',
        'glossary.neutralWarm': 'Creme, Camel, Cognac oder Gold',
        'glossary.neutralCool': 'Weiß, Taupe, Navy oder Silber',
        'glossary.neutralNeutral': 'einem hellen und einem dunklen Neutral',
        'glossary.dos.face': 'Nah am Gesicht tragen, wenn der Ton harmoniert.',
        'glossary.dos.repeat': 'Die Farbe einmal wiederholen.',
        'glossary.dos.balance': 'Kräftige Farben schlicht stylen.',
        'glossary.donts.overload': 'Nicht mit zu vielen Akzenten überladen.',
        'glossary.donts.wrongLight': 'Nicht unter gelbem Kunstlicht entscheiden.',
        'glossary.donts.isolate': 'Nicht ohne Verbindung zum Farbpass tragen.',
        'glossary.relatedIntro': 'Nahe Töne aus demselben Farbpass helfen beim Vergleichen.',
        'glossary.pageTitle': 'Farbglossar',
        'glossary.profile': 'Farbprofil',
        'glossary.roleTitle': 'Rolle im Farbpass',
        'glossary.materialTitle': 'Material & Oberfläche',
        'glossary.outfitTitle': 'Outfit-Rezept',
        'glossary.shoppingTitle': 'Shopping-Feintuning',
        'glossary.valuesTitle': 'Farbprofil kompakt',
        'glossary.labels.temperature': 'Temperatur',
        'glossary.labels.brightness': 'Helligkeit',
        'glossary.labels.clarity': 'Klarheit',
        'glossary.labels.role': 'Rolle',
        'glossary.values.temperature.warm': 'warm',
        'glossary.values.temperature.cool': 'kühl',
        'glossary.values.temperature.neutral': 'neutral',
        'glossary.values.brightness.light': 'hell',
        'glossary.values.brightness.medium': 'mittelhell',
        'glossary.values.brightness.deep': 'tief',
        'glossary.values.clarity.clear': 'klar',
        'glossary.values.clarity.balanced': 'ausgewogen',
        'glossary.values.clarity.soft': 'sanft',
        'glossary.values.role.lightBase': 'Lichtgeber',
        'glossary.values.role.darkAnchor': 'Tiefengeber',
        'glossary.values.role.neutralBase': 'Basisfarbe',
        'glossary.values.role.accent': 'Akzentfarbe',
        'glossary.values.role.connector': 'Verbindungston',
        'glossary.intro': '{color} ist {tone}. Stoff, Licht, Schnitt und Nähe zum Gesicht verändern die Wirkung sichtbar.',
        'glossary.role.lightBase': '{color} bringt Licht in {palette} und öffnet den Look.',
        'glossary.role.darkAnchor': '{color} gibt {palette} Tiefe und Kontur.',
        'glossary.role.neutralBase': '{color} verbindet Akzentfarben und macht den Look ruhiger.',
        'glossary.role.accent': '{color} funktioniert als bewusster Blickfang.',
        'glossary.role.connector': '{color} verbindet Basis und Akzent.',
        'glossary.fashion.neutral': 'Neutralfarben lassen Silhouette, Material und Schmuck stärker wirken.',
        'glossary.fashion.warmNeutral': 'Warme Neutrals wirken besonders hochwertig in Leder, Strick und Wolle.',
        'glossary.fashion.coolNeutral': 'Kühle Neutrals wirken grafisch und gepflegt.',
        'glossary.fashion.red': 'Rot lenkt den Blick schnell und funktioniert stark als Akzent.',
        'glossary.fashion.orange': 'Orange- und Terrakottatöne bringen Wärme und Natürlichkeit.',
        'glossary.fashion.yellow': 'Gelb wirkt wie ein Lichtakzent und braucht ruhige Begleiter.',
        'glossary.fashion.green': 'Grün verbindet Natur und Eleganz.',
        'glossary.fashion.blue': 'Blau wirkt vertraut, klar und vielseitig.',
        'glossary.fashion.violet': 'Violett bringt Individualität und kreative Ruhe.',
        'glossary.fashion.pink': 'Rosé, Pink und Beere bringen Frische ins Gesicht.',
        'glossary.harmony.warm': 'Wiederhole die Wärme mit Creme, Gold, Camel, Cognac oder Koralle.',
        'glossary.harmony.cool': 'Kühle Begleiter wie Silber, Weiß, Navy oder Beerentöne halten den Look klar.',
        'glossary.harmony.neutral': 'Rahme den Look bewusst eher warm oder eher kühl.',
        'glossary.material.crisp': '{color} wirkt in glatten Stoffen klar und modern.',
        'glossary.material.soft': '{color} wirkt in matten, weichen Materialien besonders edel.',
        'glossary.material.fluid': '{color} wird durch Glanz stärker und braucht schlichte Formen.',
        'glossary.material.texture': '{color} gewinnt durch Leder, Strick, Leinen oder Bouclé an Tiefe.',
        'glossary.material.polished': '{color} wirkt in Samt, Leder, dichter Wolle oder Seide besonders hochwertig.',
        'glossary.outfit.lightBase': '{color} funktioniert nah am Gesicht mit einem mittleren Ton und dunkler Kontur.',
        'glossary.outfit.darkAnchor': '{color} eignet sich als Rahmenfarbe mit heller Fläche am Gesicht.',
        'glossary.outfit.neutralBase': '{color} kann die ruhige Basis des Looks sein.',
        'glossary.outfit.accent': '{color} funktioniert als 10- bis 30-Prozent-Akzent.',
        'glossary.outfit.connector': '{color} verbindet zwei Nachbartöne aus dem Farbpass.',
        'glossary.shopping.clarity': 'Achte darauf, dass {color} frisch und nicht staubig wirkt.',
        'glossary.shopping.softness': 'Achte darauf, dass {color} weich, aber nicht schmutzig wirkt.',
        'glossary.shopping.lightness': 'Bei hellen Tönen zählt Stoffqualität besonders.',
        'glossary.shopping.depth': 'Bei tiefen Tönen entscheidet die Materialqualität stark.',
        'glossary.shopping.warmth': 'Die Wärme soll weich und nicht grell wirken.',
        'glossary.shopping.coolness': 'Der Ton soll kühl, aber nicht eisig wirken.',
        'glossary.shopping.neutral': 'Prüfe neutrale Töne neben hellen und dunklen Farbpassfarben.',
        'glossary.confusion.tooWarm': 'Nicht mit deutlich gelberen oder orangeren Varianten verwechseln.',
        'glossary.confusion.tooCool': 'Nicht mit deutlich blaueren oder graueren Varianten verwechseln.',
        'glossary.confusion.tooMuted': 'Nicht mit zu grauen Varianten verwechseln.',
        'glossary.confusion.tooClear': 'Nicht mit neonhaften Varianten verwechseln.',
        'glossary.confusion.tooLight': 'Nicht mit ausgewaschenen Varianten verwechseln.',
        'glossary.confusion.tooDark': 'Nicht mit fast schwarzen Varianten verwechseln.',
        'glossary.valuesLine': '{hex} · {temperature}, {brightness}, {clarity}. Diese Werte sind ein Anker; Stoff und Licht verändern die Wirkung.',
        'ui.resultColorTitle': '{color} erklären',
        'ui.resultSampleAria': 'Gemessene Farbe {color} erklären',
        'ui.resultMatchAria': 'Ähnlichsten Palettenton {color} erklären',
        'ui.resultEyebrow': 'Dein Farbcheck',
        'ui.yourColor': 'Deine Farbe',
        'ui.nearestPaletteColor': 'Ähnlichster Palettenton',
        'ui.fitMeter': 'Farbpassung: {label}',
        'ui.installApp': 'App installieren',
        'ui.updateApp': 'App aktualisieren',
        'ui.iosInstallApp': 'App installieren',
        'ui.iosInstallKicker': 'iPhone & iPad',
        'ui.iosInstallTitle': 'App installieren',
        'ui.iosInstallIntroSafari': 'Tippe in Safari auf Teilen und fuege diese Farbkarte zum Home-Bildschirm hinzu.',
        'ui.iosInstallIntroOther': 'Auf iPhone und iPad funktioniert die Installation ueber Safari. Kopiere den Link und oeffne ihn in Safari.',
        'ui.iosInstallStepOpenSafari': 'Diese Seite in Safari oeffnen.',
        'ui.iosInstallStepShare': 'Auf das Teilen-Symbol tippen.',
        'ui.iosInstallStepAdd': 'Zum Home-Bildschirm hinzufuegen waehlen.',
        'ui.iosInstallStepConfirm': 'Mit Hinzufuegen bestaetigen.',
        'ui.iosInstallSafariRequired': 'Bitte in Safari oeffnen, dann Teilen und Zum Home-Bildschirm hinzufuegen waehlen.',
        'ui.iosInstallCopy': 'Link kopieren',
        'ui.iosInstallDone': 'Verstanden',
        'ui.iosInstallClose': 'Installationshinweis schliessen',
        'ui.iosInstallCopied': 'Link kopiert',
        'ui.iosInstallCopyFailed': 'Link bitte aus der Adresszeile kopieren',
        'ui.updating': 'Aktualisiere ...',
        'ui.pageTitle': 'ESKYNA Farbe - {palette}',
        'ui.pageTitleFor': 'ESKYNA Farbe für {name} - {palette}',
        'scan.scannerAria': 'Farbe live prüfen',
        'scan.hint': 'Kleidungsstück glatt in den Kreis halten.',
        'scan.close': 'Scanner schließen',
        'scan.closeShort': 'Schließen',
        'scan.cancel': 'Zur Farbkarte zurück',
        'scan.capture': 'Jetzt Farbe prüfen',
        'scan.fileFallback': 'Bild auswählen',
        'scan.cameraFallback': 'Kamera nicht verfügbar. Du kannst ein Bild auswählen.',
        'scan.measuredShort': 'Gemessen',
        'scan.paletteShort': 'Palette',
        'scan.nearestThree': 'Drei nächste Farben aus deinem Farbpass',
        'scan.light.aria': 'Lichtqualität',
        'scan.light.checking': 'Licht wird geprüft ...',
        'scan.light.good': 'Tageslicht gut',
        'scan.light.uncertain': 'Messung unsicher',
        'scan.light.tooDark': 'zu dunkel',
        'scan.light.dim': 'etwas dunkel',
        'scan.light.tooBright': 'zu hell',
        'scan.light.tooYellow': 'zu gelb',
        'scan.light.shadow': 'Schatten erkannt',
        'scan.light.unstable': 'Kreis nicht ruhig gefüllt',
        'scan.verdict.veryGood': 'Passt sehr gut – {score} %',
        'scan.verdict.good': 'Passt gut – {score} %',
        'scan.verdict.almost': 'Fast passend – {score} %',
        'scan.verdict.borderline': 'Grenzfall – {score} %',
        'scan.verdict.notIdeal': 'Eher nicht ideal – {score} %',
        'scan.verdict.unsure': 'Unsicher – bitte neu prüfen',
        'scan.label.veryGood': 'sehr hohe Harmonie',
        'scan.label.good': 'harmonisch',
        'scan.label.almost': 'fast passend',
        'scan.label.borderline': 'bewusst kombinieren',
        'scan.label.notIdeal': 'außerhalb der Idealrichtung',
        'scan.label.unsure': 'Bedingungen bitte verbessern',
        'scan.dimension.brightness.ok': 'Helligkeit passt',
        'scan.dimension.brightness.tooLight': 'etwas zu hell',
        'scan.dimension.brightness.tooDark': 'etwas zu dunkel',
        'scan.dimension.warmth.ok': 'Wärme passt',
        'scan.dimension.warmth.tooWarm': 'etwas zu warm/gelb',
        'scan.dimension.warmth.tooCool': 'etwas zu kühl',
        'scan.dimension.clarity.ok': 'Klarheit passt',
        'scan.dimension.clarity.tooClear': 'etwas zu klar/kräftig',
        'scan.dimension.clarity.tooMuted': 'etwas zu gedämpft',
        'scan.advice.veryGood': 'Helligkeit, Wärme und Klarheit wirken stimmig.',
        'scan.advice.good': 'Die Richtung ist schön. Kombiniere dazu einen ruhigen Basis- oder Akzentton aus deinem Farbpass.',
        'scan.advice.tooMuted': 'Fast passend – aber etwas zu gedämpft. Nimm lieber eine klarere, frischere Variante.',
        'scan.advice.tooClear': 'Fast passend – aber etwas sehr kräftig. Eine ruhigere Variante wirkt meist edler.',
        'scan.advice.tooWarm': 'Fast passend – aber etwas zu warm. Suche nach einer weniger gelblichen Variante.',
        'scan.advice.tooCool': 'Fast passend – aber etwas zu kühl. Eine minimal wärmere Variante verbindet sich weicher.',
        'scan.advice.tooLight': 'Fast passend – aber etwas zu hell. Etwas mehr Tiefe gibt dem Outfit mehr Kontur.',
        'scan.advice.tooDark': 'Fast passend – aber etwas zu dunkel. Eine hellere Variante wirkt näher an deiner Farbkarte.',
        'scan.advice.checkAgain': 'Prüfe bei neutralem Tageslicht noch einmal, bevor du kaufst.',
        'scan.advice.neutral': 'Nutze den Ton eher als Detail und wiederhole einen sicheren Farbpass-Ton.',
        'scan.advice.retry': 'Ich bin bei diesem Foto nicht sicher. Prüfe lieber noch einmal bei neutralem Tageslicht.',
        'scan.confidence.good': 'Einschätzung aus {points} Messpunkten im Kreis.',
        'scan.confidence.warning': 'Die Empfehlung ist vorläufig, weil Licht oder Schatten die Kamera beeinflussen können.'
      }[path] || path;
      return String(fallback).replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => replacements && key in replacements ? replacements[key] : match);
    },
    formatPaletteName(name) {
      return String(name || '').split(/\s+/).filter(Boolean).map((part) => paletteTerms[part] || part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
    },
    getPageTitle(name, customerName = '') {
      const palette = this.formatPaletteName(name);
      return customerName ? this.t('ui.pageTitleFor', { palette, name: customerName }) : this.t('ui.pageTitle', { palette });
    },
    getColorStory() { return genericStory; },
    getPaletteCombinationNote() { return ''; },
    getPaletteDepthNote() { return ''; },
    getFit(key) {
      const data = {
        perfect: ['Volltreffer für deine Farbkarte', 'sehr nah am Palettenton', 'Diese Farbe kannst du wie einen Originalton deiner Farbkarte einsetzen.'],
        strong: ['Sehr harmonisch', 'stimmig und leicht kombinierbar', 'Die Farbe liegt sehr nah an deiner Palette.'],
        good: ['Passt gut zur Farbkarte', 'harmonisch, aber nicht ganz identisch', 'Die Richtung stimmt.'],
        soft: ['Kann funktionieren - bewusst kombinieren', 'nah dran, aber mit kleiner Abweichung', 'Kombiniere bewusst mit Lieblingsfarben aus deiner Farbkarte.'],
        away: ['Eher kein Idealton', 'deutlich außerhalb der Farbkarte', 'Als kleines Detail kann die Farbe noch funktionieren.']
      }[key];
      return { title: data[0], label: data[1], advice: data[2] };
    }
  };
}

function renderPalette() {
  paletteGrid.innerHTML = '';
  activePalette.grid.flat().forEach((hex, index) => {
    const tile = document.createElement('div');
    const colorName = describeColor(hex, index, activePalette).name;
    tile.className = 'swatch';
    tile.style.background = hex;
    tile.style.setProperty('--label', readableTextColor(hex));
    tile.style.setProperty('--text-shadow', readableTextColor(hex) === '#fff' ? '0 1px 2px rgba(0,0,0,.55)' : '0 1px 2px rgba(255,255,255,.35)');
    tile.textContent = '';
    tile.title = colorName + ' · ' + formatPaletteName(activePalette.name) + ' · ' + I18N.t('ui.colorKnowledgeHint');
    tile.setAttribute('role', 'button');
    tile.setAttribute('tabindex', '0');
    tile.setAttribute('aria-label', I18N.t('ui.explainColor', { color: colorName }));
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
    const fullscreenIndex = Number(chip.dataset.fullscreenIndex);
    toggleColorFullscreen(chip.dataset.fullscreenColor, Number.isFinite(fullscreenIndex) ? fullscreenIndex : -1);
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
  const glossary = getColorGlossary(hex, index, activePalette);
  const story = glossary.story;
  const isDark = readableTextColor(hex) === '#fff';
  const contextLabel = Number.isInteger(index) && index >= 0 ? formatPaletteName(activePalette.name) : I18N.t('ui.measuredColor');

  fullscreenColor = hex;
  fullscreenColorIndex = index;
  colorFullscreen.style.background = `radial-gradient(circle at 74% 18%, rgba(255,255,255,${isDark ? '.16' : '.42'}), transparent 20rem), ${hex}`;
  colorFullscreen.classList.toggle('is-dark', isDark);
  colorFullscreen.classList.toggle('is-light', !isDark);
  colorFullscreen.innerHTML = `
    <button class="color-fullscreen-close" type="button" aria-label="${escapeHtml(I18N.t('ui.fullscreenClose'))}">×</button>
    <article class="color-fullscreen-card color-glossary-card" aria-label="${escapeHtml(I18N.t('ui.explanationTo', { color: story.name }))}">
      <div class="color-fullscreen-kicker">${escapeHtml(I18N.t('glossary.kicker'))} · ${escapeHtml(contextLabel)}</div>
      <div class="color-fullscreen-head">
        <span class="color-fullscreen-dot" style="background:${hex}"></span>
        <div>
          <h2>${escapeHtml(story.name)}</h2>
          <p class="color-fullscreen-hex">${escapeHtml(story.tone)}</p>
        </div>
      </div>
      <p class="color-glossary-intro">${escapeHtml(glossary.intro)}</p>
      <dl class="color-glossary-profile-grid">
        ${renderGlossaryProfile(glossary.profile)}
      </dl>
      <div class="color-fullscreen-section color-glossary-section">
        <span>${escapeHtml(I18N.t('ui.glossaryProfile'))}</span>
        <p>${escapeHtml(glossary.profileSummary)}</p>
      </div>
      <div class="color-fullscreen-section color-glossary-section">
        <span>${escapeHtml(I18N.t('ui.glossaryEffect'))}</span>
        <p>${escapeHtml(glossary.effect)}</p>
      </div>
      <div class="color-fullscreen-section color-glossary-section">
        <span>${escapeHtml(I18N.t('ui.glossaryFashion'))} · ${escapeHtml(I18N.t('ui.styleKnowledge'))}</span>
        <p>${escapeHtml(glossary.fashion)}</p>
      </div>
      <div class="color-fullscreen-section color-glossary-section">
        <span>${escapeHtml(I18N.t('ui.glossaryFormulas'))} · ${escapeHtml(I18N.t('ui.combine'))}</span>
        <ul class="color-glossary-list">
          ${glossary.formulas.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </div>
      <div class="color-fullscreen-section color-glossary-section">
        <span>${escapeHtml(I18N.t('ui.glossaryMaterials'))}</span>
        <p>${escapeHtml(glossary.materials)}</p>
      </div>
      <div class="color-fullscreen-section color-glossary-section">
        <span>${escapeHtml(I18N.t('ui.glossaryShopping'))}</span>
        <ul class="color-glossary-list">
          ${glossary.shopping.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </div>
      <div class="color-fullscreen-section color-glossary-section">
        <span>${escapeHtml(I18N.t('ui.glossaryDosDonts'))}</span>
        ${renderGlossaryChecklist(glossary.dos, glossary.donts)}
      </div>
      <div class="color-fullscreen-section color-glossary-section">
        <span>${escapeHtml(I18N.t('ui.glossaryRelated'))}</span>
        <p>${escapeHtml(glossary.relatedIntro)}</p>
        <div class="color-glossary-related-colors">
          ${renderGlossaryRelatedColors(glossary.relatedColors)}
        </div>
      </div>
      <p class="color-fullscreen-footnote">${escapeHtml(I18N.t('ui.fullscreenFootnote'))}</p>
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

  colorFullscreen.querySelectorAll('[data-glossary-related-color]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const relatedIndex = Number(button.dataset.fullscreenIndex);
      showColorFullscreen(button.dataset.glossaryRelatedColor, Number.isFinite(relatedIndex) ? relatedIndex : -1);
    });
  });

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

function renderGlossaryProfile(profile) {
  return profile.map((item) => `
    <div class="color-glossary-profile-item">
      <dt>${escapeHtml(item.label)}</dt>
      <dd>${escapeHtml(item.value)}</dd>
    </div>
  `).join('');
}

function renderGlossaryChecklist(dos, donts) {
  return `
    <div class="color-glossary-checklist">
      <ul>
        ${dos.map((item) => `<li><span aria-hidden="true">✓</span>${escapeHtml(item)}</li>`).join('')}
      </ul>
      <ul>
        ${donts.map((item) => `<li><span aria-hidden="true">×</span>${escapeHtml(item)}</li>`).join('')}
      </ul>
    </div>
  `;
}

function renderGlossaryRelatedColors(relatedColors) {
  return relatedColors.map((item) => `
    <button class="color-glossary-related-color" type="button" data-glossary-related-color="${item.hex}" data-fullscreen-index="${item.index}" aria-label="${escapeHtml(I18N.t('ui.explainColor', { color: item.name }))}">
      <span class="color-glossary-related-dot" style="background:${item.hex}"></span>
      <span>${escapeHtml(item.name)}</span>
    </button>
  `).join('');
}

function getColorGlossary(hex, index, palette) {
  const color = describeColor(hex, index, palette);
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const lab = rgbToLab(rgb.r, rgb.g, rgb.b);
  const key = classifyColorKey(hsl.h, hsl.s, hsl.l);
  const story = getColorStory(hex, index, palette);
  const family = colorStory(key).name;
  const profileValues = getGlossaryProfileValues(hsl, lab);
  const roleKey = getGlossaryRoleKey(hsl);
  const role = I18N.t('glossary.role.' + roleKey);
  const relatedColors = getGlossaryRelatedColors(hex, index, palette, lab);
  const partner = relatedColors[0] ? relatedColors[0].name : family;
  const neutral = getGlossaryNeutralText(palette);
  const lookFor = getGlossaryLookFor(profileValues);
  const avoid = getGlossaryAvoid(profileValues);
  const materials = getGlossaryMaterialText(profileValues);

  return {
    story,
    intro: I18N.t('glossary.intro', {
      name: story.name,
      family,
      temperature: profileValues.temperature.value,
      brightness: profileValues.brightness.value,
      clarity: profileValues.clarity.value,
      role
    }),
    profile: [
      { label: I18N.t('glossary.labels.family'), value: family },
      { label: I18N.t('glossary.labels.temperature'), value: profileValues.temperature.value },
      { label: I18N.t('glossary.labels.brightness'), value: profileValues.brightness.value },
      { label: I18N.t('glossary.labels.clarity'), value: profileValues.clarity.value },
      { label: I18N.t('glossary.labels.depth'), value: profileValues.depth.value },
      { label: I18N.t('glossary.labels.role'), value: role }
    ],
    profileSummary: I18N.t('glossary.profileSummary'),
    effect: I18N.t('glossary.effectPrefix', { name: story.name, tone: story.tone }) + ' ' + story.combinations,
    fashion: story.fact + ' ' + I18N.t('glossary.fashionContext'),
    formulas: [
      I18N.t('glossary.formulas.hero', { color: story.name, neutral }),
      I18N.t('glossary.formulas.accent', { color: story.name }),
      I18N.t('glossary.formulas.echo', { color: story.name, partner })
    ],
    materials,
    shopping: [
      I18N.t('glossary.shoppingLookFor', { lookFor }),
      I18N.t('glossary.shoppingAvoid', { avoid })
    ],
    dos: [
      I18N.t('glossary.dos.face'),
      I18N.t('glossary.dos.repeat'),
      I18N.t('glossary.dos.balance')
    ],
    donts: [
      I18N.t('glossary.donts.overload'),
      I18N.t('glossary.donts.wrongLight'),
      I18N.t('glossary.donts.isolate')
    ],
    relatedIntro: I18N.t('glossary.relatedIntro'),
    relatedColors
  };
}

function getGlossaryProfileValues(hsl, lab) {
  const temperatureKey = hsl.s < 0.14 ? 'neutral' : (isWarmHue(hsl.h) ? 'warm' : 'cool');
  const brightnessKey = hsl.l > 0.74 ? 'light' : (hsl.l < 0.38 ? 'deep' : 'medium');
  const clarityKey = hsl.s > 0.62 ? 'clear' : (hsl.s < 0.34 ? 'soft' : 'balanced');
  const chroma = labChroma(lab);
  let depthKey = 'rich';
  if (hsl.l > 0.78) depthKey = 'airy';
  else if (hsl.l < 0.30 || chroma > 62) depthKey = 'deep';
  else if (hsl.s < 0.24) depthKey = 'grounded';

  return {
    temperature: glossaryValue(temperatureKey),
    brightness: glossaryValue(brightnessKey),
    clarity: glossaryValue(clarityKey),
    depth: glossaryValue(depthKey)
  };
}

function glossaryValue(key) {
  return {
    key,
    value: I18N.t('glossary.values.' + key)
  };
}

function getGlossaryRoleKey(hsl) {
  if (hsl.l > 0.78) return 'lightSurface';
  if (hsl.l < 0.30) return 'depthAnchor';
  if (hsl.s > 0.62) return 'accent';
  if (hsl.s < 0.34) return 'connector';
  return 'wardrobeColor';
}

function getGlossaryNeutralText(palette) {
  const name = String(palette && palette.name ? palette.name : '').toLowerCase();
  if (name.includes('warm')) return I18N.t('glossary.neutralWarm');
  if (name.includes('cool')) return I18N.t('glossary.neutralCool');
  return I18N.t('glossary.neutralNeutral');
}

function getGlossaryLookFor(profileValues) {
  if (profileValues.clarity.key === 'clear') return I18N.t('glossary.lookFor.clear');
  if (profileValues.clarity.key === 'soft') return I18N.t('glossary.lookFor.soft');
  if (profileValues.temperature.key === 'warm') return I18N.t('glossary.lookFor.warm');
  if (profileValues.temperature.key === 'cool') return I18N.t('glossary.lookFor.cool');
  return I18N.t('glossary.lookFor.neutral');
}

function getGlossaryAvoid(profileValues) {
  if (profileValues.clarity.key === 'clear') return I18N.t('glossary.avoid.clear');
  if (profileValues.clarity.key === 'soft') return I18N.t('glossary.avoid.soft');
  if (profileValues.brightness.key === 'deep') return I18N.t('glossary.avoid.deep');
  if (profileValues.brightness.key === 'light') return I18N.t('glossary.avoid.light');
  if (profileValues.temperature.key === 'warm') return I18N.t('glossary.avoid.warm');
  if (profileValues.temperature.key === 'cool') return I18N.t('glossary.avoid.cool');
  return I18N.t('glossary.avoid.clear');
}

function getGlossaryMaterialText(profileValues) {
  if (profileValues.clarity.key === 'clear') return I18N.t('glossary.materialClear') + ' ' + I18N.t('glossary.materialBalanced');
  if (profileValues.clarity.key === 'soft') return I18N.t('glossary.materialSoft') + ' ' + I18N.t('glossary.materialBalanced');
  if (profileValues.brightness.key === 'deep') return I18N.t('glossary.materialDeep') + ' ' + I18N.t('glossary.materialBalanced');
  if (profileValues.brightness.key === 'light') return I18N.t('glossary.materialLight') + ' ' + I18N.t('glossary.materialBalanced');
  return I18N.t('glossary.materialBalanced');
}

function getGlossaryRelatedColors(hex, index, palette, lab) {
  if (!palette || !Array.isArray(palette.colors)) return [];
  const nearest = findNearestColors({ lab }, palette, 7).filter((item) => !(
    item.index === index && normalizeHexValue(item.hex) === normalizeHexValue(hex)
  ));
  return nearest.slice(0, 3).map((item) => ({
    ...item,
    name: describeColor(item.hex, item.index, palette).name
  }));
}

function getColorStory(hex, index, palette) {
  const color = describeColor(hex, index, palette);
  const paletteNote = getPaletteCombinationNote(palette.name);
  const depthNote = getPaletteDepthNote(palette.name);
  return {
    name: color.name,
    tone: color.tone,
    fact: color.fact,
    combinations: color.combinations + ' ' + paletteNote + ' ' + depthNote
  };
}

function describeColor(hex, index = -1, palette = null) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const key = classifyColorKey(hsl.h, hsl.s, hsl.l);
  const story = colorStory(key);
  return {
    ...story,
    name: getNuancedColorName(hex, key, hsl, index, palette, story.name)
  };
}

function classifyColorKey(h, s, l) {
  if (l >= 0.92 && s <= 0.22) return l > 0.97 ? 'whiteClear' : 'whiteCream';

  if (s <= 0.12) {
    if (l < 0.20) return 'graphite';
    if (l < 0.55) return 'taupeGrey';
    return 'greige';
  }

  if (isBrownHue(h, s, l)) {
    if (l < 0.24) return 'espresso';
    if (l < 0.43) return h < 28 ? 'chocolateBrown' : 'cognacBrown';
    if (l < 0.66) return 'camel';
    return 'sandBeige';
  }

  if (h < 12 || h >= 350) {
    if (l < 0.32) return 'burgundy';
    return h >= 350 ? 'cherryRed' : 'tomatoRed';
  }

  if (h < 26) return l > 0.62 ? 'coral' : 'terracotta';
  if (h < 45) return l > 0.66 ? 'apricot' : 'rustOrange';

  if (h < 70) {
    if (l > 0.72) return 'vanillaYellow';
    if (h < 53 || s < 0.45 || l < 0.60) return 'goldenYellow';
    return 'lemonYellow';
  }

  if (h < 165) {
    if (h < 90) return l < 0.36 ? 'oliveGreen' : 'limeGreen';
    if (l < 0.28) return 'forestGreen';
    return s < 0.38 ? 'sageGreen' : 'emeraldGreen';
  }

  if (h < 200) return l < 0.30 ? 'petrol' : 'turquoise';

  if (h < 250) {
    if (l < 0.25) return 'nightBlue';
    return 'cobaltBlue';
  }

  if (h < 320) return l < 0.34 ? 'aubergine' : 'violet';

  if (h < 350) {
    if (l < 0.38) return 'berry';
    return l > 0.70 ? 'powderPink' : 'rosePink';
  }

  return 'generic';
}

function colorStory(key) {
  return I18N.getColorStory(key);
}

function getNuancedColorName(hex, key, hsl, index, palette, fallbackName) {
  if (palette && Array.isArray(palette.colors) && Number.isInteger(index) && index >= 0) {
    const cacheId = [palette.slug || palette.name || 'palette', getCurrentLanguage()].join('|');
    if (!paletteColorNameCache.has(cacheId)) {
      paletteColorNameCache.set(cacheId, buildPaletteColorNameMap(palette));
    }
    const map = paletteColorNameCache.get(cacheId);
    const mappedName = map.get(colorNameMapKey(hex, index));
    if (mappedName) return mappedName;
  }

  return getColorNameCandidates(hex, key, hsl, index, fallbackName)[0] || fallbackName;
}

function buildPaletteColorNameMap(palette) {
  const map = new Map();
  const usedNames = new Set();
  const colors = Array.isArray(palette.colors) ? palette.colors : palette.grid.flat();

  colors.forEach((hex, index) => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const key = classifyColorKey(hsl.h, hsl.s, hsl.l);
    const fallbackName = colorStory(key).name;
    const candidates = getColorNameCandidates(hex, key, hsl, index, fallbackName);
    let selected = candidates.find((name) => !usedNames.has(normalizeColorName(name)));

    if (!selected) {
      selected = fallbackName;
      let attempt = 0;
      while (usedNames.has(normalizeColorName(selected)) && attempt < 24) {
        const modifier = getColorNameModifiers(hsl, hex, index + attempt)[attempt % getColorNameModifiers(hsl, hex, index + attempt).length];
        selected = fallbackName + ' · ' + modifier;
        attempt += 1;
      }
    }

    map.set(colorNameMapKey(hex, index), selected);
    usedNames.add(normalizeColorName(selected));
  });

  return map;
}

function getColorNameCandidates(hex, key, hsl, index, fallbackName) {
  const variants = getLocalizedColorNameVariants(key, fallbackName);
  const seed = colorNameSeed(hex, index, hsl);
  const start = variants.length ? seed % variants.length : 0;
  const candidates = [];

  for (let offset = 0; offset < variants.length; offset += 1) {
    candidates.push(variants[(start + offset) % variants.length]);
  }

  const modifiers = getColorNameModifiers(hsl, hex, index);
  modifiers.forEach((modifier) => candidates.push(fallbackName + ' · ' + modifier));
  modifiers.forEach((modifier) => {
    variants.forEach((variant) => candidates.push(variant + ' · ' + modifier));
  });

  return uniqueColorNames(candidates.filter(Boolean));
}

function getLocalizedColorNameVariants(key, fallbackName) {
  const language = getCurrentLanguage();
  const languageNames = COLOR_NAME_VARIANTS[language] || COLOR_NAME_VARIANTS.de || {};
  const fallbackNames = COLOR_NAME_VARIANTS.de || {};
  const variants = languageNames[key] || fallbackNames[key] || [];
  return variants.length ? variants : [fallbackName || key];
}

function getColorNameModifiers(hsl, hex, index) {
  const language = getCurrentLanguage();
  const dictionary = COLOR_NAME_MODIFIERS[language] || COLOR_NAME_MODIFIERS.de;
  const picks = [];

  if (hsl.l < 0.24) picks.push(dictionary.deep);
  else if (hsl.l < 0.38) picks.push(dictionary.dark);
  else if (hsl.l > 0.78) picks.push(dictionary.light);

  if (hsl.s > 0.70) picks.push(dictionary.clear, dictionary.bright);
  else if (hsl.s < 0.30) picks.push(dictionary.soft, dictionary.muted);
  else picks.push(dictionary.rich);

  if (isWarmHue(hsl.h)) picks.push(dictionary.warm);
  else picks.push(dictionary.cool);

  picks.push(dictionary.elegant, dictionary.smoky);

  const unique = uniqueColorNames(picks.filter(Boolean));
  const start = unique.length ? colorNameSeed(hex, index, hsl) % unique.length : 0;
  return unique.slice(start).concat(unique.slice(0, start));
}

function isWarmHue(h) {
  return h < 75 || h >= 330;
}

function getCurrentLanguage() {
  return typeof I18N.getLanguage === 'function' ? I18N.getLanguage() : 'de';
}

function colorNameSeed(hex, index, hsl) {
  const data = [normalizeHexValue(hex), Number.isInteger(index) ? index : -1, Math.round((hsl.h || 0) * 10), Math.round((hsl.s || 0) * 100), Math.round((hsl.l || 0) * 100)].join('|');
  let hash = 0;
  for (let i = 0; i < data.length; i += 1) {
    hash = ((hash << 5) - hash + data.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function colorNameMapKey(hex, index) {
  return String(index) + ':' + normalizeHexValue(hex);
}

function normalizeHexValue(hex) {
  return String(hex || '').trim().toUpperCase();
}

function normalizeColorName(name) {
  return String(name || '').trim().toLocaleLowerCase();
}

function uniqueColorNames(names) {
  const seen = new Set();
  return names.filter((name) => {
    const normalized = normalizeColorName(name);
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

function isBrownHue(h, s, l) {
  return h >= 15 && h <= 52 && (
    (l < 0.30 && s < 0.95) ||
    (l < 0.48 && s < 0.62) ||
    (l < 0.62 && s < 0.45)
  );
}

function getPaletteCombinationNote(name) {
  return I18N.getPaletteCombinationNote(name);
}

function getPaletteDepthNote(name) {
  return I18N.getPaletteDepthNote(name);
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

function initializeScanFlow() {
  if (scanButton) scanButton.addEventListener('click', handleScanButtonClick);
  if (scannerClose) scannerClose.addEventListener('click', closeCameraScanner);
  if (scannerCancel) scannerCancel.addEventListener('click', closeCameraScanner);
  if (scanResultClose) scanResultClose.addEventListener('click', closeScanResult);
  if (result) {
    result.addEventListener('click', (event) => {
      if (event.target.closest('[data-close-scan-result]')) closeScanResult();
    });
  }
  if (cameraScanner) {
    cameraScanner.addEventListener('click', (event) => {
      if (event.target === cameraScanner) closeCameraScanner();
    });
  }
  if (scannerCapture) scannerCapture.addEventListener('click', captureScannerFrame);
  if (scannerFileFallback) scannerFileFallback.addEventListener('click', () => {
    closeCameraScanner();
    triggerPhotoInput();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && cameraScanner && !cameraScanner.classList.contains('hidden')) {
      closeCameraScanner();
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) closeCameraScanner();
  });
}

function handleScanButtonClick() {
  if (canUseLiveScanner()) {
    openCameraScanner();
    return;
  }

  triggerPhotoInput();
}

function canUseLiveScanner() {
  return Boolean(
    cameraScanner &&
    scannerVideo &&
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function'
  );
}

function triggerPhotoInput() {
  if (!photoInput || typeof photoInput.click !== 'function') return;
  photoInput.value = '';
  photoInput.click();
}

async function openCameraScanner() {
  if (!canUseLiveScanner()) {
    triggerPhotoInput();
    return;
  }

  const currentSessionId = scannerSessionId + 1;
  closeCameraScanner({ prepareForOpen: true });
  scannerSessionId = currentSessionId;
  cameraScanner.classList.remove('hidden');
  cameraScanner.setAttribute('aria-hidden', 'false');
  document.body.classList.add('scanner-open');
  updateScannerQualityBadge({ label: I18N.t('scan.light.checking'), level: 'neutral' });

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    });

    if (scannerSessionId !== currentSessionId || cameraScanner.classList.contains('hidden')) {
      stream.getTracks().forEach((track) => track.stop());
      return;
    }

    cameraStream = stream;
    scannerVideo.srcObject = cameraStream;
    await scannerVideo.play();

    if (scannerSessionId !== currentSessionId || cameraScanner.classList.contains('hidden')) {
      closeCameraScanner();
      return;
    }

    startScannerQualityLoop();
  } catch (error) {
    if (scannerSessionId !== currentSessionId || cameraScanner.classList.contains('hidden')) return;
    closeCameraScanner();
    showInstallHint(I18N.t('scan.cameraFallback'));
    triggerPhotoInput();
  }
}

function startScannerQualityLoop() {
  stopScannerQualityLoop();
  updateScannerQualityFromVideo();
  scannerQualityTimer = window.setInterval(updateScannerQualityFromVideo, SCANNER_QUALITY_INTERVAL);
}

function stopScannerQualityLoop() {
  if (scannerQualityTimer) {
    window.clearInterval(scannerQualityTimer);
    scannerQualityTimer = null;
  }
}

function updateScannerQualityFromVideo() {
  if (!scannerVideo || !scannerCtx || !scannerCanvas || !scannerVideo.videoWidth || !scannerVideo.videoHeight) return;
  drawMediaToCanvas(scannerVideo, scannerCanvas, scannerCtx, 420);
  const liveSample = sampleGarmentColor(scannerCanvas, scannerCtx);
  updateScannerQualityBadge(assessLightQuality(liveSample));
}

function updateScannerQualityBadge(quality) {
  if (!scannerQuality || !quality) return;
  scannerQuality.textContent = quality.label || I18N.t('scan.light.checking');
  scannerQuality.classList.remove('quality-good', 'quality-warning', 'quality-bad', 'quality-neutral');
  scannerQuality.classList.add('quality-' + (quality.level || 'neutral'));
}

function captureScannerFrame() {
  if (!scannerVideo || !scannerVideo.videoWidth || !scannerVideo.videoHeight) {
    triggerPhotoInput();
    return;
  }

  drawMediaToCanvas(scannerVideo, previewCanvas, ctx, 1200);
  previewWrap.classList.remove('hidden');
  analyzeCanvas();
  closeCameraScanner();
}

function closeCameraScanner(options = {}) {
  const prepareForOpen = Boolean(options && options.prepareForOpen);
  if (!prepareForOpen) scannerSessionId += 1;
  stopScannerQualityLoop();

  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }

  if (scannerVideo) {
    try {
      scannerVideo.pause();
    } catch (error) {
      // Manche Browser werfen beim Pausieren eines noch nicht gestarteten Streams.
    }
    scannerVideo.srcObject = null;
  }

  if (!prepareForOpen && cameraScanner) {
    cameraScanner.classList.add('hidden');
    cameraScanner.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('scanner-open');
  }
}

function closeScanResult() {
  closeCameraScanner();
  closeColorFullscreen();

  if (previewWrap) previewWrap.classList.add('hidden');
  if (scanSessionToolbar) scanSessionToolbar.classList.add('hidden');

  if (result) {
    result.className = 'result hidden';
    result.innerHTML = '';
  }

  if (previewCanvas && ctx) {
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
  }

  if (photoInput) photoInput.value = '';
  document.body.classList.remove('scan-result-open');

  if (scanButton && typeof scanButton.focus === 'function') {
    try {
      scanButton.focus({ preventScroll: true });
    } catch (error) {
      scanButton.focus();
    }
  }
}

function drawMediaToCanvas(source, canvas, context, maxSide) {
  const sourceWidth = source.videoWidth || source.naturalWidth || source.width;
  const sourceHeight = source.videoHeight || source.naturalHeight || source.height;
  const scale = Math.min(1, maxSide / Math.max(sourceWidth, sourceHeight));
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));
  canvas.width = width;
  canvas.height = height;
  context.clearRect(0, 0, width, height);
  context.drawImage(source, 0, 0, width, height);
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
  drawMediaToCanvas(img, previewCanvas, ctx, 1200);
}

function analyzeCanvas() {
  const sampled = sampleGarmentColor(previewCanvas, ctx);
  const nearestColors = findNearestColors(sampled, activePalette, 3);
  const match = nearestColors[0];
  if (!match) return;

  const lightQuality = assessLightQuality(sampled);
  const toneComparison = compareToneFit(sampled, match);
  const fit = getPaletteFit(match.delta, toneComparison, lightQuality);

  const sampledName = describeColor(sampled.hex).name;
  const matchName = describeColor(match.hex, match.index, activePalette).name;

  if (scanSessionToolbar) scanSessionToolbar.classList.remove('hidden');
  document.body.classList.add('scan-result-open');
  result.className = `result ${fit.className}`;
  result.innerHTML = `
    <button class="scan-result-inline-close" type="button" data-close-scan-result aria-label="${escapeHtml(I18N.t('scan.cancel'))}">×</button>
    <div class="result-swatch-stack">
      <button class="color-chip result-sample-chip" type="button" style="background:${sampled.hex}" title="${escapeHtml(I18N.t('ui.resultColorTitle', { color: sampledName }))}" aria-label="${escapeHtml(I18N.t('ui.resultSampleAria', { color: sampledName }))}" data-fullscreen-color="${sampled.hex}" data-fullscreen-index="-1"></button>
      <span>${escapeHtml(I18N.t('scan.measuredShort'))}</span>
    </div>
    <div class="result-main">
      <div class="scan-quality-row" aria-label="${escapeHtml(I18N.t('scan.light.aria'))}">
        ${renderQualityPills(lightQuality)}
      </div>
      <div class="result-eyebrow">${escapeHtml(I18N.t('ui.resultEyebrow'))}</div>
      <div class="result-title">${escapeHtml(fit.title)}</div>
      <div class="tone-details">
        ${toneComparison.details.map((detail) => `<span class="tone-detail ${detail.ok ? 'tone-ok' : 'tone-shift'}">${escapeHtml(detail.label)}</span>`).join('')}
      </div>
      <div class="result-meta">
        ${escapeHtml(I18N.t('ui.yourColor'))}: <strong>${escapeHtml(sampledName)}</strong><br>
        ${escapeHtml(I18N.t('ui.nearestPaletteColor'))}: <strong>${escapeHtml(matchName)}</strong>
      </div>
      <div class="fit-meter" aria-label="${escapeHtml(I18N.t('ui.fitMeter', { label: fit.label }))}">
        <span style="width:${fit.score}%"></span>
      </div>
      <div class="result-advice">${escapeHtml(fit.advice)}</div>
      <div class="confidence-note">${escapeHtml(fit.confidenceNote)}</div>
      <div class="nearest-palette-block">
        <span>${escapeHtml(I18N.t('scan.nearestThree'))}</span>
        <div class="nearest-palette-colors">
          ${renderNearestPaletteMatches(nearestColors)}
        </div>
      </div>
    </div>
    <div class="result-swatch-stack">
      <button class="color-chip result-match-chip" type="button" style="background:${match.hex}" title="${escapeHtml(I18N.t('ui.resultColorTitle', { color: matchName }))}" aria-label="${escapeHtml(I18N.t('ui.resultMatchAria', { color: matchName }))}" data-fullscreen-color="${match.hex}" data-fullscreen-index="${match.index}"></button>
      <span>${escapeHtml(I18N.t('scan.paletteShort'))}</span>
    </div>
  `;
  result.classList.remove('hidden');
}

function renderQualityPills(lightQuality) {
  const pills = [{ label: lightQuality.label, level: lightQuality.level }].concat(lightQuality.issues || []);
  return pills.slice(0, 3).map((pill) => (
    `<span class="scan-quality-pill quality-${escapeHtml(pill.level || lightQuality.level || 'neutral')}">${escapeHtml(pill.label)}</span>`
  )).join('');
}

function renderNearestPaletteMatches(nearestColors) {
  return nearestColors.map((item, itemIndex) => {
    const name = describeColor(item.hex, item.index, activePalette).name;
    return `
      <button class="nearest-palette-chip" type="button" title="${escapeHtml(I18N.t('ui.resultColorTitle', { color: name }))}" aria-label="${escapeHtml(I18N.t('ui.resultMatchAria', { color: name }))}" data-fullscreen-color="${item.hex}" data-fullscreen-index="${item.index}">
        <span class="nearest-rank">${itemIndex + 1}</span>
        <span class="nearest-dot" style="background:${item.hex}"></span>
        <span class="nearest-name">${escapeHtml(name)}</span>
      </button>
    `;
  }).join('');
}

function getPaletteFit(delta, toneComparison, lightQuality) {
  const qualityMultiplier = lightQuality.confidenceMultiplier || 1;
  const score = Math.max(6, Math.min(98, Math.round(fitScoreFromDelta(delta) * qualityMultiplier)));
  const hasBadLight = lightQuality.level === 'bad';
  const hasWarningLight = lightQuality.level === 'warning';
  let key;
  let className;

  if (hasBadLight) {
    key = 'unsure';
    className = 'result-fit-unsure';
  } else if (score >= 88) {
    key = 'veryGood';
    className = 'result-fit-perfect';
  } else if (score >= 76) {
    key = 'good';
    className = 'result-fit-strong';
  } else if (score >= 62) {
    key = 'almost';
    className = 'result-fit-good';
  } else if (score >= 44) {
    key = 'borderline';
    className = 'result-fit-soft';
  } else {
    key = 'notIdeal';
    className = 'result-fit-away';
  }

  const title = I18N.t('scan.verdict.' + key, { score });
  const label = I18N.t('scan.label.' + key);
  const advice = hasBadLight
    ? I18N.t('scan.advice.retry')
    : getScanAdvice(toneComparison, key, hasWarningLight);
  const confidenceNote = I18N.t(hasWarningLight || hasBadLight ? 'scan.confidence.warning' : 'scan.confidence.good', {
    points: String(toneComparison.pointCount || 0)
  });

  return { className, score, title, label, advice, confidenceNote };
}

function getScanAdvice(toneComparison, key, hasWarningLight) {
  if (key === 'veryGood') return I18N.t('scan.advice.veryGood');
  if (key === 'good') return I18N.t('scan.advice.good');

  const shift = toneComparison.primaryShift;
  if (shift) return I18N.t('scan.advice.' + shift);
  if (hasWarningLight) return I18N.t('scan.advice.checkAgain');
  return I18N.t('scan.advice.neutral');
}

function fitScoreFromDelta(delta) {
  if (delta <= 6) return 96 - delta;
  if (delta <= 12) return 90 - ((delta - 6) * 2.2);
  if (delta <= MATCH_THRESHOLD) return 77 - ((delta - 12) * 2.4);
  if (delta <= 30) return 63 - ((delta - MATCH_THRESHOLD) * 2.1);
  return Math.max(8, 38 - ((delta - 30) * 0.8));
}

function compareToneFit(sampled, match) {
  const matchRgb = hexToRgb(match.hex);
  const matchLab = rgbToLab(matchRgb.r, matchRgb.g, matchRgb.b);
  const sampleLab = sampled.lab;
  const pointCount = sampled.metrics ? sampled.metrics.pointCount : 0;
  const sampleChroma = labChroma(sampleLab);
  const matchChroma = labChroma(matchLab);
  const brightnessDelta = sampleLab.L - matchLab.L;
  const warmthDelta = warmthScore(sampleLab) - warmthScore(matchLab);
  const clarityDelta = sampleChroma - matchChroma;
  const details = [
    dimensionDetail('brightness', brightnessDelta, 7, 'tooLight', 'tooDark'),
    dimensionDetail('warmth', warmthDelta, 7, 'tooWarm', 'tooCool'),
    dimensionDetail('clarity', clarityDelta, 9, 'tooClear', 'tooMuted')
  ];
  const primary = details
    .filter((detail) => !detail.ok)
    .sort((a, b) => Math.abs(b.delta / b.threshold) - Math.abs(a.delta / a.threshold))[0];

  return {
    details,
    primaryShift: primary ? primary.key : '',
    pointCount
  };
}

function dimensionDetail(name, delta, threshold, highKey, lowKey) {
  if (Math.abs(delta) <= threshold) {
    return { name, key: name + 'Ok', label: I18N.t('scan.dimension.' + name + '.ok'), ok: true, delta, threshold };
  }
  const key = delta > 0 ? highKey : lowKey;
  return { name, key, label: I18N.t('scan.dimension.' + name + '.' + key), ok: false, delta, threshold };
}

function sampleCenterColor(canvas, context) {
  return sampleGarmentColor(canvas, context);
}

function sampleGarmentColor(canvas, context) {
  const w = canvas.width;
  const h = canvas.height;
  const size = Math.max(24, Math.round(Math.min(w, h) * SCAN_TARGET_RADIUS_RATIO * 2));
  const x = Math.round((w - size) / 2);
  const y = Math.round((h - size) / 2);
  const radius = size / 2;
  const patchRadius = Math.max(3, Math.round(size * 0.055));
  const skip = Math.max(1, Math.round(size / 180));
  const image = context.getImageData(x, y, size, size).data;
  const pixels = [];

  for (let py = 0; py < size; py += skip) {
    for (let px = 0; px < size; px += skip) {
      const dx = px - radius;
      const dy = py - radius;
      if ((dx * dx) + (dy * dy) > radius * radius) continue;
      const offset = ((py * size) + px) * 4;
      const a = image[offset + 3];
      if (a < 250) continue;
      const r = image[offset];
      const g = image[offset + 1];
      const b = image[offset + 2];
      pixels.push({
        r,
        g,
        b,
        lum: relativeLuminance(r, g, b),
        s: rgbToHsl(r, g, b).s,
        relX: dx / radius,
        relY: dy / radius
      });
    }
  }

  const pointSamples = SCAN_POINT_LAYOUT
    .map(([rx, ry]) => averagePatch(image, size, radius + (rx * radius), radius + (ry * radius), patchRadius))
    .filter(Boolean);
  const usablePixels = trimScanPixels(pixels);
  const average = averageRgb(usablePixels.length ? usablePixels : pixels);
  const lab = rgbToLab(average.r, average.g, average.b);

  return {
    ...average,
    hex: rgbToHex(average.r, average.g, average.b),
    lab,
    hsl: rgbToHsl(average.r, average.g, average.b),
    metrics: buildScanMetrics(pixels, usablePixels, pointSamples),
    pointSamples
  };
}

function averagePatch(image, size, centerX, centerY, patchRadius) {
  const pixels = [];
  const startX = Math.max(0, Math.round(centerX - patchRadius));
  const endX = Math.min(size - 1, Math.round(centerX + patchRadius));
  const startY = Math.max(0, Math.round(centerY - patchRadius));
  const endY = Math.min(size - 1, Math.round(centerY + patchRadius));

  for (let y = startY; y <= endY; y += 1) {
    for (let x = startX; x <= endX; x += 1) {
      const offset = ((y * size) + x) * 4;
      if (image[offset + 3] < 250) continue;
      const r = image[offset];
      const g = image[offset + 1];
      const b = image[offset + 2];
      pixels.push({ r, g, b, lum: relativeLuminance(r, g, b) });
    }
  }

  if (!pixels.length) return null;
  const average = averageRgb(trimScanPixels(pixels));
  return {
    ...average,
    hex: rgbToHex(average.r, average.g, average.b),
    lab: rgbToLab(average.r, average.g, average.b)
  };
}

function trimScanPixels(pixels) {
  if (!pixels.length) return [];
  const sorted = pixels.slice().sort((a, b) => a.lum - b.lum);
  const cut = Math.floor(sorted.length * 0.12);
  const trimmed = sorted.slice(cut, sorted.length - cut);
  return trimmed.length ? trimmed : sorted;
}

function averageRgb(pixels) {
  if (!pixels.length) return { r: 0, g: 0, b: 0 };
  let r = 0;
  let g = 0;
  let b = 0;
  pixels.forEach((p) => {
    r += p.r;
    g += p.g;
    b += p.b;
  });
  return {
    r: Math.round(r / pixels.length),
    g: Math.round(g / pixels.length),
    b: Math.round(b / pixels.length)
  };
}

function buildScanMetrics(pixels, usablePixels, pointSamples) {
  const source = pixels.length ? pixels : [{ r: 0, g: 0, b: 0, lum: 0, s: 0, relX: 0, relY: 0 }];
  const use = usablePixels.length ? usablePixels : source;
  const avg = averageRgb(use);
  const meanLuminance = averageNumber(source.map((p) => p.lum));
  const luminanceStd = standardDeviation(source.map((p) => p.lum), meanLuminance);
  const darkRatio = source.filter((p) => p.lum < 42).length / source.length;
  const highlightRatio = source.filter((p) => p.lum > 232).length / source.length;
  const meanSaturation = averageNumber(source.map((p) => p.s || 0));
  const regionMeans = [
    averageRegion(source, (p) => p.relX < -0.25),
    averageRegion(source, (p) => p.relX > 0.25),
    averageRegion(source, (p) => p.relY < -0.25),
    averageRegion(source, (p) => p.relY > 0.25)
  ].filter((value) => Number.isFinite(value));
  const shadowContrast = regionMeans.length ? Math.max(...regionMeans) - Math.min(...regionMeans) : 0;

  return {
    pixelCount: source.length,
    pointCount: pointSamples.length,
    meanR: avg.r,
    meanG: avg.g,
    meanB: avg.b,
    meanLuminance,
    luminanceStd,
    darkRatio,
    highlightRatio,
    meanSaturation,
    warmCast: ((avg.r + avg.g) / 2) - avg.b,
    shadowContrast
  };
}

function assessLightQuality(sample) {
  const metrics = sample.metrics || {};
  const issues = [];
  let level = 'good';
  let confidenceMultiplier = 1;

  if ((metrics.pointCount || 0) < 5 || (metrics.pixelCount || 0) < 80) {
    issues.push(lightIssue('unstable', 'bad'));
    level = 'bad';
  }

  if (metrics.meanLuminance < 50 || metrics.darkRatio > 0.34) {
    issues.push(lightIssue('tooDark', 'bad'));
    level = 'bad';
  } else if (metrics.meanLuminance < 72) {
    issues.push(lightIssue('dim', 'warning'));
    if (level !== 'bad') level = 'warning';
  }

  if (metrics.highlightRatio > 0.20) {
    issues.push(lightIssue('tooBright', 'warning'));
    if (level !== 'bad') level = 'warning';
  }

  if (metrics.shadowContrast > 58 || metrics.luminanceStd > 54) {
    issues.push(lightIssue('shadow', metrics.shadowContrast > 84 ? 'bad' : 'warning'));
    if (metrics.shadowContrast > 84) level = 'bad';
    else if (level !== 'bad') level = 'warning';
  }

  if (metrics.warmCast > 34 && metrics.meanSaturation < 0.52 && metrics.meanLuminance > 60) {
    issues.push(lightIssue('tooYellow', 'warning'));
    if (level !== 'bad') level = 'warning';
  }

  if (level === 'bad') confidenceMultiplier = 0.58;
  else if (level === 'warning') confidenceMultiplier = 0.78;

  return {
    label: level === 'good' ? I18N.t('scan.light.good') : I18N.t('scan.light.uncertain'),
    level,
    confidenceMultiplier,
    issues: uniqueLightIssues(issues)
  };
}

function lightIssue(key, level) {
  return { key, level, label: I18N.t('scan.light.' + key) };
}

function uniqueLightIssues(issues) {
  const seen = new Set();
  return issues.filter((issue) => {
    if (seen.has(issue.key)) return false;
    seen.add(issue.key);
    return true;
  });
}

function averageRegion(pixels, predicate) {
  const values = pixels.filter(predicate).map((p) => p.lum);
  return values.length ? averageNumber(values) : NaN;
}

function averageNumber(values) {
  return values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
}

function standardDeviation(values, mean = averageNumber(values)) {
  const variance = averageNumber(values.map((value) => Math.pow(value - mean, 2)));
  return Math.sqrt(variance);
}

function findNearestColor(sampled, palette) {
  return findNearestColors(sampled, palette, 1)[0];
}

function findNearestColors(sampled, palette, limit = 3) {
  return palette.colors.map((hex, index) => {
    const rgb = hexToRgb(hex);
    const lab = rgbToLab(rgb.r, rgb.g, rgb.b);
    const delta = ciede2000(sampled.lab, lab);
    return { hex, index, delta };
  }).sort((a, b) => a.delta - b.delta).slice(0, limit);
}

function labChroma(lab) {
  return Math.sqrt((lab.a * lab.a) + (lab.b * lab.b));
}

function warmthScore(lab) {
  return lab.b + (lab.a * 0.18);
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
      serviceWorkerRegistration = await navigator.serviceWorker.register(
        '../sw.js?v=' + encodeURIComponent(ESKYNA_APP_VERSION),
        { scope: basePath, updateViaCache: 'none' }
      );

      if (serviceWorkerRegistration.waiting && navigator.serviceWorker.controller) {
        showUpdateButton(serviceWorkerRegistration.waiting);
      }

      serviceWorkerRegistration.addEventListener('updatefound', () => {
        const newWorker = serviceWorkerRegistration.installing;
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

      await checkForAppUpdate();
      startUpdateChecks();
    } catch (error) {
      // Kein sichtbarer Fehler: Die Farbkarte funktioniert auch ohne Service Worker.
    }
  });
}

function startUpdateChecks() {
  if (updateCheckTimer) return;
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) checkForAppUpdate();
  });
  window.addEventListener('focus', checkForAppUpdate);
  window.addEventListener('online', checkForAppUpdate);
  updateCheckTimer = window.setInterval(checkForAppUpdate, UPDATE_CHECK_INTERVAL);
}

async function checkForAppUpdate() {
  if (!serviceWorkerRegistration) return;

  try {
    await serviceWorkerRegistration.update();
  } catch (error) {
    // Ein fehlgeschlagener Check soll die Kundin nicht stören.
  }

  if (serviceWorkerRegistration.waiting && navigator.serviceWorker.controller) {
    showUpdateButton(serviceWorkerRegistration.waiting);
    return;
  }

  await checkRemoteVersion();
}

async function checkRemoteVersion() {
  if (!isRealBuildVersion(ESKYNA_APP_VERSION)) return;
  const basePath = window.ESKYNA_BASE_PATH || '/farbe/';

  try {
    const response = await fetch(basePath + 'version.json?check=' + Date.now(), {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) return;
    const data = await response.json();
    if (data && data.version && data.version !== ESKYNA_APP_VERSION) {
      showUpdateButton(null, true);
    }
  } catch (error) {
    // Offline oder Server nicht erreichbar: kein sichtbarer Fehler.
  }
}

function isRealBuildVersion(version) {
  return typeof version === 'string' && version && !version.includes('__');
}

function showUpdateButton(worker, forceReload = false) {
  if (!updateButton) return;

  waitingServiceWorker = worker || null;
  forceUpdateReload = Boolean(forceReload);
  hideInstallButton();
  updateButton.disabled = false;
  updateButton.textContent = I18N.t('ui.updateApp');
  updateButton.classList.remove('hidden');
  document.body.classList.add('has-update');
}

function initializeInstallPrompt() {
  if (!installButton) return;

  hideInstallButton();
  initializeIosInstallSheet();

  if (updateButton) {
    updateButton.addEventListener('click', handleUpdateClick);
  }

  if (isStandaloneMode()) return;

  installButton.addEventListener('click', handleInstallClick);

  if (isIosDevice()) {
    installButton.textContent = I18N.t('ui.iosInstallApp');
    showInstallButton();
    return;
  }

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
  if (isIosDevice()) {
    openIosInstallSheet();
    return;
  }

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

function initializeIosInstallSheet() {
  if (!iosInstallSheet) return;

  if (iosInstallClose) iosInstallClose.addEventListener('click', closeIosInstallSheet);
  if (iosInstallDone) iosInstallDone.addEventListener('click', closeIosInstallSheet);
  if (iosInstallCopy) iosInstallCopy.addEventListener('click', copyInstallLinkToClipboard);

  iosInstallSheet.addEventListener('click', (event) => {
    if (event.target === iosInstallSheet) closeIosInstallSheet();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !iosInstallSheet.classList.contains('hidden')) {
      closeIosInstallSheet();
    }
  });
}

function openIosInstallSheet() {
  if (!iosInstallSheet) return;
  updateIosInstallSheetCopy();
  iosInstallSheet.classList.remove('hidden');
  iosInstallSheet.setAttribute('aria-hidden', 'false');
  document.body.classList.add('install-sheet-open');
  if (iosInstallClose && typeof iosInstallClose.focus === 'function') iosInstallClose.focus({ preventScroll: true });
}

function closeIosInstallSheet() {
  if (!iosInstallSheet) return;
  iosInstallSheet.classList.add('hidden');
  iosInstallSheet.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('install-sheet-open');
}

function updateIosInstallSheetCopy() {
  if (!iosInstallSheet) return;
  const safari = isIosSafari();
  if (iosInstallIntro) {
    iosInstallIntro.textContent = I18N.t(safari ? 'ui.iosInstallIntroSafari' : 'ui.iosInstallIntroOther');
  }
  if (iosInstallSafariNote) {
    iosInstallSafariNote.textContent = I18N.t('ui.iosInstallSafariRequired');
    iosInstallSafariNote.classList.toggle('hidden', safari);
  }
}

async function copyInstallLinkToClipboard() {
  if (!iosInstallCopy) return;
  const originalText = I18N.t('ui.iosInstallCopy');
  try {
    await navigator.clipboard.writeText(window.location.href);
    iosInstallCopy.textContent = I18N.t('ui.iosInstallCopied');
  } catch (error) {
    iosInstallCopy.textContent = I18N.t('ui.iosInstallCopyFailed');
  }
  window.setTimeout(() => {
    iosInstallCopy.textContent = originalText;
  }, 1800);
}

async function handleUpdateClick() {
  if (!waitingServiceWorker && !forceUpdateReload) return;

  updateButton.disabled = true;
  updateButton.textContent = I18N.t('ui.updating');

  if (waitingServiceWorker) {
    waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    return;
  }

  await clearAppCaches();
  window.location.reload();
}

async function clearAppCaches() {
  if (!('caches' in window)) return;
  try {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith('eskyna-farben-')).map((key) => caches.delete(key)));
  } catch (error) {
    // Cache-Löschung ist nur ein Komfortschritt.
  }
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

function isIosDevice() {
  const userAgent = window.navigator.userAgent || '';
  const platform = window.navigator.platform || '';
  const maxTouchPoints = window.navigator.maxTouchPoints || 0;
  return /iPad|iPhone|iPod/.test(userAgent) || (platform === 'MacIntel' && maxTouchPoints > 1);
}

function isIosSafari() {
  const userAgent = window.navigator.userAgent || '';
  const isSafari = /Safari/.test(userAgent) && !/(CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo|YaBrowser)/.test(userAgent);
  return isIosDevice() && isSafari;
}

function formatPaletteName(name) {
  return I18N.formatPaletteName(name);
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

