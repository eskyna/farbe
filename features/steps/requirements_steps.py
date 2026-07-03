import json
import re
import subprocess
from pathlib import Path

from behave import given, then, when


class Project:
    def __init__(self, root):
        self.root = Path(root)
        self.cache = {}

    def path(self, relative_path):
        return self.root / relative_path

    def read_text(self, relative_path):
        return self.path(relative_path).read_text(encoding="utf-8")

    def read_json(self, relative_path):
        return json.loads(self.read_text(relative_path))

    def run(self, args):
        result = subprocess.run(
            args,
            cwd=self.root,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=False,
        )
        if result.returncode != 0:
            raise AssertionError(
                f"Command failed: {' '.join(args)}\nSTDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}"
            )
        return result.stdout

    def ensure_dist(self):
        if not self.path("dist/version.json").exists() or not self.path("dist/palettes.js").exists():
            self.run(["npm", "run", "build"])

    def palettes(self):
        if "palettes" not in self.cache:
            text = self.read_text("palettes.js")
            match = re.search(r"window\.ESKYNA_PALETTES\s*=\s*(\[.*\]);\s*$", text, re.DOTALL)
            if not match:
                raise AssertionError("palettes.js enthaelt keine auslesbare window.ESKYNA_PALETTES-Zuweisung.")
            self.cache["palettes"] = json.loads(match.group(1))
        return self.cache["palettes"]

    def i18n_report(self, language):
        key = f"i18n:{language}"
        if key not in self.cache:
            output = self.run(["node", "features/support/inspect-app.mjs", "i18n", language])
            self.cache[key] = json.loads(output)
        return self.cache[key]

    def color_report(self, language):
        key = f"colors:{language}"
        if key not in self.cache:
            output = self.run(["node", "features/support/inspect-app.mjs", "colors", language])
            self.cache[key] = json.loads(output)
        return self.cache[key]

    def dist_version(self):
        self.ensure_dist()
        return self.read_json("dist/version.json")["version"]

    def public_source_text(self):
        files = ["templates/palette.html", "index.html", "palette-app.js", "overview.js", "i18n.js"]
        return "\n".join(self.read_text(file) for file in files)


def get_project(context):
    if not hasattr(context, "project"):
        context.project = Project(context.project_root)
    return context.project


def normalize(value):
    return str(value or "").strip().casefold()


def assert_contains(text, needle, label):
    if needle not in text:
        raise AssertionError(f"Erwarteter Inhalt fehlt in {label}: {needle}")


def assert_not_contains(text, needle, label):
    if needle in text:
        raise AssertionError(f"Unerwuenschter Inhalt gefunden in {label}: {needle}")


@given("das Projekt wurde geladen")
def step_project_loaded(context):
    project = get_project(context)
    required = [
        "index.html",
        "templates/palette.html",
        "styles.css",
        "palette-app.js",
        "i18n.js",
        "palettes.js",
        "sw.js",
        "bin/generate",
    ]
    missing = [path for path in required if not project.path(path).exists()]
    if missing:
        raise AssertionError(f"Pflichtdateien fehlen: {', '.join(missing)}")


@given("der Dist-Build existiert")
def step_dist_exists(context):
    get_project(context).ensure_dist()


@when('die App-Sprache "{language}" aktiv ist')
def step_language_active(context, language):
    project = get_project(context)
    context.active_language = language
    context.i18n_report = project.i18n_report(language)


@then("gibt es genau 24 Farbkarten")
def step_24_palettes(context):
    palettes = get_project(context).palettes()
    assert len(palettes) == 24, f"Erwartet wurden 24 Paletten, gefunden: {len(palettes)}"


@then("jede Farbkarte hat 24 Farben")
def step_each_palette_has_24_colors(context):
    for palette in get_project(context).palettes():
        colors = palette.get("colors", [])
        assert len(colors) == 24, f"{palette.get('slug')} hat {len(colors)} statt 24 Farben."
        invalid = [color for color in colors if not re.match(r"^#[0-9a-fA-F]{6}$", str(color))]
        assert not invalid, f"{palette.get('slug')} hat ungueltige Hex-Farben: {invalid}"


@then("jede Farbkarte ist im Quellmodell 4 Farben breit und 6 Farben hoch")
def step_source_grid_shape(context):
    for palette in get_project(context).palettes():
        grid = palette.get("grid", [])
        assert len(grid) == 6, f"{palette.get('slug')} hat {len(grid)} statt 6 Zeilen."
        for index, row in enumerate(grid, start=1):
            assert len(row) == 4, f"{palette.get('slug')} Zeile {index} hat {len(row)} statt 4 Farben."


@then("jede generierte Farbkarte besitzt HTML, Manifest und Icons")
def step_generated_palette_assets(context):
    project = get_project(context)
    project.ensure_dist()
    for palette in project.palettes():
        slug = palette["slug"]
        assert project.path(f"dist/{slug}/index.html").exists(), f"dist/{slug}/index.html fehlt."
        manifest_path = f"dist/{slug}/manifest.webmanifest"
        assert project.path(manifest_path).exists(), f"{manifest_path} fehlt."
        manifest = project.read_json(manifest_path)
        icons = manifest.get("icons", [])
        assert len(icons) >= 2, f"{slug}: Manifest braucht mindestens zwei Icons."
        for icon in icons:
            icon_path = str(icon.get("src", "")).replace("../", "").replace("/farbe/", "")
            assert project.path(f"dist/{icon_path}").exists(), f"{slug}: Icon fehlt: {icon.get('src')}"


@then('sind die wichtigsten UI-Texte in "{language}" vorhanden')
def step_ui_texts_available(context, language):
    report = context.i18n_report if getattr(context, "active_language", None) == language else get_project(context).i18n_report(language)
    assert report["language"] == language, f"i18n meldet {report['language']} statt {language}."
    missing = [key for key, value in report["labels"].items() if not str(value).strip()]
    assert not missing, f"Fehlende UI-Texte in {language}: {', '.join(missing)}"


@then('ein Palettenname wird in "{language}" uebersetzt')
def step_palette_name_translated(context, language):
    report = context.i18n_report if getattr(context, "active_language", None) == language else get_project(context).i18n_report(language)
    name = report["paletteName"]
    assert name and len(name.split()) >= 3, f"Palettenname in {language} wirkt unvollstaendig: {name!r}"
    assert name != "light warm clear", f"Palettenname wurde in {language} nicht formatiert."


@then('personalisierte Seitentitel sind in "{language}" vorhanden')
def step_personalized_titles_available(context, language):
    report = context.i18n_report if getattr(context, "active_language", None) == language else get_project(context).i18n_report(language)
    title = report["pageTitleFor"]
    assert "Melissa" in title, f"Personalisierter Titel in {language} enthaelt den Namen nicht: {title!r}"
    assert "light warm clear" not in title, f"Personalisierter Titel in {language} nutzt den Rohslug: {title!r}"


@then('jede Farbe auf jeder Farbkarte hat einen Farbnamen in "{language}"')
def step_every_color_has_name(context, language):
    report = get_project(context).color_report(language)
    assert len(report) == 24, f"Color-Report fuer {language} enthaelt {len(report)} Paletten."
    for palette in report:
        names = palette.get("names", [])
        assert len(names) == 24, f"{palette.get('slug')} hat {len(names)} Farbnamen."
        missing = [index for index, name in enumerate(names, start=1) if not str(name).strip()]
        assert not missing, f"{palette.get('slug')} hat leere Farbnamen an Positionen: {missing}"


@then('jede Farbe auf jeder Farbkarte hat Stilwissen und Kombinationshilfe in "{language}"')
def step_every_color_has_story(context, language):
    report = get_project(context).color_report(language)
    for palette in report:
        stories = palette.get("stories", [])
        assert len(stories) == 24, f"{palette.get('slug')} hat {len(stories)} Farberklaerungen."
        for index, story in enumerate(stories, start=1):
            for key in ["name", "tone", "fact", "combinations"]:
                value = str(story.get(key, "")).strip()
                assert value, f"{palette.get('slug')} Farbe {index}: '{key}' fehlt."
            assert len(story["fact"].strip()) >= 25, f"{palette.get('slug')} Farbe {index}: Stilwissen ist zu kurz."
            assert len(story["combinations"].strip()) >= 35, f"{palette.get('slug')} Farbe {index}: Kombinationshilfe ist zu kurz."


@then('keine Farbkarte wiederholt Farbnamen in "{language}"')
def step_no_duplicate_color_names(context, language):
    report = get_project(context).color_report(language)
    for palette in report:
        names = [normalize(name) for name in palette.get("names", [])]
        duplicates = sorted({name for name in names if names.count(name) > 1})
        assert not duplicates, f"{palette.get('slug')} wiederholt Farbnamen in {language}: {duplicates}"


@then("die Vollbild-Farbansicht zeigt Farbnamen, Stilwissen und Kombinationen")
def step_fullscreen_shows_story_parts(context):
    source = get_project(context).read_text("palette-app.js")
    assert_contains(source, "function showColorFullscreen", "palette-app.js")
    assert_contains(source, "getColorStory(hex, index, activePalette)", "palette-app.js")
    assert_contains(source, "ui.styleKnowledge", "palette-app.js")
    assert_contains(source, "ui.combine", "palette-app.js")
    assert_contains(source, "<h2>${escapeHtml(story.name)}</h2>", "palette-app.js")


@then('der Button zum Hochladen heisst "Farbe pruefen"')
def step_upload_button_label(context):
    template = get_project(context).read_text("templates/palette.html")
    assert_contains(template, "Farbe prüfen", "templates/palette.html")
    assert_not_contains(template, "Foto wählen", "templates/palette.html")


@then("die Ergebnisansicht zeigt keine technischen Abstandswerte")
def step_no_technical_distance_in_result(context):
    source = get_project(context).read_text("palette-app.js")
    match = re.search(r"result\.innerHTML\s*=\s*`(?P<html>.*?)`;", source, re.DOTALL)
    assert match, "result.innerHTML-Template wurde nicht gefunden."
    result_markup = match.group("html")
    for forbidden in ["delta", "Delta", "distance", "Distance", "Abstand"]:
        assert forbidden not in result_markup, f"Ergebnisansicht zeigt technischen Wert: {forbidden}"
    assert "Δ" not in result_markup, "Ergebnisansicht zeigt Delta-Zeichen."


@then("die Ergebnisansicht verwendet freundliche Passungsstufen")
def step_customer_friendly_fit_levels(context):
    report = get_project(context).i18n_report("de")
    perfect = report["fitPerfect"]
    away = report["fitAway"]
    assert "Volltreffer" in perfect["title"], f"Unerwartete perfekte Passungsstufe: {perfect}"
    assert "Idealton" in away["title"], f"Unerwartete Distanz-Passungsstufe: {away}"
    assert perfect["advice"] and away["advice"], "Passungsstufen brauchen Styling-Empfehlungen."


@then("die gemessene Farbe und der naechste Palettenton sind fuer Erklaerungen antippbar")
def step_result_chips_open_explanations(context):
    source = get_project(context).read_text("palette-app.js")
    assert_contains(source, "initializeResultColorChips", "palette-app.js")
    assert_contains(source, "data-fullscreen-color=\"${sampled.hex}\"", "palette-app.js")
    assert_contains(source, "data-fullscreen-color=\"${match.hex}\"", "palette-app.js")
    assert_contains(source, "toggleColorFullscreen", "palette-app.js")


@then("Portrait zeigt die Farbkarte 4 breit und 6 hoch")
def step_portrait_grid(context):
    css = get_project(context).read_text("styles.css")
    assert_contains(css, "grid-template-columns: repeat(4, minmax(0, 1fr));", "styles.css")
    assert_contains(css, "grid-template-rows: repeat(6, minmax(0, 1fr));", "styles.css")


@then("Landscape zeigt die Farbkarte 6 breit und 4 hoch")
def step_landscape_grid(context):
    css = get_project(context).read_text("styles.css")
    landscape_block = re.search(r"@media \(orientation: landscape\) \{(?P<body>.*?)\n\}", css, re.DOTALL)
    assert landscape_block, "Landscape-Media-Query wurde nicht gefunden."
    css_text = landscape_block.group("body")
    assert "grid-template-columns: repeat(6, minmax(0, 1fr));" in css, "Landscape braucht 6 Spalten."
    assert "grid-template-rows: repeat(4, minmax(0, 1fr));" in css, "Landscape braucht 4 Zeilen."


@then("der Landscape-Header nutzt eine Zeile fuer Logo, ESKYNA Farbe und Palettenname")
def step_landscape_header_one_line(context):
    css = get_project(context).read_text("styles.css")
    assert_contains(css, "/* Landscape v2: Logo, ESKYNA Farbe und Palettenname werden strikt eine Zeile. */", "styles.css")
    assert_contains(css, "body.palette-page .hero {", "styles.css")
    assert_contains(css, "flex-wrap: nowrap;", "styles.css")
    assert_contains(css, "height: 30px;", "styles.css")
    assert_contains(css, "body.palette-page .hero-copy {", "styles.css")
    assert_contains(css, "display: contents;", "styles.css")
    assert_contains(css, "body.palette-page .brand-title {", "styles.css")
    assert_contains(css, "white-space: nowrap;", "styles.css")


@then("lange Headertexte werden im Landscape gekuerzt statt umzubrechen")
def step_landscape_header_truncates(context):
    css = get_project(context).read_text("styles.css")
    assert_contains(css, "overflow: hidden;", "styles.css")
    assert_contains(css, "text-overflow: ellipsis;", "styles.css")
    assert_contains(css, "max-width: min(30vw, 150px);", "styles.css")
    assert_contains(css, "min-width: 72px;", "styles.css")


@then("die Header-Schrift bleibt Montserrat und ist nicht zu fett")
def step_header_font(context):
    css = get_project(context).read_text("styles.css")
    assert_contains(css, 'font-family: "Montserrat"', "styles.css")
    assert_contains(css, "font-weight: 500;", "styles.css")
    assert_contains(css, "font-weight: 400;", "styles.css")


@then("der Installationsbutton ist im Template versteckt")
def step_install_button_hidden(context):
    template = get_project(context).read_text("templates/palette.html")
    assert re.search(r'id="installButton"[^>]*class="[^"]*hidden', template), "Installationsbutton ist nicht hidden."


@then("der Runtime-Code zeigt den Installationsbutton nur nach dem Browser-Installationsereignis")
def step_install_button_after_event(context):
    source = get_project(context).read_text("palette-app.js")
    assert_contains(source, "hideInstallButton();", "palette-app.js")
    assert_contains(source, "window.addEventListener('beforeinstallprompt'", "palette-app.js")
    assert_contains(source, "deferredInstallPrompt = event;", "palette-app.js")
    assert_contains(source, "showInstallButton();", "palette-app.js")
    assert_contains(source, "isStandaloneMode()", "palette-app.js")


@then("der Runtime-Code entfernt den Installationsbutton nach Installation oder Updatezustand")
def step_install_button_hidden_after_install_or_update(context):
    source = get_project(context).read_text("palette-app.js")
    assert_contains(source, "window.addEventListener('appinstalled'", "palette-app.js")
    assert_contains(source, "hideInstallButton();", "palette-app.js")
    assert_contains(source, "document.body.classList.contains('has-update')", "palette-app.js")
    update_function = re.search(r"function showUpdateButton\([^)]*\) \{(?P<body>.*?)\n\}", source, re.DOTALL)
    assert update_function and "hideInstallButton();" in update_function.group("body"), "Update-Zustand versteckt Installationsbutton nicht."


@then("der alte Installationshinweistext ist entfernt")
def step_old_install_hint_removed(context):
    text = get_project(context).public_source_text()
    for forbidden in ["Installieren Sie diese Palette", "Foto machen", "Foto wählen", "Bildmitte"]:
        assert_not_contains(text, forbidden, "oeffentliche Quellen")


@then("der Dist-Build enthaelt eine Version")
def step_dist_version(context):
    version = get_project(context).dist_version()
    assert isinstance(version, str) and version.strip(), "version.json enthaelt keine Version."


@then("Service Worker und version.json verwenden dieselbe Version")
def step_sw_version_matches(context):
    project = get_project(context)
    version = project.dist_version()
    sw = project.read_text("dist/sw.js")
    assert version in sw, "sw.js enthaelt nicht die Version aus version.json."


@then("der Runtime-Code prueft version.json und den Service Worker auf Updates")
def step_runtime_checks_updates(context):
    source = get_project(context).read_text("palette-app.js")
    assert_contains(source, "serviceWorkerRegistration.update()", "palette-app.js")
    assert_contains(source, "checkRemoteVersion", "palette-app.js")
    assert_contains(source, "version.json?check=", "palette-app.js")
    assert_contains(source, "showUpdateButton", "palette-app.js")
    assert_contains(source, "clearAppCaches", "palette-app.js")


@then("der Updatebutton ist im Template versteckt bis eine neue Version erkannt wird")
def step_update_button_hidden(context):
    template = get_project(context).read_text("templates/palette.html")
    assert re.search(r'id="updateButton"[^>]*class="[^"]*hidden', template), "Updatebutton ist nicht hidden."
    source = get_project(context).read_text("palette-app.js")
    assert_contains(source, "updateButton.classList.remove('hidden')", "palette-app.js")


@then("die App nutzt das textile Hintergrundbild")
def step_app_background(context):
    project = get_project(context)
    css = project.read_text("styles.css")
    assert_contains(css, 'url("assets/app-background.jpg")', "styles.css")
    assert project.path("assets/app-background.jpg").exists(), "assets/app-background.jpg fehlt."


@then("der Splashscreen nutzt Hochkant- und Landscape-Bild")
def step_splash_assets(context):
    project = get_project(context)
    template = project.read_text("templates/palette.html")
    assert_contains(template, "assets/splash-landscape.jpg", "templates/palette.html")
    assert_contains(template, "assets/splash-portrait.jpg", "templates/palette.html")
    assert project.path("assets/splash-landscape.jpg").exists(), "assets/splash-landscape.jpg fehlt."
    assert project.path("assets/splash-portrait.jpg").exists(), "assets/splash-portrait.jpg fehlt."


@then("die Buttons verwenden Montserrat und ESKYNA-Stilelemente")
def step_buttons_branding(context):
    css = get_project(context).read_text("styles.css")
    for selector in [".file-button", ".secondary-button", ".install-button"]:
        assert_contains(css, selector, "styles.css")
    assert_contains(css, 'font-family: "Montserrat"', "styles.css")
    assert_contains(css, "border-radius: 999px;", "styles.css")
    assert_contains(css, "linear-gradient", "styles.css")
    assert_contains(css, "--eskyna-gold", "styles.css")


@then("das Template enthaelt einen Platzhalter fuer Kundinnennamen im Header")
def step_template_customer_placeholder(context):
    template = get_project(context).read_text("templates/palette.html")
    assert_contains(template, 'id="customerName"', "templates/palette.html")
    assert_contains(template, "customer-title", "templates/palette.html")


@then("die URL-Parameter fuer Kundinnennamen sind unterstuetzt")
def step_customer_query_keys(context):
    source = get_project(context).read_text("palette-app.js")
    assert_contains(source, "CUSTOMER_NAME_QUERY_KEYS", "palette-app.js")
    for key in ["'name'", "'kundin'", "'customer'", "'client'"]:
        assert_contains(source, key, "palette-app.js")


@then("der Kundinnenname wird bereinigt und lokal pro Farbkarte gespeichert")
def step_customer_name_sanitized_and_stored(context):
    source = get_project(context).read_text("palette-app.js")
    assert_contains(source, "sanitizeCustomerName", "palette-app.js")
    assert_contains(source, "CUSTOMER_NAME_STORAGE_PREFIX", "palette-app.js")
    assert_contains(source, "localStorage", "palette-app.js")
    assert_contains(source, "getCustomerNameStorageKey(paletteSlug)", "palette-app.js")


@then("keine Kundinnennamen werden in Manifest oder version.json geschrieben")
def step_no_customer_name_in_static_pwa_files(context):
    project = get_project(context)
    project.ensure_dist()
    forbidden = ["Melissa", "name=", "kundin=", "customer=", "client="]
    static_files = ["dist/manifest.webmanifest", "dist/version.json"]
    for palette in project.palettes():
        static_files.append(f"dist/{palette['slug']}/manifest.webmanifest")
    for file in static_files:
        text = project.read_text(file)
        for token in forbidden:
            assert token not in text, f"{file} enthaelt personalisierte Daten oder Query-Schluessel: {token}"


@then('das Kleeblatt-Logo im Palette-Template ist mit "https://eskyna.com" verlinkt')
def step_clover_links_to_eskyna(context):
    template = get_project(context).read_text("templates/palette.html")
    assert_contains(template, 'class="hero-logo-link"', "templates/palette.html")
    assert_contains(template, 'href="https://eskyna.com"', "templates/palette.html")
    assert_contains(template, 'assets/sign_gold.png', "templates/palette.html")

@then("Buttontexte duerfen mehrzeilig laufen")
def step_action_labels_can_wrap(context):
    css = get_project(context).read_text("styles.css")
    assert_contains(css, "white-space: normal;", "styles.css")
    assert_contains(css, "line-height: 1.14;", "styles.css")
    assert_contains(css, "overflow: visible;", "styles.css")


@then("Installieren oder Aktualisieren nutzt im Bedarfsfall eine eigene volle Zeile")
def step_install_update_full_width_row(context):
    css = get_project(context).read_text("styles.css")
    assert_contains(css, "body.has-install #installButton:not(.hidden)", "styles.css")
    assert_contains(css, "body.has-update #updateButton:not(.hidden)", "styles.css")
    assert_contains(css, "grid-column: 1 / -1;", "styles.css")
    assert_contains(css, "body.palette-page.has-install .app", "styles.css")
    assert_contains(css, "body.palette-page.has-update .app", "styles.css")


@then("die Aktionslabels sind in Deutsch, Englisch und Russisch uebersetzt")
def step_action_labels_translated(context):
    expected = {
        "de": ["Farbe prüfen", "Stilfrage an Natalia", "App installieren", "App aktualisieren"],
        "en": ["Check color", "Style question for Natalia", "Install app", "Update app"],
        "ru": ["Проверить цвет", "Спросить Наталью о стиле", "Установить приложение", "Обновить приложение"],
    }
    for language, labels in expected.items():
        report = get_project(context).i18n_report(language)
        actual_values = set(report["labels"].values())
        missing = [label for label in labels if label not in actual_values]
        assert not missing, f"Fehlende Aktionslabels in {language}: {', '.join(missing)}"


@then("package.json enthaelt Format, Lint, Validate, Build und BDD Skripte")
def step_package_quality_scripts(context):
    scripts = get_project(context).read_json("package.json").get("scripts", {})
    required = [
        "format",
        "format:check",
        "lint",
        "validate",
        "build",
        "validate:dist",
        "test:bdd",
        "test:bdd:pretty",
        "check",
    ]
    missing = [name for name in required if name not in scripts]
    assert not missing, f"Fehlende npm-Skripte: {', '.join(missing)}"
    assert scripts["test:bdd"] == "python3 -m behave", "test:bdd muss Behave ausfuehren."


@then("npm run check verkettet Format, Lint, Validate, Build, Dist-Validierung und BDD")
def step_check_chains_quality_gate(context):
    check_script = get_project(context).read_json("package.json").get("scripts", {}).get("check", "")
    expected_parts = [
        "npm run format:check",
        "npm run lint",
        "npm run validate",
        "npm run build",
        "npm run validate:dist",
        "npm run test:bdd",
    ]
    missing = [part for part in expected_parts if part not in check_script]
    assert not missing, f"npm run check enthaelt nicht alle Quality-Gate-Schritte: {', '.join(missing)}"


@then("GitHub Actions fuehren den kompletten Quality Gate aus")
def step_github_actions_quality_gate(context):
    ci = get_project(context).read_text(".github/workflows/ci.yml")
    pages = get_project(context).read_text(".github/workflows/pages.yml")
    assert_contains(ci, "npm run check", ".github/workflows/ci.yml")
    assert_contains(pages, "npm run check", ".github/workflows/pages.yml")
    assert_contains(ci, "Install Python dev tools", ".github/workflows/ci.yml")


@then("Dependabot aktualisiert npm, Python und GitHub Actions Abhaengigkeiten")
def step_dependabot_configured(context):
    config = get_project(context).read_text(".github/dependabot.yml")
    for ecosystem in ["npm", "pip", "github-actions"]:
        assert_contains(config, f"package-ecosystem: {ecosystem}", ".github/dependabot.yml")


@then("README dokumentiert den Behave Workflow")
def step_readme_documents_behave(context):
    readme = get_project(context).read_text("README.md")
    assert_contains(readme, "Behave", "README.md")
    assert_contains(readme, "Cucumber", "README.md")
    assert_contains(readme, "npm run test:bdd", "README.md")


@then("AGENTS dokumentiert Requirements und Behave Pflege")
def step_agents_documents_bdd(context):
    agents = get_project(context).read_text("AGENTS.md")
    assert_contains(agents, "Behave", "AGENTS.md")
    assert_contains(agents, "Requirements", "AGENTS.md")
    assert_contains(agents, "features/", "AGENTS.md")


@then("die Quality Dokumentation erklaert Behave Cucumber Tests")
def step_quality_docs_document_bdd(context):
    quality = get_project(context).read_text("docs/QUALITY_AND_CI.md")
    assert_contains(quality, "Behave", "docs/QUALITY_AND_CI.md")
    assert_contains(quality, "Cucumber", "docs/QUALITY_AND_CI.md")
    assert_contains(quality, "Anforderungen", "docs/QUALITY_AND_CI.md")



@then("der Scan-Flow nutzt Live-Kamera oder Bildfallback")
def step_scan_flow_has_camera_and_fallback(context):
    source = get_project(context).read_text("palette-app.js")
    template = get_project(context).read_text("templates/palette.html")
    assert_contains(template, 'id="scanButton"', "templates/palette.html")
    assert_contains(template, 'id="cameraScanner"', "templates/palette.html")
    assert_contains(source, "navigator.mediaDevices.getUserMedia", "palette-app.js")
    assert_contains(source, "triggerPhotoInput", "palette-app.js")
    assert_contains(source, "scannerFileFallback", "palette-app.js")


@then("die Farberkennung kann geschlossen werden und kehrt zur Farbkarte zurueck")
def step_scan_flow_can_be_closed(context):
    source = get_project(context).read_text("palette-app.js")
    template = get_project(context).read_text("templates/palette.html")
    styles = get_project(context).read_text("styles.css")
    assert_contains(template, 'id="scannerClose"', "templates/palette.html")
    assert_contains(template, 'id="scannerCancel"', "templates/palette.html")
    assert_contains(source, "closeCameraScanner", "palette-app.js")
    assert_contains(source, "scannerSessionId", "palette-app.js")
    assert_contains(source, "scannerCancel.addEventListener", "palette-app.js")
    assert_contains(styles, ".scanner-cancel", "styles.css")


@then("die App bewertet Tageslicht, Dunkelheit, Gelbstich und Schatten")
def step_scan_flow_assesses_light(context):
    source = get_project(context).read_text("palette-app.js")
    i18n = get_project(context).read_text("i18n.js")
    for token in ["assessLightQuality", "tooDark", "tooYellow", "shadow", "Tageslicht gut"]:
        assert_contains(source + i18n, token, "Scan-Quellen")


@then("die Messung nutzt mehrere Messpunkte im Kreis")
def step_scan_uses_multiple_points(context):
    source = get_project(context).read_text("palette-app.js")
    assert_contains(source, "SCAN_POINT_LAYOUT", "palette-app.js")
    assert_contains(source, "sampleGarmentColor", "palette-app.js")
    assert_contains(source, "averagePatch", "palette-app.js")
    assert_contains(source, "pointSamples", "palette-app.js")
    assert_contains(source, "SCAN_TARGET_RADIUS_RATIO", "palette-app.js")


@then("das Ergebnis zeigt Prozent, Helligkeit, Waerme und Klarheit")
def step_scan_result_has_percent_and_dimensions(context):
    source = get_project(context).read_text("palette-app.js")
    i18n = get_project(context).read_text("i18n.js")
    assert_contains(source, "fitScoreFromDelta", "palette-app.js")
    assert_contains(source, "${fit.score}%", "palette-app.js")
    for token in ["Helligkeit passt", "Wärme passt", "Klarheit passt"]:
        assert_contains(i18n, token, "i18n.js")


@then("die App zeigt die drei naechsten Farben aus dem Farbpass")
def step_scan_shows_three_nearest_palette_colors(context):
    source = get_project(context).read_text("palette-app.js")
    assert_contains(source, "findNearestColors(sampled, activePalette, 3)", "palette-app.js")
    assert_contains(source, "renderNearestPaletteMatches", "palette-app.js")
    assert_contains(source, "nearest-palette-chip", "palette-app.js")
    assert_contains(source, "scan.nearestThree", "palette-app.js")


@then("schlechte Bedingungen werden als unsicher gekennzeichnet")
def step_scan_is_honest_when_uncertain(context):
    source = get_project(context).read_text("palette-app.js")
    i18n = get_project(context).read_text("i18n.js")
    assert_contains(source, "result-fit-unsure", "palette-app.js")
    assert_contains(source, "confidenceMultiplier", "palette-app.js")
    assert_contains(source, "scan.verdict.unsure", "palette-app.js")
    assert_contains(i18n, "Unsicher – bitte neu prüfen", "i18n.js")
    assert_contains(i18n, "Ich bin bei diesem Foto nicht sicher", "i18n.js")


@then("die Farberkennung kann geschlossen werden und blendet Ergebnis und Vorschau aus")
def step_scan_result_can_be_closed(context):
    project = get_project(context)
    template = project.read_text("templates/palette.html")
    source = project.read_text("palette-app.js")
    css = project.read_text("styles.css")
    assert_contains(template, 'id="scanResultClose"', "templates/palette.html")
    assert_contains(template, 'id="scannerCancel"', "templates/palette.html")
    assert_contains(source, "function closeScanResult", "palette-app.js")
    assert_contains(source, "scanResultClose.addEventListener('click', closeScanResult)", "palette-app.js")
    assert_contains(source, "previewWrap.classList.add('hidden')", "palette-app.js")
    assert_contains(source, "result.className = 'result hidden'", "palette-app.js")
    assert_contains(source, "document.body.classList.remove('scan-result-open')", "palette-app.js")
    assert_contains(css, ".scan-result-close", "styles.css")
    assert_contains(css, ".scan-result-inline-close", "styles.css")


@then("der Splashscreen zeigt die App-Version in der untersten Zeile")
def step_splash_shows_version(context):
    project = get_project(context)
    template = project.read_text("templates/palette.html")
    index = project.read_text("index.html")
    css = project.read_text("styles.css")
    assert_contains(template, "splash-version", "templates/palette.html")
    assert_contains(index, "splash-version", "index.html")
    assert_contains(template, "__ESKYNA_APP_VERSION__", "templates/palette.html")
    assert_contains(css, ".splash-version", "styles.css")
    assert_contains(css, "bottom: calc(10px + env(safe-area-inset-bottom));", "styles.css")

