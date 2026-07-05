Feature: Farbkarten-Inhalte und Sprache
  Die Farbkarte soll fuer alle Kundinnen vollstaendig, uebersetzt und installierbar ausgeliefert werden.

  Background:
    Given das Projekt wurde geladen
    And der Dist-Build existiert

  Scenario: Alle Farbkarten sind vollstaendig
    Then gibt es genau 12 Farbkarten
    And jede Farbkarte hat 24 Farben
    And jede Farbkarte ist im Quellmodell 4 Farben breit und 6 Farben hoch
    And jede generierte Farbkarte besitzt HTML, Manifest und Icons

  Scenario Outline: Die App spricht die Sprache der Kundin
    When die App-Sprache "<sprache>" aktiv ist
    Then sind die wichtigsten UI-Texte in "<sprache>" vorhanden
    And ein Palettenname wird in "<sprache>" uebersetzt
    And personalisierte Seitentitel sind in "<sprache>" vorhanden

    Examples:
      | sprache |
      | de      |
      | en      |
      | ru      |

