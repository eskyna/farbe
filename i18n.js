(function () {
  const FALLBACK_LANGUAGE = 'de';
  const SUPPORTED_LANGUAGES = ['de', 'en', 'ru'];

  const TRANSLATIONS = {
    de: {
      ui: {
        brandWord: 'Farbe',
        customerFor: 'für {name}',
        brandAria: 'ESKYNA Farbe',
        brandAriaFor: 'ESKYNA Farbe für {name}',
        pageTitle: 'ESKYNA Farbe - {palette}',
        pageTitleFor: 'ESKYNA Farbe für {name} - {palette}',
        overviewTitle: 'ESKYNA Farbe',
        paletteSection: 'Farbkarte {palette}',
        overviewSelection: 'Farbkarten Auswahl',
        analysisSection: 'Kleidungsstück prüfen',
        actions: 'Aktionen',
        colorCheck: 'Farbe prüfen',
        styleQuestion: 'Stilfrage an Natalia',
        installApp: 'App installieren',
        updateApp: 'App aktualisieren',
        updating: 'Aktualisiere ...',
        openEskyna: 'ESKYNA Website öffnen',
        symbolAlt: 'ESKYNA Symbol',
        colorKnowledgeHint: 'Antippen für Farbwissen',
        explainColor: '{color} erklären',
        measuredColor: 'Gemessene Farbe',
        fullscreenAria: 'Vollbild-Farbansicht',
        fullscreenClose: 'Farbansicht schließen',
        explanationTo: 'Erklärung zu {color}',
        colorKnowledge: 'Farbwissen',
        styleKnowledge: 'Stilwissen',
        combine: 'Kombinieren',
        fullscreenFootnote: 'Tippe außerhalb der Karte, um zurück zur Farbkarte zu kommen.',
        resultColorTitle: '{color} erklären',
        resultSampleAria: 'Gemessene Farbe {color} erklären',
        resultMatchAria: 'Ähnlichsten Palettenton {color} erklären',
        resultEyebrow: 'Dein Farbcheck',
        yourColor: 'Deine Farbe',
        nearestPaletteColor: 'Ähnlichster Palettenton',
        fitMeter: 'Farbpassung: {label}'
      },
      paletteTerms: {
        light: 'Hell',
        cool: 'Kühl',
        clear: 'Klar',
        deep: 'Tief',
        warm: 'Warm',
        soft: 'Sanft'
      },
      fit: {
        perfect: {
          title: 'Volltreffer für deine Farbkarte',
          label: 'sehr nah am Palettenton',
          advice: 'Diese Farbe kannst du wie einen Originalton deiner Farbkarte einsetzen. Sie eignet sich auch gut für größere Flächen wie Bluse, Kleid, Jacke oder Strick.'
        },
        strong: {
          title: 'Sehr harmonisch',
          label: 'stimmig und leicht kombinierbar',
          advice: 'Die Farbe liegt sehr nah an deiner Palette. Sie wirkt besonders schön, wenn du sie mit ruhigen Basisfarben aus deiner Farbkarte kombinierst.'
        },
        good: {
          title: 'Passt gut zur Farbkarte',
          label: 'harmonisch, aber nicht ganz identisch',
          advice: 'Die Richtung stimmt. Für ein besonders stimmiges Outfit wiederhole den ähnlichsten Palettenton noch einmal in Schmuck, Schuhen, Tasche oder Make-up.'
        },
        soft: {
          title: 'Kann funktionieren - bewusst kombinieren',
          label: 'nah dran, aber mit kleiner Abweichung',
          advice: 'Die Farbe ist nicht ganz palette-rein. Trage sie lieber nicht direkt am Gesicht oder kombiniere sie mit starken Lieblingsfarben aus deiner Farbkarte.'
        },
        away: {
          title: 'Eher kein Idealton',
          label: 'deutlich außerhalb der Farbkarte',
          advice: 'Als kleines Detail kann die Farbe noch funktionieren. Für Oberteile, Schals oder Kleider ist ein Ton aus deiner Farbkarte meist schmeichelhafter.'
        }
      },
      scan: {
        scannerAria: 'Farbe live prüfen',
        hint: 'Kleidungsstück glatt in den Kreis halten.',
        close: 'Scanner schließen',
        capture: 'Jetzt Farbe prüfen',
        fileFallback: 'Bild auswählen',
        cameraFallback: 'Kamera nicht verfügbar. Du kannst ein Bild auswählen.',
        measuredShort: 'Gemessen',
        paletteShort: 'Palette',
        nearestThree: 'Drei nächste Farben aus deinem Farbpass',
        light: {
          aria: 'Lichtqualität',
          checking: 'Licht wird geprüft ...',
          good: 'Tageslicht gut',
          uncertain: 'Messung unsicher',
          tooDark: 'zu dunkel',
          dim: 'etwas dunkel',
          tooBright: 'zu hell',
          tooYellow: 'zu gelb',
          shadow: 'Schatten erkannt',
          unstable: 'Kreis nicht ruhig gefüllt'
        },
        verdict: {
          veryGood: 'Passt sehr gut – {score} %',
          good: 'Passt gut – {score} %',
          almost: 'Fast passend – {score} %',
          borderline: 'Grenzfall – {score} %',
          notIdeal: 'Eher nicht ideal – {score} %',
          unsure: 'Unsicher – bitte neu prüfen'
        },
        label: {
          veryGood: 'sehr hohe Harmonie',
          good: 'harmonisch',
          almost: 'fast passend',
          borderline: 'bewusst kombinieren',
          notIdeal: 'außerhalb der Idealrichtung',
          unsure: 'Bedingungen bitte verbessern'
        },
        dimension: {
          brightness: { ok: 'Helligkeit passt', tooLight: 'etwas zu hell', tooDark: 'etwas zu dunkel' },
          warmth: { ok: 'Wärme passt', tooWarm: 'etwas zu warm/gelb', tooCool: 'etwas zu kühl' },
          clarity: { ok: 'Klarheit passt', tooClear: 'etwas zu klar/kräftig', tooMuted: 'etwas zu gedämpft' }
        },
        advice: {
          veryGood: 'Helligkeit, Wärme und Klarheit wirken stimmig. Du kannst diesen Ton sehr gut nah am Gesicht oder als größere Fläche tragen.',
          good: 'Die Richtung ist schön. Kombiniere dazu einen ruhigen Basis- oder Akzentton aus deinem Farbpass, dann wirkt der Look bewusst.',
          tooMuted: 'Fast passend – aber etwas zu gedämpft. Nimm lieber eine klarere, frischere Variante.',
          tooClear: 'Fast passend – aber etwas sehr kräftig. Eine ruhigere oder weniger leuchtende Variante wirkt meist edler.',
          tooWarm: 'Fast passend – aber etwas zu warm. Suche nach einer weniger gelblichen Variante.',
          tooCool: 'Fast passend – aber etwas zu kühl. Eine minimal wärmere Variante verbindet sich weicher mit deiner Karte.',
          tooLight: 'Fast passend – aber etwas zu hell. Etwas mehr Tiefe gibt dem Outfit mehr Kontur.',
          tooDark: 'Fast passend – aber etwas zu dunkel. Eine hellere Variante wirkt näher an deiner Farbkarte.',
          checkAgain: 'Die Richtung kann stimmen, aber prüfe bei neutralem Tageslicht noch einmal, bevor du kaufst.',
          neutral: 'Nutze den Ton eher als Detail und wiederhole einen sicheren Farbpass-Ton in Schmuck, Schuhen, Tasche oder Make-up.',
          retry: 'Ich bin bei diesem Foto nicht sicher. Prüfe lieber noch einmal bei neutralem Tageslicht, ohne starken Schatten und ohne warmes Kunstlicht.'
        },
        confidence: {
          good: 'Einschätzung aus {points} Messpunkten im Kreis. Kamera und Stoffstruktur können kleine Abweichungen erzeugen.',
          warning: 'Die Empfehlung ist vorläufig, weil Licht oder Schatten die Kamera beeinflussen können. Bitte bei neutralem Tageslicht erneut prüfen.'
        }
      },
      paletteNotes: {
        warm: 'In einer warmen Palette wirken Creme, Gold, Camel, Cognac und warme Naturtöne besonders verbindend.',
        cool: 'In einer kühlen Palette verbinden Weiß, Silber, Taupe, Navy und kühle Rosé- oder Beerentöne den Look besonders sauber.',
        neutral: 'Wähle dazu einen hellen und einen dunklen Ton aus deiner Farbkarte, damit der Look bewusst und nicht zufällig wirkt.',
        light: 'Bei Light-Paletten bleiben große Flächen am schönsten hell; dunkle Töne lieber als Kontur einsetzen.',
        deep: 'Bei Deep-Paletten darf der Kontrast spürbar sein; helle Töne funktionieren besonders gut als Lichtakzent.',
        clear: 'Clear-Paletten vertragen klare Kanten, glatte Stoffe und bewusst gesetzte Kontraste.',
        soft: 'Soft-Paletten wirken besonders edel mit Ton-in-Ton, matteren Stoffen und sanften Übergängen.'
      },
      colorStories: {
        whiteClear: { name: 'Klares Weiß', tone: 'hell, leicht und sehr neutral', fact: 'Weiß bringt optische Ruhe in eine Palette und macht kräftige Farben sofort moderner. In der Mode wirkt Weiß besonders hochwertig, wenn Stoffstruktur sichtbar bleibt - etwa bei Baumwolle, Seide oder Leinen.', combinations: 'Kombiniere es als Frischefläche zu fast jedem Ton der Palette. Besonders edel wirkt es mit Camel, Gold, Marine, Espresso oder einem einzigen kräftigen Akzent.' },
        whiteCream: { name: 'Cremeweiß', tone: 'hell, leicht und sehr neutral', fact: 'Cremeweiß wirkt weicher als reines Weiß und lässt helle Looks freundlicher erscheinen. In feinen Stoffen wirkt es besonders luxuriös, weil es Licht sanft reflektiert.', combinations: 'Nutze Cremeweiß als warme Frischefläche zu Beige, Camel, Gold, Braun, Koralle oder einem klaren Akzent aus deiner Palette.' },
        graphite: { name: 'Graphit', tone: 'dunkel, ruhig und klar', fact: 'Graphit ist die weichere Alternative zu reinem Schwarz. Es wirkt elegant, ohne helle oder zarte Farben so stark zu überdecken wie Tiefschwarz.', combinations: 'Trage Graphit als Rahmenfarbe zu hellen Tönen, Rosé, Creme oder kühlem Blau. Für mehr Leichtigkeit reicht oft ein heller Schuh oder Schmuck in Gold beziehungsweise Silber.' },
        taupeGrey: { name: 'Taupegrau', tone: 'gedämpft, neutral und vielseitig', fact: 'Taupe lebt zwischen Grau und Braun und ist deshalb ein sehr erwachsener Neutralton. In Outfits verbindet es farbige Teile, ohne selbst laut zu werden.', combinations: 'Sehr schön zu Creme, Altrosa, Salbei, Denim oder Burgunder. Ton-in-Ton mit Sand und Braun wirkt es besonders ruhig und luxuriös.' },
        greige: { name: 'Greige', tone: 'hell, sanft und neutral', fact: 'Greige ist ein Mischton aus Grau und Beige und wirkt dadurch weniger hart als reines Grau. Er ist ideal, wenn ein Look hochwertig, aber nicht streng aussehen soll.', combinations: 'Nutze Greige als Basis zu Pastell, Camel, Weiß oder gedämpften Beerentönen. Mit klaren Farben sorgt es für Balance.' },
        espresso: { name: 'Espresso', tone: 'tief, warm und elegant', fact: 'Espresso ist ein luxuriöser Dunkelton und wirkt oft weicher als Schwarz. In Leder, Strick oder Wolle bekommt er besonders viel Tiefe.', combinations: 'Kombiniere Espresso mit Creme, Karamell, Gold, Koralle oder Petrol. Als Accessoirefarbe macht er helle Outfits sofort angezogener.' },
        chocolateBrown: { name: 'Schokobraun', tone: 'warm, geerdet und hochwertig', fact: 'Brauntöne gehören zu den wichtigsten Neutralfarben der Mode, weil sie natürliche Materialien wie Leder, Wildleder und Wolle besonders edel wirken lassen.', combinations: 'Sehr gut zu Creme, Gold, Oliv, Denim, Terrakotta oder Petrol. Mit Weiß wirkt Braun frisch, mit Beige besonders weich.' },
        cognacBrown: { name: 'Cognacbraun', tone: 'warm, geerdet und hochwertig', fact: 'Cognac bringt mehr Lebendigkeit als dunkles Braun und erinnert sofort an hochwertige Lederwaren. Deshalb wirkt der Ton als Tasche, Gürtel oder Schuh besonders stilvoll.', combinations: 'Sehr gut zu Creme, Gold, Oliv, Denim, Terrakotta oder Petrol. Mit Weiß wirkt Cognac frisch, mit Beige besonders weich.' },
        camel: { name: 'Camel', tone: 'warm, weich und klassisch', fact: 'Camel ist ein Outerwear-Klassiker und macht selbst einfache Outfits angezogen. Der Ton wirkt luxuriös, weil er an Kaschmir, Mantelstoffe und feine Lederwaren erinnert.', combinations: 'Kombiniere Camel mit Creme, Espresso, Gold, Rot, Oliv oder Denim. Monochrom mit Sand und Beige entsteht ein sehr eleganter Look.' },
        sandBeige: { name: 'Sandbeige', tone: 'hell, warm und zurückhaltend', fact: 'Sandbeige ist ein leiser Neutralton und lässt Schnitte, Stoffe und Schmuck stärker wirken. Es ist ideal, wenn Farbe nur eine elegante Bühne sein soll.', combinations: 'Trage Sandbeige zu Weiß, Camel, Koralle, warmem Grün oder Braun. Für mehr Kontur helfen dunkle Schuhe, Gürtel oder Tasche.' },
        burgundy: { name: 'Burgunderrot', tone: 'tief, sinnlich und edel', fact: 'Burgunderrot wird in Abendmode und Tailoring gern als weichere Alternative zu Schwarz eingesetzt. Es bringt Tiefe, ohne kühl oder hart zu wirken.', combinations: 'Besonders schön zu Creme, Espresso, Camel, Rosé oder Navy. Als Lippenstift-, Schuh- oder Taschenfarbe setzt Burgunder einen eleganten Akzent.' },
        cherryRed: { name: 'Kirschrot', tone: 'klar, lebendig und aufmerksamkeitsstark', fact: 'Rot ist eine der stärksten Signalfarben in der Mode: Schon kleine Flächen lenken den Blick. Es funktioniert deshalb sehr gut für Schuhe, Lippen, Nägel, Taschen oder ein Statement-Teil.', combinations: 'Kombiniere Rot mit Creme, Weiß, Denim, Camel oder Braun. Für einen modernen Look reicht oft ein rotes Detail zu ruhigen Basics.' },
        tomatoRed: { name: 'Tomatenrot', tone: 'klar, lebendig und aufmerksamkeitsstark', fact: 'Tomatenrot hat eine warme, freundliche Energie und wirkt zugänglicher als kühles Signalrot. In schlichten Schnitten wird es sofort zum modernen Statement.', combinations: 'Kombiniere Tomatenrot mit Creme, Weiß, Denim, Camel oder Braun. Für einen modernen Look reicht oft ein rotes Detail zu ruhigen Basics.' },
        coral: { name: 'Koralle', tone: 'warm, lebendig und sonnengeküsst', fact: 'Koralle bringt Wärme ins Gesicht und wirkt weniger streng als klassisches Rot. In der Mode funktioniert sie besonders gut in fließenden Stoffen, Strick und sommerlichen Accessoires.', combinations: 'Kombiniere Koralle mit Creme, Sand, Gold, warmem Braun oder Oliv. Als Akzent belebt sie neutrale Looks sofort.' },
        terracotta: { name: 'Terrakotta', tone: 'warm, lebendig und sonnengeküsst', fact: 'Terrakotta erinnert an Erde, Keramik und südliche Architektur. Dadurch wirkt der Ton natürlich, modisch und zugleich erwachsen.', combinations: 'Kombiniere Terrakotta mit Creme, Sand, Gold, warmem Braun oder Oliv. Als Akzent belebt er neutrale Looks sofort.' },
        apricot: { name: 'Apricot', tone: 'warm, weich und freundlich', fact: 'Apricot ist die sanfte Seite von Orange. Es wirkt in der Mode hochwertig, wenn es nicht zu neonhaft ist und mit klaren Schnitten getragen wird.', combinations: 'Sehr harmonisch zu Creme, Camel, Cognac, Oliv und warmem Denim. Mit einem dunklen Neutralton bekommt Apricot mehr Eleganz.' },
        rustOrange: { name: 'Rostorange', tone: 'warm, weich und freundlich', fact: 'Rostorange ist ein gebrochener Orangeton und deshalb tragbarer als leuchtendes Orange. In Strick, Cord, Leder und Wolle wirkt er besonders stilvoll.', combinations: 'Sehr harmonisch zu Creme, Camel, Cognac, Oliv und warmem Denim. Mit einem dunklen Neutralton bekommt Rostorange mehr Eleganz.' },
        vanillaYellow: { name: 'Vanillegelb', tone: 'hell, warm und freundlich', fact: 'Helles Gelb bringt Licht in ein Outfit und wirkt weicher als kräftiges Sonnengelb. In Blusen, Strick oder Tüchern ist es ein eleganter Frischegeber.', combinations: 'Kombiniere Vanillegelb mit Creme, Sand, Camel, hellem Denim oder warmem Grau. Kleine Goldakzente greifen die Wärme schön auf.' },
        goldenYellow: { name: 'Goldgelb', tone: 'strahlend, optimistisch und auffällig', fact: 'Gelb zieht den Blick stark an und wirkt in der Mode besonders modern, wenn es bewusst dosiert wird. Als Tasche, Schuh, Tuch oder Top gibt es neutralen Looks sofort Energie.', combinations: 'Sehr gut zu Weiß, Creme, Denim, Navy, Oliv oder Braun. Wenn der Ton sehr klar ist, sollten die Begleiter eher schlicht bleiben.' },
        lemonYellow: { name: 'Zitronengelb', tone: 'strahlend, optimistisch und auffällig', fact: 'Zitronengelb wirkt frisch, klar und grafisch. In der Mode wird es oft als kleiner Lichtakzent genutzt, weil es selbst in kleinen Mengen präsent ist.', combinations: 'Sehr gut zu Weiß, Creme, Denim, Navy, Oliv oder Braun. Wenn der Ton sehr klar ist, sollten die Begleiter eher schlicht bleiben.' },
        oliveGreen: { name: 'Olivgrün', tone: 'natürlich, warm und stilvoll', fact: 'Oliv ist eine Mode-Neutralfarbe: Es ist farbig, wirkt aber fast so vielseitig wie Braun oder Grau. Der Ton bringt Natürlichkeit, ohne sportlich wirken zu müssen.', combinations: 'Kombiniere Oliv mit Creme, Braun, Camel, Gold, Koralle oder Denim. Für mehr Eleganz funktionieren klare Schnitte und ruhige Accessoires.' },
        limeGreen: { name: 'Lindgrün', tone: 'natürlich, warm und stilvoll', fact: 'Lindgrün bringt die frische, helle Seite der Grüntöne in den Look. Es wirkt besonders schön, wenn die Kombination ruhig und nicht zu bunt bleibt.', combinations: 'Kombiniere Lindgrün mit Creme, Braun, Camel, Gold, Koralle oder Denim. Für mehr Eleganz funktionieren klare Schnitte und ruhige Accessoires.' },
        forestGreen: { name: 'Tannengrün', tone: 'tief, ruhig und luxuriös', fact: 'Tannengrün ist ein klassischer Edelton und wirkt besonders stark in Samt, Wolle, Seide oder Leder. Es gibt dunklen Looks Tiefe, ohne so hart zu sein wie Schwarz.', combinations: 'Sehr schön zu Creme, Gold, Cognac, Rosé, Burgunder oder Navy. Mit hellen Neutralfarben wirkt Tannengrün sofort frischer.' },
        sageGreen: { name: 'Salbeigrün', tone: 'sanft, natürlich und modern', fact: 'Salbeigrün wirkt wie ein ruhiger Neutralton mit Naturbezug. Es ist ideal, wenn ein Outfit farbig, aber nicht laut sein soll.', combinations: 'Kombiniere Salbei mit Creme, Greige, Taupe, Rosé oder Denim. Ton-in-Ton mit Beige wirkt es sehr weich.' },
        emeraldGreen: { name: 'Smaragdgrün', tone: 'klar, kostbar und präsent', fact: 'Smaragdgrün wird oft als Schmucksteinfarbe gelesen und wirkt dadurch sofort hochwertig. Es ist ein guter Statement-Ton, weil er intensiv ist, aber weniger aggressiv als Rot.', combinations: 'Kombiniere Smaragd mit Creme, Schwarzbraun, Gold, Navy oder einem kleinen Pink-Akzent. Große Flächen brauchen ruhige Begleiter.' },
        petrol: { name: 'Petrol', tone: 'frisch, elegant und farbig ohne laut zu sein', fact: 'Petrol liegt zwischen Blau und Grün. Genau diese Mischung macht den Ton spannend: Er wirkt frisch, aber erwachsener als viele reine Blautöne.', combinations: 'Kombiniere Petrol mit Creme, Braun, Gold, Rost, Koralle oder Navy. Als dunkler Farbakzent ist Petrol sehr elegant.' },
        turquoise: { name: 'Türkis', tone: 'frisch, elegant und farbig ohne laut zu sein', fact: 'Türkis liegt zwischen Blau und Grün und bringt sofort Frische in einen Look. Es wirkt besonders sommerlich, wenn es mit hellen Naturtönen kombiniert wird.', combinations: 'Türkis wirkt sehr klar mit Weiß und sommerlich mit Sand. Für mehr Eleganz funktionieren Navy, Gold oder ein ruhiger Braunton.' },
        nightBlue: { name: 'Nachtblau', tone: 'tief, seriös und elegant', fact: 'Nachtblau ist ein Business- und Abendklassiker. Es bietet die Tiefe von Schwarz, wirkt aber oft weicher und lässt sich sehr gut mit Schmuckfarben kombinieren.', combinations: 'Sehr schön zu Weiß, Creme, Silber, Gold, Burgunder, Hellblau oder Camel. Für klare Looks kombiniere es mit einem einzigen hellen Kontrast.' },
        cobaltBlue: { name: 'Kobaltblau', tone: 'klar, kühl und ausdrucksstark', fact: 'Kobaltblau wirkt grafisch und modern, besonders wenn der Schnitt schlicht ist. Es ist ideal, um Basics sofort frischer und bewusster wirken zu lassen.', combinations: 'Kombiniere Kobalt mit Weiß, Navy, Silber, Denim, Pink oder einem kleinen Gelbakzent. Bei sehr klaren Blautönen darf der Rest reduziert bleiben.' },
        aubergine: { name: 'Aubergine', tone: 'kreativ, weich und geheimnisvoll', fact: 'Aubergine wirkt weniger erwartbar als Rot oder Blau. Der Ton gibt einem Outfit Individualität, ohne zwingend laut zu sein.', combinations: 'Kombiniere Aubergine mit Creme, Taupe, Grau, Gold, Rosé oder Tannengrün. Besonders elegant ist Aubergine zu Espresso und weichen Wollstoffen.' },
        violet: { name: 'Violett', tone: 'kreativ, weich und geheimnisvoll', fact: 'Violetttöne wirken weniger erwartbar als Rot oder Blau. In der Mode geben sie einem Outfit Individualität, ohne zwingend laut zu sein.', combinations: 'Kombiniere Violett mit Creme, Taupe, Grau, Gold, Rosé oder Tannengrün. Mit weichen Materialien wirkt es besonders edel.' },
        berry: { name: 'Beerenton', tone: 'tief, feminin und elegant', fact: 'Beerentöne verbinden die Energie von Rot mit der Weichheit von Violett. Deshalb wirken sie auffällig, aber meist edler und ruhiger als reines Pink.', combinations: 'Kombiniere Beere mit Creme, Taupe, Anthrazit, Navy, Rosé oder Gold. Als Akzent ist Beere ideal zu neutralen Outfits.' },
        powderPink: { name: 'Puderrosa', tone: 'frisch, weich und feminin', fact: 'Rosé kann ein Outfit sofort leichter wirken lassen. Besonders erwachsen wirkt es, wenn Schnitt und Material klar bleiben - etwa bei Blazer, Bluse, Strick oder Seide.', combinations: 'Kombiniere Rosé mit Creme, Taupe, Camel, Denim oder Braun. Für mehr Modernität hilft ein klarer Schnitt.' },
        rosePink: { name: 'Rosenpink', tone: 'frisch, weich und feminin', fact: 'Pink bringt Energie und Frische in ein Outfit. Erwachsen wirkt es, wenn der Look reduziert bleibt und das Material hochwertig ist.', combinations: 'Kräftigeres Pink wirkt modern zu Weiß, Navy oder einem klaren Grünakzent. Als Accessoire macht es neutrale Outfits sofort lebendiger.' },
        generic: { name: 'Farbton', tone: 'individuell und ausdrucksstark', fact: 'Jeder Farbton verändert seine Wirkung durch Material, Licht und Kombination. Matte Stoffe wirken ruhiger, glänzende Stoffe stärker und festlicher.', combinations: 'Kombiniere diesen Ton mit einem hellen Neutral, einem dunklen Neutral und maximal einem weiteren Akzent aus der Palette.' }
      }
    },
    en: {
      ui: {
        brandWord: 'Color',
        customerFor: 'for {name}',
        brandAria: 'ESKYNA Color',
        brandAriaFor: 'ESKYNA Color for {name}',
        pageTitle: 'ESKYNA Color - {palette}',
        pageTitleFor: 'ESKYNA Color for {name} - {palette}',
        overviewTitle: 'ESKYNA Color',
        paletteSection: 'Color card {palette}',
        overviewSelection: 'Color card selection',
        analysisSection: 'Check garment color',
        actions: 'Actions',
        colorCheck: 'Check color',
        styleQuestion: 'Style question for Natalia',
        installApp: 'Install app',
        updateApp: 'Update app',
        updating: 'Updating ...',
        openEskyna: 'Open ESKYNA website',
        symbolAlt: 'ESKYNA symbol',
        colorKnowledgeHint: 'Tap for color knowledge',
        explainColor: 'Explain {color}',
        measuredColor: 'Measured color',
        fullscreenAria: 'Full-screen color view',
        fullscreenClose: 'Close color view',
        explanationTo: 'Explanation for {color}',
        colorKnowledge: 'Color knowledge',
        styleKnowledge: 'Style knowledge',
        combine: 'How to combine',
        fullscreenFootnote: 'Tap outside the card to return to the color card.',
        resultColorTitle: 'Explain {color}',
        resultSampleAria: 'Explain measured color {color}',
        resultMatchAria: 'Explain closest palette tone {color}',
        resultEyebrow: 'Your color check',
        yourColor: 'Your color',
        nearestPaletteColor: 'Closest palette tone',
        fitMeter: 'Color harmony: {label}'
      },
      paletteTerms: {
        light: 'Light',
        cool: 'Cool',
        clear: 'Clear',
        deep: 'Deep',
        warm: 'Warm',
        soft: 'Soft'
      },
      fit: {
        perfect: { title: 'Perfect match for your color card', label: 'very close to the palette tone', advice: 'You can wear this color like an original tone from your color card. It also works well for larger areas such as blouses, dresses, jackets or knitwear.' },
        strong: { title: 'Very harmonious', label: 'balanced and easy to combine', advice: 'This color is very close to your palette. It looks especially beautiful when combined with calm base colors from your color card.' },
        good: { title: 'Works well with the color card', label: 'harmonious, but not identical', advice: 'The direction is right. For a very polished outfit, repeat the closest palette tone once more in jewelry, shoes, a bag or make-up.' },
        soft: { title: 'Can work - combine deliberately', label: 'close, but with a small shift', advice: 'This color is not completely palette-pure. Avoid wearing it directly next to the face or combine it with strong favorite colors from your color card.' },
        away: { title: 'Probably not an ideal tone', label: 'clearly outside the color card', advice: 'As a small detail, the color can still work. For tops, scarves or dresses, a tone from your color card will usually be more flattering.' }
      },
      scan: {
        scannerAria: 'Live color check',
        hint: 'Hold the garment flat inside the circle.',
        close: 'Close scanner',
        capture: 'Check color now',
        fileFallback: 'Choose image',
        cameraFallback: 'Camera is not available. You can choose an image instead.',
        measuredShort: 'Measured',
        paletteShort: 'Palette',
        nearestThree: 'Three closest colors from your color card',
        light: {
          aria: 'Light quality',
          checking: 'Checking light ...',
          good: 'Daylight good',
          uncertain: 'Measurement uncertain',
          tooDark: 'too dark',
          dim: 'a little dim',
          tooBright: 'too bright',
          tooYellow: 'too yellow',
          shadow: 'shadow detected',
          unstable: 'circle not filled calmly'
        },
        verdict: {
          veryGood: 'Fits very well – {score} %',
          good: 'Fits well – {score} %',
          almost: 'Almost right – {score} %',
          borderline: 'Borderline – {score} %',
          notIdeal: 'Probably not ideal – {score} %',
          unsure: 'Uncertain – please scan again'
        },
        label: {
          veryGood: 'very high harmony',
          good: 'harmonious',
          almost: 'almost right',
          borderline: 'combine deliberately',
          notIdeal: 'outside the ideal direction',
          unsure: 'improve the conditions'
        },
        dimension: {
          brightness: { ok: 'Brightness fits', tooLight: 'a little too light', tooDark: 'a little too dark' },
          warmth: { ok: 'Warmth fits', tooWarm: 'a little too warm/yellow', tooCool: 'a little too cool' },
          clarity: { ok: 'Clarity fits', tooClear: 'a little too clear/strong', tooMuted: 'a little too muted' }
        },
        advice: {
          veryGood: 'Brightness, warmth and clarity look coherent. You can wear this tone close to the face or in a larger area.',
          good: 'The direction is beautiful. Add a calm base tone or accent from your color card so the outfit looks intentional.',
          tooMuted: 'Almost right, but a little too muted. Choose a clearer, fresher version.',
          tooClear: 'Almost right, but quite intense. A calmer or less bright version will usually look more refined.',
          tooWarm: 'Almost right, but a little too warm. Look for a less yellow version.',
          tooCool: 'Almost right, but a little too cool. A slightly warmer version will connect more softly with your card.',
          tooLight: 'Almost right, but a little too light. Slightly more depth will give the outfit more contour.',
          tooDark: 'Almost right, but a little too dark. A lighter version will sit closer to your color card.',
          checkAgain: 'The direction may be right, but check again in neutral daylight before buying.',
          neutral: 'Use this tone more as a detail and repeat a safe color-card tone in jewelry, shoes, bag or make-up.',
          retry: 'I am not confident with this photo. Please scan again in neutral daylight, without strong shadow or warm artificial light.'
        },
        confidence: {
          good: 'Estimate based on {points} measuring points inside the circle. Camera and fabric texture can create small shifts.',
          warning: 'This recommendation is provisional because light or shadow may influence the camera. Please check again in neutral daylight.'
        }
      },
      paletteNotes: {
        warm: 'In a warm palette, cream, gold, camel, cognac and warm natural shades pull the look together especially well.',
        cool: 'In a cool palette, white, silver, taupe, navy and cool rose or berry shades make combinations look especially clean.',
        neutral: 'Choose one light and one dark tone from your color card so the outfit looks intentional rather than random.',
        light: 'With Light palettes, larger areas usually look best in lighter tones; use dark shades more as contour.',
        deep: 'With Deep palettes, contrast can be noticeable; light tones work especially well as highlights.',
        clear: 'Clear palettes can handle crisp lines, smooth fabrics and deliberately placed contrasts.',
        soft: 'Soft palettes look especially refined with tone-on-tone styling, matte fabrics and gentle transitions.'
      },
      colorStories: {
        whiteClear: { name: 'Clear White', tone: 'light, fresh and very neutral', fact: 'White brings visual calm to a palette and makes strong colors look instantly more modern. In fashion, white appears especially refined when the fabric texture is visible, such as cotton, silk or linen.', combinations: 'Use it as a fresh surface with almost any palette tone. It looks especially elegant with camel, gold, navy, espresso or one strong accent.' },
        whiteCream: { name: 'Cream White', tone: 'light, soft and very neutral', fact: 'Cream white is gentler than pure white and makes light outfits feel warmer. In fine fabrics it looks luxurious because it reflects light softly.', combinations: 'Use cream white as a warm fresh base with beige, camel, gold, brown, coral or a clear accent from your palette.' },
        graphite: { name: 'Graphite', tone: 'dark, calm and clean', fact: 'Graphite is the softer alternative to pure black. It looks elegant without overpowering light or delicate colors as much as deep black can.', combinations: 'Wear graphite as a framing color with light tones, rose, cream or cool blue. A light shoe or jewelry in gold or silver often adds enough lift.' },
        taupeGrey: { name: 'Taupe Grey', tone: 'muted, neutral and versatile', fact: 'Taupe lives between grey and brown, which makes it a grown-up neutral. In outfits it connects colorful pieces without becoming loud itself.', combinations: 'Beautiful with cream, dusty rose, sage, denim or burgundy. Tone-on-tone with sand and brown feels especially calm and luxurious.' },
        greige: { name: 'Greige', tone: 'light, soft and neutral', fact: 'Greige mixes grey and beige, so it feels less strict than pure grey. It is ideal when a look should feel polished but not severe.', combinations: 'Use greige as a base with pastels, camel, white or muted berry tones. With clear colors, it creates balance.' },
        espresso: { name: 'Espresso', tone: 'deep, warm and elegant', fact: 'Espresso is a luxurious dark shade and often looks softer than black. In leather, knitwear or wool it gains beautiful depth.', combinations: 'Combine espresso with cream, caramel, gold, coral or petrol. As an accessory color, it instantly makes light outfits look more dressed.' },
        chocolateBrown: { name: 'Chocolate Brown', tone: 'warm, grounded and refined', fact: 'Brown shades are among fashion’s most important neutrals because they make natural materials such as leather, suede and wool look especially elegant.', combinations: 'Works very well with cream, gold, olive, denim, terracotta or petrol. Brown looks fresh with white and especially soft with beige.' },
        cognacBrown: { name: 'Cognac Brown', tone: 'warm, grounded and refined', fact: 'Cognac feels livelier than dark brown and immediately suggests quality leather goods. That makes it especially stylish for bags, belts and shoes.', combinations: 'Works very well with cream, gold, olive, denim, terracotta or petrol. Cognac looks fresh with white and especially soft with beige.' },
        camel: { name: 'Camel', tone: 'warm, soft and classic', fact: 'Camel is an outerwear classic and makes even simple outfits look dressed. The shade feels luxurious because it recalls cashmere, coat fabrics and fine leather goods.', combinations: 'Combine camel with cream, espresso, gold, red, olive or denim. Monochrome styling with sand and beige creates a very elegant look.' },
        sandBeige: { name: 'Sand Beige', tone: 'light, warm and understated', fact: 'Sand beige is a quiet neutral that lets cuts, fabrics and jewelry stand out. It is ideal when color should act as an elegant stage.', combinations: 'Wear sand beige with white, camel, coral, warm green or brown. Dark shoes, a belt or a bag add more contour.' },
        burgundy: { name: 'Burgundy', tone: 'deep, sensual and refined', fact: 'Burgundy is often used in eveningwear and tailoring as a softer alternative to black. It adds depth without looking cold or harsh.', combinations: 'Especially beautiful with cream, espresso, camel, rose or navy. As a lipstick, shoe or bag color, burgundy creates an elegant accent.' },
        cherryRed: { name: 'Cherry Red', tone: 'clear, vivid and attention-grabbing', fact: 'Red is one of fashion’s strongest signal colors: even small areas draw the eye. That makes it excellent for shoes, lips, nails, bags or one statement piece.', combinations: 'Combine red with cream, white, denim, camel or brown. For a modern look, one red detail with calm basics is often enough.' },
        tomatoRed: { name: 'Tomato Red', tone: 'clear, vivid and attention-grabbing', fact: 'Tomato red has a warm, friendly energy and feels more approachable than cool signal red. In simple cuts, it becomes a modern statement immediately.', combinations: 'Combine tomato red with cream, white, denim, camel or brown. For a modern look, one red detail with calm basics is often enough.' },
        coral: { name: 'Coral', tone: 'warm, lively and sun-kissed', fact: 'Coral brings warmth to the face and feels less strict than classic red. In fashion it works especially well in fluid fabrics, knitwear and summer accessories.', combinations: 'Combine coral with cream, sand, gold, warm brown or olive. As an accent, it immediately lifts neutral looks.' },
        terracotta: { name: 'Terracotta', tone: 'warm, lively and sun-kissed', fact: 'Terracotta recalls earth, ceramics and southern architecture. It therefore feels natural, fashionable and grown-up at the same time.', combinations: 'Combine terracotta with cream, sand, gold, warm brown or olive. As an accent, it immediately lifts neutral looks.' },
        apricot: { name: 'Apricot', tone: 'warm, soft and friendly', fact: 'Apricot is the gentle side of orange. It looks refined in fashion when it is not too neon and is worn with clean cuts.', combinations: 'Very harmonious with cream, camel, cognac, olive and warm denim. A dark neutral gives apricot more elegance.' },
        rustOrange: { name: 'Rust Orange', tone: 'warm, soft and friendly', fact: 'Rust orange is a muted orange shade, so it is more wearable than bright orange. It looks especially stylish in knitwear, corduroy, leather and wool.', combinations: 'Very harmonious with cream, camel, cognac, olive and warm denim. A dark neutral gives rust orange more elegance.' },
        vanillaYellow: { name: 'Vanilla Yellow', tone: 'light, warm and friendly', fact: 'Light yellow brings light into an outfit and feels softer than strong sunshine yellow. In blouses, knitwear or scarves it is an elegant freshness booster.', combinations: 'Combine vanilla yellow with cream, sand, camel, light denim or warm grey. Small gold accents pick up the warmth beautifully.' },
        goldenYellow: { name: 'Golden Yellow', tone: 'radiant, optimistic and noticeable', fact: 'Yellow strongly draws the eye and looks especially modern when used deliberately. As a bag, shoe, scarf or top, it gives neutral looks instant energy.', combinations: 'Works very well with white, cream, denim, navy, olive or brown. If the yellow is very clear, the other pieces should stay simple.' },
        lemonYellow: { name: 'Lemon Yellow', tone: 'radiant, optimistic and noticeable', fact: 'Lemon yellow feels fresh, clear and graphic. In fashion it is often used as a small light accent because it is present even in small amounts.', combinations: 'Works very well with white, cream, denim, navy, olive or brown. If the yellow is very clear, the other pieces should stay simple.' },
        oliveGreen: { name: 'Olive Green', tone: 'natural, warm and stylish', fact: 'Olive is a fashion neutral: it has color, but is almost as versatile as brown or grey. It brings a natural feeling without needing to look sporty.', combinations: 'Combine olive with cream, brown, camel, gold, coral or denim. Clean cuts and calm accessories make it more elegant.' },
        limeGreen: { name: 'Linden Green', tone: 'natural, warm and stylish', fact: 'Linden green brings the fresh, lighter side of green into a look. It is especially beautiful when the combination stays calm and not too colorful.', combinations: 'Combine linden green with cream, brown, camel, gold, coral or denim. Clean cuts and calm accessories make it more elegant.' },
        forestGreen: { name: 'Pine Green', tone: 'deep, calm and luxurious', fact: 'Pine green is a classic rich shade and looks especially strong in velvet, wool, silk or leather. It gives dark looks depth without being as hard as black.', combinations: 'Beautiful with cream, gold, cognac, rose, burgundy or navy. With light neutrals, pine green looks instantly fresher.' },
        sageGreen: { name: 'Sage Green', tone: 'soft, natural and modern', fact: 'Sage green behaves like a calm neutral with a natural reference. It is ideal when an outfit should be colorful but not loud.', combinations: 'Combine sage with cream, greige, taupe, rose or denim. Tone-on-tone with beige feels very soft.' },
        emeraldGreen: { name: 'Emerald Green', tone: 'clear, precious and present', fact: 'Emerald green is often read as a gemstone color, which makes it feel instantly refined. It is a strong statement tone because it is intense but less aggressive than red.', combinations: 'Combine emerald with cream, black-brown, gold, navy or a small pink accent. Large areas need calm companions.' },
        petrol: { name: 'Petrol', tone: 'fresh, elegant and colorful without being loud', fact: 'Petrol sits between blue and green. That mix makes it interesting: it feels fresh, but more grown-up than many pure blues.', combinations: 'Combine petrol with cream, brown, gold, rust, coral or navy. As a dark color accent, petrol is very elegant.' },
        turquoise: { name: 'Turquoise', tone: 'fresh, elegant and colorful without being loud', fact: 'Turquoise sits between blue and green and instantly adds freshness to a look. It feels especially summery when combined with light natural tones.', combinations: 'Turquoise looks very clear with white and summery with sand. Navy, gold or a calm brown add more elegance.' },
        nightBlue: { name: 'Midnight Blue', tone: 'deep, polished and elegant', fact: 'Midnight blue is a business and eveningwear classic. It offers the depth of black, but often looks softer and combines beautifully with jewelry tones.', combinations: 'Beautiful with white, cream, silver, gold, burgundy, light blue or camel. For clean looks, combine it with one bright contrast.' },
        cobaltBlue: { name: 'Cobalt Blue', tone: 'clear, cool and expressive', fact: 'Cobalt blue looks graphic and modern, especially when the cut is simple. It is ideal for making basics look fresher and more intentional.', combinations: 'Combine cobalt with white, navy, silver, denim, pink or a small yellow accent. With very clear blues, the rest can stay reduced.' },
        aubergine: { name: 'Aubergine', tone: 'creative, soft and mysterious', fact: 'Aubergine feels less expected than red or blue. It gives an outfit individuality without necessarily being loud.', combinations: 'Combine aubergine with cream, taupe, grey, gold, rose or pine green. It is especially elegant with espresso and soft wool fabrics.' },
        violet: { name: 'Violet', tone: 'creative, soft and mysterious', fact: 'Violet shades feel less expected than red or blue. In fashion they give an outfit individuality without necessarily being loud.', combinations: 'Combine violet with cream, taupe, grey, gold, rose or pine green. With soft materials it looks especially refined.' },
        berry: { name: 'Berry Tone', tone: 'deep, feminine and elegant', fact: 'Berry shades combine the energy of red with the softness of violet. That makes them noticeable, but usually more refined and calmer than pure pink.', combinations: 'Combine berry with cream, taupe, charcoal, navy, rose or gold. As an accent, berry is ideal with neutral outfits.' },
        powderPink: { name: 'Powder Pink', tone: 'fresh, soft and feminine', fact: 'Rose can instantly make an outfit feel lighter. It looks especially grown-up when the cut and material stay clean, such as a blazer, blouse, knit or silk.', combinations: 'Combine rose with cream, taupe, camel, denim or brown. A clean cut makes it more modern.' },
        rosePink: { name: 'Rose Pink', tone: 'fresh, soft and feminine', fact: 'Pink brings energy and freshness to an outfit. It looks grown-up when the look stays reduced and the material feels high quality.', combinations: 'Stronger pink looks modern with white, navy or a clear green accent. As an accessory, it immediately makes neutral outfits livelier.' },
        generic: { name: 'Color Tone', tone: 'individual and expressive', fact: 'Every color changes its effect through material, light and combination. Matte fabrics look calmer, while shiny fabrics feel stronger and more festive.', combinations: 'Combine this tone with one light neutral, one dark neutral and at most one additional accent from the palette.' }
      }
    },
    ru: {
      ui: {
        brandWord: 'Цвет',
        customerFor: 'для {name}',
        brandAria: 'ESKYNA Цвет',
        brandAriaFor: 'ESKYNA Цвет для {name}',
        pageTitle: 'ESKYNA Цвет - {palette}',
        pageTitleFor: 'ESKYNA Цвет для {name} - {palette}',
        overviewTitle: 'ESKYNA Цвет',
        paletteSection: 'Цветовая карта {palette}',
        overviewSelection: 'Выбор цветовой карты',
        analysisSection: 'Проверка цвета одежды',
        actions: 'Действия',
        colorCheck: 'Проверить цвет',
        styleQuestion: 'Спросить Наталью о стиле',
        installApp: 'Установить приложение',
        updateApp: 'Обновить приложение',
        updating: 'Обновление ...',
        openEskyna: 'Открыть сайт ESKYNA',
        symbolAlt: 'Символ ESKYNA',
        colorKnowledgeHint: 'Нажмите, чтобы узнать о цвете',
        explainColor: 'Пояснение к цвету: {color}',
        measuredColor: 'Измеренный цвет',
        fullscreenAria: 'Полноэкранный просмотр цвета',
        fullscreenClose: 'Закрыть просмотр цвета',
        explanationTo: 'Пояснение к цвету {color}',
        colorKnowledge: 'Знание о цвете',
        styleKnowledge: 'Стильный факт',
        combine: 'Как сочетать',
        fullscreenFootnote: 'Нажмите вне карточки, чтобы вернуться к цветовой карте.',
        resultColorTitle: 'Пояснение к цвету: {color}',
        resultSampleAria: 'Пояснить измеренный цвет {color}',
        resultMatchAria: 'Пояснить ближайший тон палитры {color}',
        resultEyebrow: 'Ваша проверка цвета',
        yourColor: 'Ваш цвет',
        nearestPaletteColor: 'Ближайший тон палитры',
        fitMeter: 'Гармония цвета: {label}'
      },
      paletteTerms: {
        light: 'Светлая',
        cool: 'Холодная',
        clear: 'Чистая',
        deep: 'Глубокая',
        warm: 'Тёплая',
        soft: 'Мягкая'
      },
      fit: {
        perfect: { title: 'Идеальное попадание в вашу карту', label: 'очень близко к тону палитры', advice: 'Этот цвет можно носить как родной тон вашей цветовой карты. Он хорошо подходит и для больших зон: блузы, платья, жакета или трикотажа.' },
        strong: { title: 'Очень гармонично', label: 'согласованно и легко сочетать', advice: 'Цвет очень близок к вашей палитре. Особенно красиво он смотрится с спокойными базовыми оттенками из вашей цветовой карты.' },
        good: { title: 'Хорошо подходит к карте', label: 'гармонично, но не полностью идентично', advice: 'Направление верное. Чтобы образ выглядел особенно цельно, повторите ближайший тон палитры в украшениях, обуви, сумке или макияже.' },
        soft: { title: 'Может сработать - сочетайте осознанно', label: 'близко, но есть небольшое смещение', advice: 'Цвет не совсем чистый для палитры. Лучше не носить его прямо у лица или сочетать с сильными любимыми цветами из вашей карты.' },
        away: { title: 'Скорее не идеальный тон', label: 'заметно вне цветовой карты', advice: 'Как маленькая деталь цвет ещё может работать. Для топов, шарфов или платьев тон из вашей цветовой карты обычно будет более комплиментарным.' }
      },
      scan: {
        scannerAria: 'Живая проверка цвета',
        hint: 'Держите вещь ровно внутри круга.',
        close: 'Закрыть сканер',
        capture: 'Проверить цвет сейчас',
        fileFallback: 'Выбрать изображение',
        cameraFallback: 'Камера недоступна. Можно выбрать изображение.',
        measuredShort: 'Измерено',
        paletteShort: 'Палитра',
        nearestThree: 'Три ближайших цвета из вашей карты',
        light: {
          aria: 'Качество света',
          checking: 'Проверяем свет ...',
          good: 'Дневной свет хороший',
          uncertain: 'Измерение неуверенное',
          tooDark: 'слишком темно',
          dim: 'немного темно',
          tooBright: 'слишком светло',
          tooYellow: 'слишком желтый свет',
          shadow: 'обнаружена тень',
          unstable: 'круг заполнен неравномерно'
        },
        verdict: {
          veryGood: 'Очень хорошо подходит – {score} %',
          good: 'Хорошо подходит – {score} %',
          almost: 'Почти подходит – {score} %',
          borderline: 'Пограничный вариант – {score} %',
          notIdeal: 'Скорее не идеально – {score} %',
          unsure: 'Неуверенно – проверьте ещё раз'
        },
        label: {
          veryGood: 'очень высокая гармония',
          good: 'гармонично',
          almost: 'почти подходит',
          borderline: 'сочетать осознанно',
          notIdeal: 'вне идеального направления',
          unsure: 'улучшите условия'
        },
        dimension: {
          brightness: { ok: 'Светлота подходит', tooLight: 'немного светлее нужного', tooDark: 'немного темнее нужного' },
          warmth: { ok: 'Теплота подходит', tooWarm: 'немного теплее/желтее', tooCool: 'немного холоднее' },
          clarity: { ok: 'Чистота подходит', tooClear: 'немного слишком ярко', tooMuted: 'немного приглушенно' }
        },
        advice: {
          veryGood: 'Светлота, теплота и чистота выглядят согласованно. Этот тон можно носить у лица или большой площадью.',
          good: 'Направление красивое. Добавьте спокойный базовый тон или акцент из вашей карты, чтобы образ выглядел продуманно.',
          tooMuted: 'Почти подходит, но немного приглушенно. Лучше взять более чистый и свежий вариант.',
          tooClear: 'Почти подходит, но довольно интенсивно. Более спокойный или менее яркий вариант обычно выглядит благороднее.',
          tooWarm: 'Почти подходит, но немного слишком тепло. Ищите менее желтоватый вариант.',
          tooCool: 'Почти подходит, но немного слишком холодно. Чуть более теплый вариант мягче соединится с вашей картой.',
          tooLight: 'Почти подходит, но немного светло. Чуть больше глубины даст образу контур.',
          tooDark: 'Почти подходит, но немного темно. Более светлый вариант будет ближе к вашей карте.',
          checkAgain: 'Направление может быть верным, но перед покупкой проверьте ещё раз при нейтральном дневном свете.',
          neutral: 'Используйте этот тон скорее как деталь и повторите надежный тон карты в украшениях, обуви, сумке или макияже.',
          retry: 'По этому фото я не уверена. Проверьте ещё раз при нейтральном дневном свете, без сильной тени и теплого искусственного света.'
        },
        confidence: {
          good: 'Оценка основана на {points} точках измерения внутри круга. Камера и фактура ткани могут немного смещать цвет.',
          warning: 'Рекомендация предварительная: свет или тень могут влиять на камеру. Проверьте ещё раз при нейтральном дневном свете.'
        }
      },
      paletteNotes: {
        warm: 'В тёплой палитре особенно хорошо связывают образ кремовый, золото, кэмел, коньячный и тёплые природные оттенки.',
        cool: 'В холодной палитре белый, серебро, тауп, navy и холодные розовые или ягодные оттенки делают сочетания особенно чистыми.',
        neutral: 'Выберите один светлый и один тёмный тон из вашей карты, чтобы образ выглядел продуманно, а не случайно.',
        light: 'В Light-палитрах большие зоны лучше оставлять светлыми; тёмные оттенки используйте скорее для контура.',
        deep: 'В Deep-палитрах контраст может быть заметным; светлые тона особенно хороши как световой акцент.',
        clear: 'Clear-палитры выдерживают чёткие линии, гладкие ткани и осознанные контрасты.',
        soft: 'Soft-палитры особенно благородно выглядят в тон-в-тон, матовых тканях и мягких переходах.'
      },
      colorStories: {
        whiteClear: { name: 'Чистый белый', tone: 'светлый, свежий и очень нейтральный', fact: 'Белый добавляет палитре визуальную паузу и делает яркие цвета более современными. В моде белый выглядит особенно дорого, когда видна фактура ткани: хлопок, шёлк или лён.', combinations: 'Используйте его как свежую основу почти с любым тоном палитры. Особенно элегантно он смотрится с кэмелом, золотом, navy, эспрессо или одним ярким акцентом.' },
        whiteCream: { name: 'Кремово-белый', tone: 'светлый, мягкий и очень нейтральный', fact: 'Кремово-белый мягче чистого белого и делает светлые образы теплее. В тонких тканях он выглядит роскошно, потому что мягко отражает свет.', combinations: 'Используйте кремово-белый как тёплую свежую базу с бежевым, кэмелом, золотом, коричневым, коралловым или чистым акцентом из палитры.' },
        graphite: { name: 'Графит', tone: 'тёмный, спокойный и чистый', fact: 'Графит - более мягкая альтернатива чистому чёрному. Он выглядит элегантно и не подавляет светлые или нежные цвета так сильно, как глубокий чёрный.', combinations: 'Носите графит как обрамляющий цвет со светлыми тонами, розе, кремовым или холодным синим. Светлая обувь или украшения в золоте либо серебре добавят лёгкости.' },
        taupeGrey: { name: 'Таупово-серый', tone: 'приглушённый, нейтральный и универсальный', fact: 'Тауп находится между серым и коричневым, поэтому выглядит зрелым нейтралом. В образе он связывает цветные вещи, не становясь слишком громким.', combinations: 'Красиво с кремовым, пыльно-розовым, шалфейным, денимом или бургунди. Тон-в-тон с песочным и коричневым выглядит особенно спокойно и дорого.' },
        greige: { name: 'Грейж', tone: 'светлый, мягкий и нейтральный', fact: 'Грейж соединяет серый и бежевый, поэтому выглядит менее строгим, чем чистый серый. Он идеален, когда образ должен быть ухоженным, но не жёстким.', combinations: 'Используйте грейж как базу с пастелью, кэмелом, белым или приглушёнными ягодными тонами. С чистыми цветами он даёт баланс.' },
        espresso: { name: 'Эспрессо', tone: 'глубокий, тёплый и элегантный', fact: 'Эспрессо - роскошный тёмный тон, который часто мягче чёрного. В коже, трикотаже или шерсти он получает красивую глубину.', combinations: 'Сочетайте эспрессо с кремовым, карамелью, золотом, коралловым или петролью. В аксессуарах он сразу делает светлый образ более собранным.' },
        chocolateBrown: { name: 'Шоколадно-коричневый', tone: 'тёплый, приземлённый и благородный', fact: 'Коричневые тона - одни из важнейших нейтралов в моде, потому что особенно красиво раскрывают кожу, замшу, шерсть и другие природные материалы.', combinations: 'Очень хорошо с кремовым, золотом, оливковым, денимом, терракотой или петролью. С белым коричневый выглядит свежее, с бежевым - мягче.' },
        cognacBrown: { name: 'Коньячный коричневый', tone: 'тёплый, приземлённый и благородный', fact: 'Коньячный тон живее тёмного коричневого и сразу напоминает о качественных кожаных изделиях. Поэтому сумки, ремни и обувь в этом цвете выглядят особенно стильно.', combinations: 'Очень хорошо с кремовым, золотом, оливковым, денимом, терракотой или петролью. С белым коньячный выглядит свежее, с бежевым - мягче.' },
        camel: { name: 'Кэмел', tone: 'тёплый, мягкий и классический', fact: 'Кэмел - классика верхней одежды: он делает даже простые образы более собранными. Оттенок кажется роскошным, потому что ассоциируется с кашемиром, пальтовыми тканями и дорогой кожей.', combinations: 'Сочетайте кэмел с кремовым, эспрессо, золотом, красным, оливковым или денимом. Монохром с песочным и бежевым создаёт очень элегантный образ.' },
        sandBeige: { name: 'Песочный беж', tone: 'светлый, тёплый и сдержанный', fact: 'Песочный беж - тихий нейтрал, который позволяет крою, ткани и украшениям звучать сильнее. Он идеален, когда цвет должен быть элегантной сценой.', combinations: 'Носите песочный беж с белым, кэмелом, коралловым, тёплым зелёным или коричневым. Тёмная обувь, ремень или сумка добавят контура.' },
        burgundy: { name: 'Бургунди', tone: 'глубокий, чувственный и благородный', fact: 'Бургунди часто используют в вечерней моде и тейлоринге как более мягкую альтернативу чёрному. Он добавляет глубину, но не выглядит холодным или жёстким.', combinations: 'Особенно красиво с кремовым, эспрессо, кэмелом, розе или navy. Как цвет помады, обуви или сумки бургунди создаёт элегантный акцент.' },
        cherryRed: { name: 'Вишнёвый красный', tone: 'чистый, живой и привлекающий внимание', fact: 'Красный - один из самых сильных сигнальных цветов в моде: даже маленькая зона притягивает взгляд. Поэтому он отлично работает для обуви, губ, ногтей, сумок или одной statement-вещи.', combinations: 'Сочетайте красный с кремовым, белым, денимом, кэмелом или коричневым. Для современного образа часто достаточно одной красной детали к спокойной базе.' },
        tomatoRed: { name: 'Томатный красный', tone: 'чистый, живой и привлекающий внимание', fact: 'Томатный красный имеет тёплую, дружелюбную энергию и кажется более доступным, чем холодный сигнальный красный. В простом крое он сразу становится современным акцентом.', combinations: 'Сочетайте томатный красный с кремовым, белым, денимом, кэмелом или коричневым. Для современного образа часто достаточно одной красной детали к спокойной базе.' },
        coral: { name: 'Коралловый', tone: 'тёплый, живой и солнечный', fact: 'Коралловый добавляет лицу тепла и выглядит мягче классического красного. В моде он особенно хорош в струящихся тканях, трикотаже и летних аксессуарах.', combinations: 'Сочетайте коралловый с кремовым, песочным, золотом, тёплым коричневым или оливковым. Как акцент он сразу оживляет нейтральные образы.' },
        terracotta: { name: 'Терракотовый', tone: 'тёплый, живой и солнечный', fact: 'Терракотовый напоминает землю, керамику и южную архитектуру. Поэтому он выглядит естественно, модно и взросло одновременно.', combinations: 'Сочетайте терракотовый с кремовым, песочным, золотом, тёплым коричневым или оливковым. Как акцент он сразу оживляет нейтральные образы.' },
        apricot: { name: 'Абрикосовый', tone: 'тёплый, мягкий и дружелюбный', fact: 'Абрикосовый - мягкая сторона оранжевого. В моде он выглядит благородно, когда не уходит в неон и носится с чистым кроем.', combinations: 'Очень гармоничен с кремовым, кэмелом, коньячным, оливковым и тёплым денимом. Тёмный нейтрал добавит абрикосовому больше элегантности.' },
        rustOrange: { name: 'Ржаво-оранжевый', tone: 'тёплый, мягкий и дружелюбный', fact: 'Ржаво-оранжевый - приглушённый оранжевый, поэтому он носится легче, чем яркий апельсиновый. Особенно стильно он выглядит в трикотаже, вельвете, коже и шерсти.', combinations: 'Очень гармоничен с кремовым, кэмелом, коньячным, оливковым и тёплым денимом. Тёмный нейтрал добавит ржаво-оранжевому больше элегантности.' },
        vanillaYellow: { name: 'Ванильный жёлтый', tone: 'светлый, тёплый и дружелюбный', fact: 'Светлый жёлтый добавляет образу света и мягче, чем яркое солнечное жёлтое. В блузах, трикотаже или платках он даёт элегантную свежесть.', combinations: 'Сочетайте ванильный жёлтый с кремовым, песочным, кэмелом, светлым денимом или тёплым серым. Маленькие золотые акценты красиво поддерживают тепло.' },
        goldenYellow: { name: 'Золотисто-жёлтый', tone: 'сияющий, оптимистичный и заметный', fact: 'Жёлтый сильно притягивает взгляд и выглядит особенно современно, когда используется осознанно. Сумка, обувь, платок или топ в жёлтом сразу добавляют энергии нейтральному образу.', combinations: 'Очень хорошо с белым, кремовым, денимом, navy, оливковым или коричневым. Если жёлтый очень чистый, остальные вещи лучше оставить простыми.' },
        lemonYellow: { name: 'Лимонный жёлтый', tone: 'сияющий, оптимистичный и заметный', fact: 'Лимонный жёлтый выглядит свежо, чисто и графично. В моде его часто используют как небольшой световой акцент, потому что он заметен даже в малом количестве.', combinations: 'Очень хорошо с белым, кремовым, денимом, navy, оливковым или коричневым. Если жёлтый очень чистый, остальные вещи лучше оставить простыми.' },
        oliveGreen: { name: 'Оливковый', tone: 'естественный, тёплый и стильный', fact: 'Оливковый - модный нейтрал: в нём есть цвет, но он почти так же универсален, как коричневый или серый. Он добавляет природность, не обязательно делая образ спортивным.', combinations: 'Сочетайте оливковый с кремовым, коричневым, кэмелом, золотом, коралловым или денимом. Чистый крой и спокойные аксессуары делают его элегантнее.' },
        limeGreen: { name: 'Липовый зелёный', tone: 'естественный, тёплый и стильный', fact: 'Липовый зелёный приносит в образ свежую и более светлую сторону зелёной гаммы. Он особенно красив, когда сочетание остаётся спокойным и не слишком пёстрым.', combinations: 'Сочетайте липовый зелёный с кремовым, коричневым, кэмелом, золотом, коралловым или денимом. Чистый крой и спокойные аксессуары делают его элегантнее.' },
        forestGreen: { name: 'Еловый зелёный', tone: 'глубокий, спокойный и роскошный', fact: 'Еловый зелёный - классический благородный тон, особенно сильный в бархате, шерсти, шёлке или коже. Он даёт тёмным образам глубину без жёсткости чёрного.', combinations: 'Красиво с кремовым, золотом, коньячным, розе, бургунди или navy. Со светлыми нейтралами еловый зелёный сразу выглядит свежее.' },
        sageGreen: { name: 'Шалфейный зелёный', tone: 'мягкий, естественный и современный', fact: 'Шалфейный зелёный ведёт себя как спокойный нейтрал с природной нотой. Он идеален, когда образ должен быть цветным, но не громким.', combinations: 'Сочетайте шалфейный с кремовым, грейжем, таупом, розе или денимом. Тон-в-тон с бежевым выглядит очень мягко.' },
        emeraldGreen: { name: 'Изумрудный зелёный', tone: 'чистый, драгоценный и выразительный', fact: 'Изумрудный часто считывается как цвет драгоценного камня, поэтому сразу кажется благородным. Это сильный statement-тон: он интенсивный, но менее агрессивный, чем красный.', combinations: 'Сочетайте изумрудный с кремовым, чёрно-коричневым, золотом, navy или маленьким розовым акцентом. Большие зоны требуют спокойных спутников.' },
        petrol: { name: 'Петроль', tone: 'свежий, элегантный и цветной без громкости', fact: 'Петроль находится между синим и зелёным. Именно эта смесь делает его интересным: он свежий, но взрослее многих чистых синих.', combinations: 'Сочетайте петроль с кремовым, коричневым, золотом, ржавым, коралловым или navy. Как тёмный цветовой акцент он очень элегантен.' },
        turquoise: { name: 'Бирюзовый', tone: 'свежий, элегантный и цветной без громкости', fact: 'Бирюзовый находится между синим и зелёным и сразу добавляет свежести. Он особенно летний в сочетании со светлыми природными тонами.', combinations: 'Бирюзовый очень чисто смотрится с белым и по-летнему с песочным. Для большей элегантности подойдут navy, золото или спокойный коричневый.' },
        nightBlue: { name: 'Ночной синий', tone: 'глубокий, собранный и элегантный', fact: 'Ночной синий - классика деловой и вечерней моды. Он даёт глубину чёрного, но часто выглядит мягче и отлично сочетается с ювелирными оттенками.', combinations: 'Красиво с белым, кремовым, серебром, золотом, бургунди, светло-синим или кэмелом. Для чистого образа сочетайте его с одним светлым контрастом.' },
        cobaltBlue: { name: 'Кобальтовый синий', tone: 'чистый, холодный и выразительный', fact: 'Кобальтовый синий выглядит графично и современно, особенно в простом крое. Он идеально делает базовые вещи свежее и осознаннее.', combinations: 'Сочетайте кобальт с белым, navy, серебром, денимом, розовым или маленьким жёлтым акцентом. С очень чистыми синими остальные вещи могут быть спокойнее.' },
        aubergine: { name: 'Баклажановый', tone: 'креативный, мягкий и загадочный', fact: 'Баклажановый менее ожидаем, чем красный или синий. Он добавляет образу индивидуальность, не становясь обязательно громким.', combinations: 'Сочетайте баклажановый с кремовым, таупом, серым, золотом, розе или еловым зелёным. Особенно элегантен он с эспрессо и мягкими шерстяными тканями.' },
        violet: { name: 'Фиолетовый', tone: 'креативный, мягкий и загадочный', fact: 'Фиолетовые оттенки менее ожидаемы, чем красный или синий. В моде они добавляют образу индивидуальность, не становясь обязательно громкими.', combinations: 'Сочетайте фиолетовый с кремовым, таупом, серым, золотом, розе или еловым зелёным. В мягких материалах он выглядит особенно благородно.' },
        berry: { name: 'Ягодный', tone: 'глубокий, женственный и элегантный', fact: 'Ягодные тона соединяют энергию красного с мягкостью фиолетового. Поэтому они заметные, но обычно благороднее и спокойнее чистого розового.', combinations: 'Сочетайте ягодный с кремовым, таупом, антрацитом, navy, розе или золотом. Как акцент ягодный идеален для нейтральных образов.' },
        powderPink: { name: 'Пудрово-розовый', tone: 'свежий, мягкий и женственный', fact: 'Розе сразу делает образ легче. Особенно взросло он выглядит, когда крой и материал остаются чистыми: жакет, блуза, трикотаж или шёлк.', combinations: 'Сочетайте розе с кремовым, таупом, кэмелом, денимом или коричневым. Чистый крой делает его современнее.' },
        rosePink: { name: 'Розовый', tone: 'свежий, мягкий и женственный', fact: 'Розовый добавляет образу энергии и свежести. Взросло он выглядит, когда образ остаётся сдержанным, а материал качественным.', combinations: 'Более насыщенный розовый современно смотрится с белым, navy или чистым зелёным акцентом. В аксессуарах он сразу оживляет нейтральные образы.' },
        generic: { name: 'Цветовой тон', tone: 'индивидуальный и выразительный', fact: 'Каждый цвет меняет своё впечатление через материал, свет и сочетание. Матовые ткани выглядят спокойнее, блестящие - сильнее и праздничнее.', combinations: 'Сочетайте этот тон с одним светлым нейтралом, одним тёмным нейтралом и максимум одним дополнительным акцентом из палитры.' }
      }
    }
  };

  const ACTIVE_LANGUAGE = detectLanguage();

  function normalizeLanguage(value) {
    const text = String(value || '').toLowerCase();
    if (text.startsWith('ru')) return 'ru';
    if (text.startsWith('en')) return 'en';
    if (text.startsWith('de')) return 'de';
    return '';
  }

  function detectLanguage() {
    const params = new URLSearchParams(window.location.search);
    const forced = normalizeLanguage(params.get('lang'));
    if (forced) return forced;

    const candidates = Array.isArray(navigator.languages) && navigator.languages.length
      ? navigator.languages
      : [navigator.language];

    for (const candidate of candidates) {
      const normalized = normalizeLanguage(candidate);
      if (normalized && SUPPORTED_LANGUAGES.includes(normalized)) return normalized;
    }
    return FALLBACK_LANGUAGE;
  }

  function getByPath(source, path) {
    return String(path).split('.').reduce((current, part) => {
      if (current && Object.prototype.hasOwnProperty.call(current, part)) return current[part];
      return undefined;
    }, source);
  }

  function interpolate(value, replacements) {
    return String(value).replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => (
      replacements && Object.prototype.hasOwnProperty.call(replacements, key) ? replacements[key] : match
    ));
  }

  function t(path, replacements) {
    const value = getByPath(TRANSLATIONS[ACTIVE_LANGUAGE], path) ?? getByPath(TRANSLATIONS[FALLBACK_LANGUAGE], path) ?? path;
    return interpolate(value, replacements || {});
  }

  function localizedObject(path) {
    return getByPath(TRANSLATIONS[ACTIVE_LANGUAGE], path) || getByPath(TRANSLATIONS[FALLBACK_LANGUAGE], path) || {};
  }

  function formatPaletteName(name) {
    return String(name || '')
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => t('paletteTerms.' + part.toLowerCase(), {}) || titleCase(part))
      .join(' ');
  }

  function titleCase(value) {
    const text = String(value || '');
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function getPageTitle(paletteName, customerName = '') {
    const palette = formatPaletteName(paletteName);
    return customerName ? t('ui.pageTitleFor', { palette, name: customerName }) : t('ui.pageTitle', { palette });
  }

  function getOverviewTitle() {
    return t('ui.overviewTitle');
  }

  function getColorStory(key) {
    const story = localizedObject('colorStories.' + key);
    return {
      name: story.name || t('colorStories.generic.name'),
      tone: story.tone || t('colorStories.generic.tone'),
      fact: story.fact || t('colorStories.generic.fact'),
      combinations: story.combinations || t('colorStories.generic.combinations')
    };
  }

  function getFit(key) {
    const fit = localizedObject('fit.' + key);
    return {
      title: fit.title || '',
      label: fit.label || '',
      advice: fit.advice || ''
    };
  }

  function getPaletteCombinationNote(name) {
    const value = String(name || '').toLowerCase();
    if (value.includes('warm')) return t('paletteNotes.warm');
    if (value.includes('cool')) return t('paletteNotes.cool');
    return t('paletteNotes.neutral');
  }

  function getPaletteDepthNote(name) {
    const value = String(name || '').toLowerCase();
    const notes = [];
    if (value.includes('light')) notes.push(t('paletteNotes.light'));
    if (value.includes('deep')) notes.push(t('paletteNotes.deep'));
    if (value.includes('clear')) notes.push(t('paletteNotes.clear'));
    if (value.includes('soft')) notes.push(t('paletteNotes.soft'));
    return notes.join(' ');
  }

  function applyDocumentLanguage() {
    document.documentElement.lang = ACTIVE_LANGUAGE;
    document.documentElement.setAttribute('data-language', ACTIVE_LANGUAGE);
  }

  window.ESKYNA_I18N = {
    getLanguage: () => ACTIVE_LANGUAGE,
    t,
    formatPaletteName,
    getPageTitle,
    getOverviewTitle,
    getColorStory,
    getFit,
    getPaletteCombinationNote,
    getPaletteDepthNote,
    applyDocumentLanguage
  };
})();

