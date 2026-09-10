---
title: Langzeitarchivierung (Preservation Export)
description: Preservation Packages im BagIt-Standard (RFC 8493) mit METS- und PREMIS-Metadaten pro Objekt erzeugen und herunterladen.
---

Katalon kann für jedes Objekt ein standardkonformes Preservation Package erzeugen — ein sogenannter **Bag** nach [BagIt (RFC 8493)](https://www.rfc-editor.org/rfc/rfc8493) mit Prüfsummen, strukturellen Metadaten (METS), Bewahrungsereignissen (PREMIS) und beschreibenden Metadaten (Dublin Core). Solche Pakete können an Archive und Trusted Digital Repositories übergeben werden.

:::note[Verfügbar ab Version 1.26.0]
Der Preservation Export wird pro Objekt manuell ausgelöst und als ZIP-Datei heruntergeladen.
:::

## Paket erzeugen

1. Öffnen Sie das Objekt im Bearbeitungsformular.
2. Klicken Sie im Kopf der Medien-Karte (rechts, Download-Symbol) auf **Preservation Package erzeugen**.
3. Die ZIP-Datei wird erzeugt und im Browser heruntergeladen.

Der Export umfasst immer alle Medien des Objekts — auch solche, die im Portal nicht öffentlich sichtbar sind.

## Aufbau des Pakets

```
bag/
├── bagit.txt                  # BagIt-Version und Encoding (RFC 8493)
├── bag-info.txt               # Paket-Infos (Datum, Software, Externer Identifikator)
├── manifest-sha256.txt        # SHA-256-Prüfsummen aller Dateien
└── data/
    ├── metadata/
    │   ├── descriptive.xml    # Dublin Core, aus dem veröffentlichten oai_dc-Mapping
    │   ├── mets.xml           # METS: Dateigruppen Master/Derivate mit Prüfsummen
    │   └── premis.xml         # PREMIS: Bewahrungsereignisse aus dem Audit-Log
    └── files/
        ├── master/            # Originaldateien (Masters)
        └── derivatives/       # Abgeleitete Dateien (Pyramid-TIFF für IIIF)
```

## Hinweise

- **Beschreibende Metadaten** stammen aus dem veröffentlichten oai_dc-Export-Mapping (siehe [Export-Mappings](export-mappings/)). Ohne veröffentlichtes Mapping enthält `descriptive.xml` einen minimalen Datensatz (Titel und Identifikatoren).
- **Bewahrungsereignisse** (Anlage, Änderung, Veröffentlichung, Medien-Upload) werden aus dem Audit-Log des Objekts als PREMIS-Events abgebildet.
- **Abgeleitete Dateien** (Derivate) werden nur aufgenommen, wenn sie vorhanden sind.
- Der Export ist ein erster, manuell ausgelöster Baustein. Serverseitige Ablageziele (SFTP, S3, REST-Endpoints) und automatisierte Batch-Exporte sind für spätere Versionen vorgesehen.
