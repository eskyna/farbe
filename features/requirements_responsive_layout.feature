Feature: Responsives App-Layout
  Portrait und Landscape sollen die vorhandene Bildschirmflaeche elegant nutzen.

  Background:
    Given das Projekt wurde geladen

  Scenario: Farbkarte wechselt ihre Rasterung nach Ausrichtung
    Then Portrait zeigt die Farbkarte 4 breit und 6 hoch
    And Landscape zeigt die Farbkarte 6 breit und 4 hoch

  Scenario: Landscape-Header bleibt kompakt und einzeilig
    Then der Landscape-Header nutzt eine Zeile fuer Logo, ESKYNA Farbe und Palettenname
    And lange Headertexte werden im Landscape gekuerzt statt umzubrechen
    And die Header-Schrift bleibt Montserrat und ist nicht zu fett

  Scenario: Aktionsleiste bleibt bei drei Buttons lesbar
    Then Buttontexte duerfen mehrzeilig laufen
    And Installieren oder Aktualisieren nutzt im Bedarfsfall eine eigene volle Zeile
    And die Aktionslabels sind in Deutsch, Englisch und Russisch uebersetzt

