Feature: Kundinnentaugliche Farberklaerungen
  Farben sollen nicht nur angezeigt, sondern mit Stilwissen und Kombinationshilfe erklaert werden.

  Background:
    Given das Projekt wurde geladen

  Scenario Outline: Jede Farbe wird in jeder Sprache erklaert
    When die App-Sprache "<sprache>" aktiv ist
    Then jede Farbe auf jeder Farbkarte hat einen Farbnamen in "<sprache>"
    And jede Farbe auf jeder Farbkarte hat Stilwissen und Kombinationshilfe in "<sprache>"
    And keine Farbkarte wiederholt Farbnamen in "<sprache>"
    And die Vollbild-Farbansicht zeigt Farbnamen, Stilwissen und Kombinationen

    Examples:
      | sprache |
      | de      |
      | en      |
      | ru      |

  Scenario: Die Farbpruefung spricht Kundinnen statt Technikerinnen an
    Then der Button zum Hochladen heisst "Farbe pruefen"
    And die Ergebnisansicht zeigt keine technischen Abstandswerte
    And die Ergebnisansicht verwendet freundliche Passungsstufen
    And die gemessene Farbe und der naechste Palettenton sind fuer Erklaerungen antippbar

