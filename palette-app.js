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
const ESKYNA_APP_VERSION = "__ESKYNA_APP_VERSION__";
const UPDATE_CHECK_INTERVAL = 15 * 60 * 1000;
const MATCH_THRESHOLD = 18;
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
photoInput.addEventListener('change', handlePhoto);
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
  if (installButton) installButton.textContent = I18N.t('ui.installApp');
  if (updateButton) updateButton.textContent = I18N.t('ui.updateApp');
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
        'ui.resultColorTitle': '{color} erklären',
        'ui.resultSampleAria': 'Gemessene Farbe {color} erklären',
        'ui.resultMatchAria': 'Ähnlichsten Palettenton {color} erklären',
        'ui.resultEyebrow': 'Dein Farbcheck',
        'ui.yourColor': 'Deine Farbe',
        'ui.nearestPaletteColor': 'Ähnlichster Palettenton',
        'ui.fitMeter': 'Farbpassung: {label}',
        'ui.installApp': 'App installieren',
        'ui.updateApp': 'App aktualisieren',
        'ui.updating': 'Aktualisiere ...',
        'ui.pageTitle': 'ESKYNA Farbe - {palette}',
        'ui.pageTitleFor': 'ESKYNA Farbe für {name} - {palette}'
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
  const story = getColorStory(hex, index, activePalette);
  const isDark = readableTextColor(hex) === '#fff';
  const contextLabel = Number.isInteger(index) && index >= 0 ? formatPaletteName(activePalette.name) : I18N.t('ui.measuredColor');

  fullscreenColor = hex;
  fullscreenColorIndex = index;
  colorFullscreen.style.background = `radial-gradient(circle at 74% 18%, rgba(255,255,255,${isDark ? '.16' : '.42'}), transparent 20rem), ${hex}`;
  colorFullscreen.classList.toggle('is-dark', isDark);
  colorFullscreen.classList.toggle('is-light', !isDark);
  colorFullscreen.innerHTML = `
    <button class="color-fullscreen-close" type="button" aria-label="${escapeHtml(I18N.t('ui.fullscreenClose'))}">×</button>
    <article class="color-fullscreen-card" aria-label="${escapeHtml(I18N.t('ui.explanationTo', { color: story.name }))}">
      <div class="color-fullscreen-kicker">${escapeHtml(I18N.t('ui.colorKnowledge'))} · ${escapeHtml(contextLabel)}</div>
      <div class="color-fullscreen-head">
        <span class="color-fullscreen-dot" style="background:${hex}"></span>
        <div>
          <h2>${escapeHtml(story.name)}</h2>
          <p class="color-fullscreen-hex">${escapeHtml(story.tone)}</p>
        </div>
      </div>
      <div class="color-fullscreen-section">
        <span>${escapeHtml(I18N.t('ui.styleKnowledge'))}</span>
        <p>${escapeHtml(story.fact)}</p>
      </div>
      <div class="color-fullscreen-section">
        <span>${escapeHtml(I18N.t('ui.combine'))}</span>
        <p>${escapeHtml(story.combinations)}</p>
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
  const fit = getPaletteFit(match.delta);

  const sampledName = describeColor(sampled.hex).name;
  const matchName = describeColor(match.hex, match.index, activePalette).name;

  result.className = `result ${fit.className}`;
  result.innerHTML = `
    <button class="color-chip" type="button" style="background:${sampled.hex}" title="${escapeHtml(I18N.t('ui.resultColorTitle', { color: sampledName }))}" aria-label="${escapeHtml(I18N.t('ui.resultSampleAria', { color: sampledName }))}" data-fullscreen-color="${sampled.hex}" data-fullscreen-index="-1"></button>
    <div class="result-main">
      <div class="result-eyebrow">${escapeHtml(I18N.t('ui.resultEyebrow'))}</div>
      <div class="result-title">${escapeHtml(fit.title)}</div>
      <div class="result-meta">
        ${escapeHtml(I18N.t('ui.yourColor'))}: <strong>${escapeHtml(sampledName)}</strong><br>
        ${escapeHtml(I18N.t('ui.nearestPaletteColor'))}: <strong>${escapeHtml(matchName)}</strong>
      </div>
      <div class="fit-meter" aria-label="${escapeHtml(I18N.t('ui.fitMeter', { label: fit.label }))}">
        <span style="width:${fit.score}%"></span>
      </div>
      <div class="result-advice">${escapeHtml(fit.advice)}</div>
    </div>
    <button class="color-chip" type="button" style="background:${match.hex}" title="${escapeHtml(I18N.t('ui.resultColorTitle', { color: matchName }))}" aria-label="${escapeHtml(I18N.t('ui.resultMatchAria', { color: matchName }))}" data-fullscreen-color="${match.hex}" data-fullscreen-index="${match.index}"></button>
  `;
}

function getPaletteFit(delta) {
  let key;
  let className;
  let score;

  if (delta <= 6) {
    key = 'perfect';
    className = 'result-fit-perfect';
    score = 100;
  } else if (delta <= 12) {
    key = 'strong';
    className = 'result-fit-strong';
    score = 86;
  } else if (delta <= MATCH_THRESHOLD) {
    key = 'good';
    className = 'result-fit-good';
    score = 72;
  } else if (delta <= 30) {
    key = 'soft';
    className = 'result-fit-soft';
    score = 48;
  } else {
    key = 'away';
    className = 'result-fit-away';
    score = 22;
  }

  return { className, score, ...I18N.getFit(key) };
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

function isIosSafari() {
  const userAgent = window.navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(userAgent);
  const isWebKit = /WebKit/.test(userAgent);
  const isCriOS = /CriOS/.test(userAgent);
  return isIos && isWebKit && !isCriOS;
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

