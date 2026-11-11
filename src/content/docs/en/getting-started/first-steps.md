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

### File attachments in the "File" field

:::note[Available from version 1.50.0]
:::

Files that are not digitised objects, such as a loan agreement, a programme booklet, or an interview video, are attached to a field of type **File**. The field must exist in the schema; see [File field type](/katalon-docs/en/administration/schema#file--file).

To attach files:

1. Save a new record first. Before its first save, the field shows the note "Save the record first before uploading files."
2. Choose **Select file** or drag files onto the field. If the field is repeatable, add more files with **Add file**.
3. The field shows the upload progress. Rejected files get a message with the reason, such as an unsupported file type or a file that is too large.
4. Save the record. Only then is the file linked to the record.

To view a file, click its name or the view icon. The preview shows PDFs with a scroll bar, images, and audio or video with playback controls. Use the download icon to save the file.

The remove icon only removes the file from the form. It takes effect when you save. After that, the file is no longer retrievable in the portal. It stays on the server until the operator cleans it up. The same applies to files that were uploaded but not saved.

The buttons are icons. Hovering over them shows their label, which screen readers also read out.

> **Screenshot planned: File field in the record form.**
> Show: field "Contract" with an uploaded PDF and a video that is currently uploading. Alt text: "File field in the record form with two attached files."

On the portal, the files of a public field appear as a list on the detail page.

## 5. Publish

Set the status to `public`. The record is then visible in the portal and in public API responses.
