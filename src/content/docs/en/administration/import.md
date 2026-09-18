---
title: "Katalon: Metadata and Media Import"
---

## Purpose

Metadata import is used for bulk-creating records from tabular or XML-based source data. Typical use cases:

- Migration from a legacy system (Excel lists, Access database CSV exports)
- Initial data entry of holdings from existing inventory tables
- Ingesting externally created metadata lists

The importer creates new records and can handle existing records according to the upsert strategy `skip`, `merge`, or `replace`.

The importer is available in the admin UI under **Importer**.

## Importing vocabularies

For controlled vocabularies, open the **Vocabularies** tab in the importer. First select the target vocabulary, then upload a CSV, TSV, or JSON file. For CSV and TSV, map the columns to **ID**, **Parent ID**, **Label**, or, for relation types, **Inverse direction**. A **dry run** shows the planned changes before the import writes them. Relation types are flat and have no parent ID.

---

## Supported formats

| Property | Details |
|---|---|
| File formats | CSV, TSV, Excel (.xlsx), XML |
| Character encoding | UTF-8 (with or without BOM) |
| Delimiter | Automatic detection: comma (`,`), semicolon (`;`), tab (`\t`), pipe (`\|`) |
| Header row | Required — the first row is interpreted as column names |
| Maximum total size | 500 MB per upload request (operator configuration `importer_max_upload_size_mb`); for multiple XML files, their sum counts |
| XML | Two-step flow: upload, then select the record element |

Delimiter detection analyzes the first 4 KB of the file and picks the most frequent character among the supported delimiters.

---

## Step by step: Upload → Mapping → Dry Run → Import

### Step 1: Upload

1. At the top of the importer, select the **target type** (Objects, Entities, Places, Occurrences). This determines which fields are available in the mapping step.
2. Drag and drop the file into the upload area, or click to select it.
3. After upload, the importer shows: the number of detected rows, a list of column headers, and a preview of the first five rows.

If the upload fails:
- The file, or the combined size of the jointly selected files, exceeds 500 MB → split the upload
- Unsupported file format → use CSV, TSV, Excel, or XML
- Encoding error → save the file as UTF-8

### Step 2: Mapping

Mapping determines which source selector corresponds to which Katalon field. For CSV and Excel, the selector is a column; for XML, it's an element path.

The mapping table shows:
- **Source selector**: column name or XML element path from the file
- **Example value**: content of the first data row in this column
- **Katalon field**: dropdown with all fields of the selected type

For each column, you can either choose a Katalon field or select **— ignore —**. Ignored columns are not imported.

Required fields are marked with a star (`*`) in the dropdown list.

Supported transformation steps per column:

- `split`
- `replace`
- `regex_extract`
- `trim`
- `vocab_map`
- `expression`

#### Cookbook: common transformations

The preview in the transformation dialog shows the first three values after each saved step. Always run a dry run first.

| Task | Setting or expression | Example |
|---|---|---|
| Remove whitespace | `trim` | `  Peter Mueller  ` → `Peter Mueller` |
| Split into multiple values | `split`, delimiter `;` | `Red; Blue` → two values |
| Reverse name order | With `expression`, choose **Example: reverse "Last name, First name"** | `Mueller, Peter` → `Peter Mueller` |
| Add a prefix | Expression `Inventory-${value}` | `42` → `Inventory-42` |
| Normalize spelling | `vocab_map` | `DE` → `German` |

Expressions run server-side during import. The name template expects exactly one comma; values without a comma remain unchanged.

#### Importing container fields

Container fields consist of repeatable entries with subfields. In the mapping dropdown, they appear as `Container → Subfield`, for example `Person → First name` and `Person → Last name`.

Assign source columns to the individual subfields. One container instance is created per import row:

| CSV column | Katalon field | Result |
|---|---|---|
| `firstname` | `Person → First name` | `{"person": [{"firstname": "Peter"}]}` |
| `lastname` | `Person → Last name` | `{"person": [{"firstname": "Peter", "lastname": "Mueller"}]}` |

Required subfields are checked by the dry run like other required fields. A single source column currently cannot be mapped to multiple subfields at once; split the data into separate columns beforehand instead.

Repeated XML subfields are merged positionally into multiple container instances. If the involved XML elements have different numbers of values, the dry run stops with an error instead of combining values incorrectly.

#### Auto-mapping

After upload, the importer attempts to automatically match columns, in the following priority:

1. **Exact:** The column name (after normalizing to lowercase and underscores) exactly matches the internal field name, or exactly matches a field's German label (case-insensitive).
2. **Synonym:** The column name appears in a fixed synonym list for common field names (e.g. `titel`, `objektbezeichnung` → `title`; `autor`, `urheber`, `künstler` → `creator`; `datum`, `jahr`, `datierung` → `date`).
3. **Fuzzy:** If no exact or synonym match remains, the importer searches for the most similar field (internal name or DE label) using Levenshtein distance.

Examples of automatic matching:

| CSV column | Matched to field | Via |
|---|---|---|
| `title` | Field with `name = "title"` | exact |
| `Titel` | Field with `label.de = "Titel"` | exact |
| `date-created` | Field with `name = "date_created"` (hyphen → underscore) | exact |
| `Autor` | Field with `name = "creator"` | synonym |
| `Titl` (typo) | Field with `name = "title"` | fuzzy |

Auto-mapping is a suggestion and can be corrected manually.

#### Media assignment for objects

For the **Objects** target type, a column or XML element containing image file names can additionally be selected. This media assignment is optional and not a metadata field. Repeated XML elements may contain multiple file names for the same object.

If the importer detects a matching selector such as `resourceID`, it shows a suggestion. The assignment is only applied once **use** is clicked or the selector is chosen in the selection field.

The image files are not uploaded yet. The metadata import initially only stores the assignment between object and file name. It is used later in the batch media import.

### Step 3: Dry run

The dry run checks the mapped data without saving anything.

**What is checked:**

| Check | Result on failure |
|---|---|
| Required fields mapped | Notice (warning) — not necessarily an error per row |
| Required field in a mapped column is empty | Error for the affected row |
| Row has no fields after mapping | Error — row is skipped |
| Selected media selector is missing | Error for the import |
| A file name belongs to multiple records | Error for the affected rows |

**Dry run output:**

- **Total rows**: total number of data rows in the file
- **Valid**: number of rows without errors
- **Errors**: number of rows with errors, with a detail table (row number + error message)
- **Notices**: warnings that don't necessarily mean an import error (e.g. unmapped required fields)
- **Preview**: the first five records in mapped form
- **Media assignment**: number of records with media, detected file names, records without file names, and conflicts

Rows with errors are skipped during the actual import. Only valid rows are imported.

The import button is only active if at least one valid row exists.

### Step 4: Import

The import starts a background process (Celery task). The admin UI shows the running status and updates automatically (polling every 1.5 seconds).

Possible states:
- **Running…** — the task is queued or in progress
- **Completed** — shows the number of created records and any errors
- **Failed** — shows the task's error message

Once finished, the person who started the import additionally receives an email with the summarized results, provided the operator has configured email sending.

Depending on the import option, the run may publish new records afterward.

If a media assignment was selected, the task stores the detected file names for newly created and updated objects. With the `skip` upsert strategy, existing metadata remains unchanged; media assignments are still added to the existing object. The result states the number of newly saved media references.

After the import: **New Import** resets the wizard.

### Uploading images afterward

After a metadata import with media assignment, **Upload Media** leads directly to the batch media import. Alternatively, the **Media** tab can be opened.

1. Select an image folder or a ZIP archive.
2. Start the batch import.
3. Katalon compares the file names with the stored media references and attaches the images to the matching objects.

Case and Unicode spelling are normalized for comparison. Folder components from the source file are not used for comparison. A file name must be uniquely assigned to one object within the import. Ambiguous or duplicate uploaded file names are reported and not automatically linked.

A CSV or TSV file remains available as a manual fallback. It uses the columns `filename` or `dateiname`, `object_id` or `objekt_id`, and optionally `media_type` or `medientyp`. Explicit CSV assignments take precedence; files not listed in the CSV can still be assigned via stored references or the legacy UUID convention.

A faulty mapping file stops the run: no images are imported, and Katalon does not automatically fall back to assignment via stored references or UUIDs. The reported mapping errors must be fixed first.

---

## What gets imported

New records are created with **status `draft`** by default. They are not visible in the public portal and can be published manually after review, or go live immediately after import via `auto_publish`.

Every field value is stored as a simple text value:
```json
{"title": [{"value": "Street in Marrakesh"}]}
```

`vocab_map` and other transformation steps can be used to normalize values before import.

---

## Column mapping — technical details

The mapping is a JSON structure of the form:

```json
{
  "Column name in CSV": "internal_field_name",
  "Titel": "title",
  "Datum": "date_created"
}
```

Columns mapped to an empty string, or not appearing in the mapping, are ignored.

---

## Limitations

| Limitation | Details |
|---|---|
| Supported metadata formats | CSV, TSV, Excel (.xlsx), and XML. |
| Max. 500 MB per upload request | Operator configuration `importer_max_upload_size_mb`, default 500 MB. For multiple XML files, their combined size must not exceed the limit. |
| Image files in a separate step | The assignment can be prepared during metadata import; the files are then uploaded in the Media tab. |
| Existing records | `skip`, `merge`, and `replace` are supported. With `skip`, media references can be added without changing metadata. |
| Status is always `draft` | New records start as `draft` by default, but can be published via `auto_publish`. |
| No character encoding conversion | The file must be in UTF-8. Latin-1 or Windows-1252 can cause character errors. |
