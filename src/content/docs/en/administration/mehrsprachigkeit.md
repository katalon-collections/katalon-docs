---
title: "Katalon – Multilingual Support"
---

## Purpose

Katalon supports multiple languages on three levels:

1. **Labels** (field names, subtypes, form variants, vocabulary terms) – a separate text per language.
2. **Translatable field values** – a field (e.g. "Description") can hold a German and an English text.
3. **Portal interface** – the public catalog has a language switcher.

The configurable languages apply globally to the whole instance, not per field.

---

## Configuring the language list

Under **Settings → Languages** the list of supported languages is maintained (ISO 639-1 codes, comma-separated, e.g. `de, en, fr`).

- **First language = primary language.** It is the fallback language: if a text is missing in the displayed language, the primary language is used instead.
- Changes take effect immediately on all label input fields (schema, subtypes, vocabularies, form variants) and on the translation form.
- Default: `de, en`.

---

## Maintaining labels in multiple languages

Everywhere labels are maintained, **one input field per configured language** appears:

- **Schema** (field definitions): "Label DE", "Label EN", …
- **Subtypes**
- **Form variants** (display name)
- **Vocabularies** (term label, plus inverse direction for relation types)

There are no more hard-wired "DE/EN-only" fields; the number of input fields follows the language list.

---

## Translatable field values ("Description" in DE and EN)

### Marking a field as translatable

In the schema editor, **text** and **rich-text fields** (non-repeatable) have the **"Multilingual"** checkbox.

Only these field types are translatable:

| Translatable | Not translatable |
|---|---|
| Text, Rich text | Relation, Date, Number, Boolean, Vocabulary, Authority data, PID, Container fields |
| – | Repeatable fields |

For other field types, the editor shows the notice: *"This field type is not translatable (text/rich-text only, non-repeatable)."*

### Entering values

In the record form, a translatable field first shows only the primary language:

```
DE  [German description………………………………]  [+ EN]
```

- **+ EN** (or + FR, …) reveals the input for additional languages.
- The placeholder shows the label in the respective language (e.g. "Description").
- Already-filled languages remain visible; each added language has an **×** to remove it.

One object per language is stored, e.g. `{"de": "Deutsche Beschreibung", "en": "English description"}`.

### AI-assisted translation

When AI assistance is enabled, Katalon can generate a translation proposal for a single translatable field from the already entered primary language into a missing target language.

- In the schema editor, in addition to **"Multilingual"**, the field must also have **"Enable AI-assisted translation"** turned on — configurable per field.
- In the form, the translate trigger next to the respective language opens a dialog showing the current source-language value and the AI suggestion side by side. The suggestion can be freely edited before it is applied.
- Requirement: AI assistance is enabled globally, and both source and target language are among the instance's configured languages.
- Every applied AI translation is logged in the audit log (see [Audit Log](audit-log)).

:::note[Available from version 1.36.0]
:::

---

## Portal display

The public catalog shows translatable content in the **active language** with fallback:

- Language selection order: URL parameter `?lang=` → saved choice → browser language → primary language.
- The language switcher sits at the top right of the header.
- If a text is missing in the active language, Katalon falls back to primary language → German → first available language.
- Vocabulary terms in fields of type **Vocabulary** also show the label in the active language on the detail page instead of a fixed default label.

:::note[Available from version 1.36.0]
:::

---

## Adding a new language

1. **Admin → Settings → Languages**: add the language code (e.g. `de, en, fr`).
2. **Portal translations**: In the source code, copy `frontend/portal/src/i18n/locales/en.ts` to `fr.ts`, translate the values, and register it in `i18n/index.ts`.

Afterwards the label input fields and the portal switcher automatically appear in the new language.

---

## Limitations

- **Repeatable fields** and **structured field types** (Relation, Date, Number, …) are deliberately not translatable – they are language-independent.
- **Primary field `title`/`name`** (page title, search hits, cards) is not translated; it is designed as a unique display name, not as multilingual content.
- **Search index**: full-text search currently indexes all language variants together; language-specific analyzers are not implemented.
- **CSV importer**: the column mapping (`label:de`/`label:en`) remains limited to German/English.
