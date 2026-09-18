---
title: Managing Vocabularies
description: Create and maintain controlled vocabularies, hierarchical term lists, and relation-type vocabularies.
---

Controlled vocabularies are reusable term lists referenced by schema fields of type `vocab`/`vocab_free` (see [Managing Schemas](schema#vocab--vocabulary-field)) or, as a special case, that define the allowed relation types between records.

Management happens in the admin UI under **Configuration → Vocabularies**.

---

## Creating a vocabulary

1. Click **New vocabulary**.
2. Assign a **name** (technical identifier, e.g. `materials`).
3. Choose the **type**:
   - **Term vocabulary** (`term`) — an ordinary term list, e.g. materials, genres, techniques.
   - **Relation-type vocabulary** (`relation`) — defines the named relationship types between records (e.g. "Author of", "Depicted in"). See below.
4. Enable **Hierarchical** if terms should have parent/child relationships (broader/narrower, e.g. a material taxonomy). Not available for relation-type vocabularies.
5. Optionally set a **canonical URI** (base or ConceptScheme URI, e.g. `http://vocab.getty.edu/aat/`) for the Linked Data connection.

On initial installation, the system creates two fixed system vocabularies: `relation_types` (relation types) and `media_types` (media types). They cannot be deleted, but their terms can be edited as usual.

---

## Maintaining terms

Per term, the following can be captured:

| Field | Meaning |
|---|---|
| **Term** | Technical value, stored in records. |
| **Label** | Language-specific display designation (one per configured language). |
| **Parent term** | Only for hierarchical vocabularies — places the term in the tree structure. |
| **URI** | Canonical identifier URI of the term (e.g. `http://vocab.getty.edu/aat/300026816`), linked directly when set. |
| **Cross-concordances (exactMatch)** | List of external match URIs (e.g. Wikidata and GND URIs for the same term), comma-separated or one per line. |
| **Custom fields** | If fields for this vocabulary's `vocabulary_term` target type were defined under **Configuration → Schemas**, they additionally appear in the term form. |

Terms can be created individually via **New term**, or imported in bulk via CSV/TSV/JSON or SKOS (Turtle, RDF/XML, JSON-LD, N-Triples) in the **Import** tab — see [Authority Data & Linked Data](normdaten#vocabularies--skos-linked-data) for the SKOS import and details on URIs and cross-concordances.

---

## Relation-type vocabularies

For the relation-type vocabulary (`relation_types`), each term additionally gets:

- **Inverse direction (inverse label)** — the designation from the reverse perspective (e.g. "Author of" ↔ "Written by").
- **Target types (applies_from / applies_to)** — which primary types are allowed as the source or target of the relationship (e.g. only Entity → Object).

These terms are then available for selection on relation fields (field type `relation`) in the schema editor — see [Relations → link to another record](schema).

---

## Deleting and integrity protection

A vocabulary can only be deleted once no active schema field references it anymore.

:::note[Available from version 1.34.0]
When deleting individual terms, Katalon automatically checks whether the term is still used in records (objects, entities, places, procedures, etc.) or as a parent term in the vocabulary hierarchy:

- **Unused terms:** Can be deleted directly.
- **Used terms:** Katalon blocks accidental deletion and shows the exact number of affected records. Two options are available:
  1. **Reassign (choose a replacement term):** All occurrences in existing records are automatically migrated to another term of the same vocabulary, which you select.
  2. **Delete anyway (force):** The term is removed from the vocabulary. In existing records, the stored value (`{id, label}`) is kept as a historical entry. In the data-entry form, the value is marked with a **"Term deleted"** badge. Such records can still be opened and saved without validation errors.
:::
