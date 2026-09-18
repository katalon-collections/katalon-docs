---
title: First Steps
description: The minimal path from an empty Katalon to your first public record.
---

## 1. Sign In

Open the admin interface and sign in with the automatically created admin account.

```text
http://localhost/admin/
```

## 2. Create a Schema

In the **Schemas** area, first create fields for a record type, for example for `object`:

- `title` as a text field
- `description` as rich text or plain text
- `date` as a date field
- `rights` as a text or vocabulary field

Fields can be marked required, repeatable, searchable, facetable, and multilingual-labeled.

## 3. Enter a Record

Create a new record in the **Objects** area. Drafts may be incomplete. For public records, required fields and visibility rules apply.

## 4. Upload Media

Media can be uploaded for objects. Katalon generates IIIF-capable image data and a manifest for the portal viewer from it.

## 5. Publish

Set the status to `public`. The record is then visible in the portal and in public API responses.
