---
title: First Steps
description: The minimal path from an empty Katalon to your first public record.
---

## 1. Sign In

Open the admin interface and sign in with the automatically created admin account.

```text
http://localhost/admin/
```

## Overview after signing in

:::note[Available from version 1.42.0]
:::

**Overview** is the new admin start screen. It groups recently edited records, your editing locks, working sets, upcoming procedure deadlines and draft records. Links open the corresponding record or workspace; your own locks can be released here. Your permissions determine which data you can see.

Administrators also see team activity, active locks and system health. The overview settings menu lets you show or hide sections; the choice is stored in this browser.

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
