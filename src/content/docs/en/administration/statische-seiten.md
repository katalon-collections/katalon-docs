---
title: Static Pages
description: Manage editorial pages like FAQ, imprint, or about-the-collection in the portal.
---

Static pages are freely editable text pages in the public portal — such as FAQ, imprint, privacy policy, or "About the collection". They are independent of the seven core types and are managed separately.

Management happens in the admin UI under **Configuration → Static Pages**.

---

## Creating a page

1. Click **New page**.
2. Assign a **slug** — the URL path in the portal, e.g. `imprint`. The slug cannot be changed after creation.
3. Enter title and content for the configured languages. German is required, other languages are optional.
4. **Content** is entered as **Markdown** (headings, lists, links, bold, etc.) and rendered as formatted text in the portal.
5. **Save**.

A newly created page is **unpublished** (draft) by default and not yet visible in the portal.

---

## Publishing and linking

| Field | Meaning |
|---|---|
| **Published** | Makes the page visible in the portal. Unpublished pages are only visible in the admin UI (marked "Draft" in the list). |
| **Link in portal** | Determines whether and where a link to the page appears automatically: **Header** (main navigation), **Footer**, or **No link** (the page is only reachable via its direct URL, e.g. for linked landing pages). |
| **Order** | Sort position among multiple pages in the same link location (header or footer). |

A published page is reachable in the portal at `/page/<slug>`, regardless of whether a navigation link is set.

---

## Deleting

The trash button in the page list deletes a page irrevocably, including all language versions. There is no snapshot or restore function for static pages.
