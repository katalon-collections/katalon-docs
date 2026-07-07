---
title: Export-Mappings
---

# Katalon - Export-Mappings

## Worum es geht

Katalon soll Metadaten nicht nur erfassen, sondern auch in mehrere Zielmodelle exportieren können. Das gilt zuerst für OAI-PMH, später auch für komplexere Formate wie LIDO oder METS/MODS.

Die Kernidee ist bewusst generisch:

- Ein Feld aus `field_definitions` kann auf mehrere Exportziele gemappt werden.
- Ein Exportziel ist nicht direkt ein Formatname allein, sondern ein konkreter Zielpfad innerhalb eines Formats.
- Format-spezifische Sonderlogik bleibt im Export-Serializer, das Mapping selbst bleibt datengetrieben.

## Datenmodell

Die zentrale Tabelle ist `metadata_mappings`:

```sql
metadata_mappings (
    id UUID,
    field_definition_id UUID,
    format_key VARCHAR,
    target_path VARCHAR,
    settings JSONB,
    sort_order INT,
    is_enabled BOOLEAN,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
```

Wichtige Felder:

- `field_definition_id`: welches Schemafeld exportiert wird
- `format_key`: z. B. `oai_dc`, später `lido`, `metsmods`
- `target_path`: der konkrete Zielpfad, z. B. `dc:title`
- `settings`: freie Zusatzdaten für spätere Transformationen
- `is_enabled`: Mapping pro Instanz oder Feld deaktivierbar

Ein Feld kann mehrere Mappings haben, auch für dasselbe Format, solange die Zielpfade unterschiedlich sind.

## Aktuelle Formate

### `oai_dc`

Für OAI-PMH ist aktuell `oai_dc` aktiv. In der UI werden die 15 Dublin-Core-Elemente angeboten:

- `dc:title`
- `dc:creator`
- `dc:subject`
- `dc:description`
- `dc:publisher`
- `dc:contributor`
- `dc:date`
- `dc:type`
- `dc:format`
- `dc:identifier`
- `dc:source`
- `dc:language`
- `dc:relation`
- `dc:coverage`
- `dc:rights`

Wenn für einen Record-Typ mindestens ein `oai_dc`-Mapping existiert, benutzt der OAI-Serializer diese Konfiguration.
Wenn keine Mappings definiert sind, bleibt ein konservativer Fallback aktiv, damit bestehende Instanzen nicht brechen.

### `lido`

Der Tab ist bereits als Stub angelegt. Das Format nutzt dieselbe Mapping-Infrastruktur, aber die eigentliche Serialisierung ist noch nicht implementiert.

### `metsmods`

Auch dieser Tab ist nur vorbereitet. Ziel ist, später ein weiteres Exportprofil ohne neues UI-Konzept an dieselbe Mapping-Tabelle anzuhangen.

## UI-Verhalten

Die Mapping-Konfiguration sitzt im Admin im Schema-Editor direkt an der Felddefinition.

Warum dort:

- Das Mapping ist Teil der fachlichen Bedeutung eines Feldes.
- Admins arbeiten dort schon mit Label, Feldtyp, Wiederholbarkeit und Sichtbarkeit.
- Ein Extra-Screen würde dieselbe Feldliste erneut duplizieren.

Aktuelles Verhalten:

- Neue Felder müssen zuerst gespeichert werden.
- Gruppenfelder werden nicht direkt exportiert, nur ihre Subfelder.
- Pro Feld gibt es eine einfache Select-Logik für das aktive Format.
- `oai_dc` ist produktiv, die anderen Tabs zeigen nur den Platzhalter für spätere Erweiterungen.

## Serverseitige Verarbeitung

Der Export läuft in zwei Schritten:

1. Der API-Handler laedt die aktiven Mappings für den angefragten Format-Schluessel.
2. Der Serializer baut daraus das Ziel-XML.

Das ist wichtig:

- Mapping und XML-Struktur sind getrennt.
- Ein neues Format braucht nicht sofort eine neue UI.
- Ein neues Format braucht in erster Linie einen Serializer und ggf. neue Zielpfade.

## Werttransformation

Die erste Version arbeitet mit direkter Durchleitung:

- String-Werte werden als Text exportiert
- Wiederholbare Felder erzeugen mehrere Ziel-Elemente
- Dictionaries werden über ihren `value`- oder `label`-Inhalt aufgelöst

`settings` ist absichtlich frei gehalten, damit spätere Formate Transformationen wie Rollenfilter, Sprachfilter oder Template-Ausdruecke aufnehmen können, ohne die Tabelle zu wechseln.

## Designprinzipien

- Die Tabelle ist formatneutral.
- Das UI ist formatneutral.
- Das OAI-DC-Format ist nur der erste produktive Consumer.
- Spätere Formate sollen dieselbe Infrastruktur nutzen können, nicht eine zweite Sonderloesung.

## Praktische Konsequenz

Wenn später ein Museum LIDO aktivieren will, soll das moeglich sein, ohne das Schema-UI neu zu bauen. Dann kommt nur hinzu:

- ein neuer `format_key`
- ein Serializer
- ggf. ein neuer Satz an Zielpfaden und Validierungen

Die existierende Mapping-Tabelle und die Feld-UI bleiben gleich.
