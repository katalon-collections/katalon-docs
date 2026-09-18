---
title: Long-Term Preservation (Preservation Export)
description: Generate and download preservation packages in the BagIt standard (RFC 8493) with METS and PREMIS metadata per object.
---

Katalon can generate a standards-compliant preservation package for any object — a so-called **Bag** per [BagIt (RFC 8493)](https://www.rfc-editor.org/rfc/rfc8493) with checksums, structural metadata (METS), preservation events (PREMIS), and descriptive metadata (Dublin Core). Such packages can be handed over to archives and trusted digital repositories.

:::note[Available from version 1.26.0]
The preservation export is triggered manually per object and downloaded as a ZIP file.
:::

## Generating a package

1. Open the object in the edit form.
2. In the header of the media card (right side, download icon), click **Generate Preservation Package**.
3. The ZIP file is generated and downloaded in the browser.

The export always includes all media of the object — including those not publicly visible in the portal.

## Package structure

```
bag/
├── bagit.txt                  # BagIt version and encoding (RFC 8493)
├── bag-info.txt               # Package info (date, software, external identifier)
├── manifest-sha256.txt        # SHA-256 checksums of all files
└── data/
    ├── metadata/
    │   ├── descriptive.xml    # Dublin Core, from the published oai_dc mapping
    │   ├── mets.xml           # METS: file groups master/derivatives with checksums
    │   └── premis.xml         # PREMIS: preservation events from the audit log
    └── files/
        ├── master/            # Original files (masters)
        └── derivatives/       # Derived files (pyramid TIFF for IIIF)
```

## Notes

- **Descriptive metadata** comes from the published oai_dc export mapping (see [Export Mappings](export-mappings/)). Without a published mapping, `descriptive.xml` contains a minimal record (title and identifiers).
- **Preservation events** (creation, modification, publication, media upload) are mapped from the object's audit log as PREMIS events.
- **Derived files** (derivatives) are only included if present.
- This export is a first, manually triggered building block. Server-side delivery targets (SFTP, S3, REST endpoints) and automated batch exports are planned for later versions.
