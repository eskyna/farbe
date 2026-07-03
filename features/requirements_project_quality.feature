Feature: Professionelle Projektqualitaet und Agenten-Wartbarkeit
  Das Projekt soll mit klaren Quality Gates, CI und dokumentierten Requirements weiterentwickelt werden koennen.

  Background:
    Given das Projekt wurde geladen

  Scenario: Lokale Quality Gates sind als npm-Skripte verfuegbar
    Then package.json enthaelt Format, Lint, Validate, Build und BDD Skripte
    And npm run check verkettet Format, Lint, Validate, Build, Dist-Validierung und BDD

  Scenario: CI und Dependabot sichern das Projekt ab
    Then GitHub Actions fuehren den kompletten Quality Gate aus
    And Dependabot aktualisiert npm, Python und GitHub Actions Abhaengigkeiten

  Scenario: Dokumentation hilft Menschen und KI-Agenten
    Then README dokumentiert den Behave Workflow
    And AGENTS dokumentiert Requirements und Behave Pflege
    And die Quality Dokumentation erklaert Behave Cucumber Tests

