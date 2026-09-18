---
title: "Katalon – Subtypes"
---

## Overview

Subtypes divide a record type into domain-specific variants – for example person and organization for entities, or outgoing loan and acquisition for procedures. Management happens in the admin UI under **Configuration → Subtypes**.

Only users with the `admin` or `superuser` role see this menu item and can create, change, or delete subtypes.

Subtypes exist for Objects, Entities, Places, Occurrences, Procedures, Collections, and Storage Locations. For Objects, Entities, Places, Occurrences, Collections, and Storage Locations, no subtype is pre-configured – institutions create them as needed. For Procedures, six types already exist: `loan_out` (outgoing loan), `loan_in` (incoming loan), `acquisition`, `conservation`, `object_entry` (incoming inspection), and `deaccession`.

A record without a configured subtype uses only the primary type's schema. As soon as subtypes exist for a primary type, a new record (except in draft status) must select one of them.

---

## Creating subtypes

1. Open the admin UI, select **Subtypes** under **Configuration** in the left menu.
2. Select the primary type at the top (Objects, Entities, Places, Occurrences, Procedures, Collections, Storage Locations).
3. Click **New subtype**.
4. Enter German and English labels. An internal-name suggestion is automatically derived from these (e.g. "Person" becomes `person`).
5. Optionally add a description of institutional usage – helpful for other staff who will use the same subtype later.
6. Adjust the suggested internal name if needed (e.g. `person`, `organization`). The internal name is a required field and cannot be changed after saving, since it serves as a stable key for records and field definitions.
7. Optionally mark it as the **default subtype** – this is preselected when creating new records and during quick entry.
8. Save.

---

## What subtypes are used for

- **Restricting fields**: In schema management (**Configuration → Schemas**), a field can be restricted to a `target_subtype`. Without this restriction, a field applies to all subtypes of the primary type. See [Schema Management](/katalon-docs/en/administration/schema#subtype-fields) for details.
- **Restricting form variants**: Form variants can also be configured per subtype, see [Form Variants](/katalon-docs/en/administration/formularvarianten).
- **Restricting relation search**: A relation field can specify a fixed target subtype. The search for target records and quick entry are then restricted to this subtype.
- **List filters**: A subtype filter appears in the record list as soon as subtypes are configured for the respective primary type. Selecting a subtype additionally reveals its subtype-specific list columns.

---

## Deleting subtypes

A subtype can be deleted as long as no record uses it. If at least one record uses the subtype, Katalon blocks deletion.

Deleting an unused subtype deactivates its subtype-specific field definitions and form variants (soft delete, as with deleting individual fields). Records of other subtypes are not affected.

This also applies to the six pre-configured procedure types: as long as no procedure uses one of the six types, it can be deleted like a custom subtype.

---

## Subtypes for procedures

Procedures use the same subtype mechanism as the four holdings types. In addition to the six pre-configured types, institution-specific procedure types can be created, for example for local workflows with no equivalent in the standard list.

Only the technical type `loan_out` has a built-in business rule: Katalon prevents an object from being part of two active procedures of this type at the same time. Custom procedure types have no implicit automation – the holding status of a linked object is only suggested when a procedure is completed, never set automatically. For details on the procedures concept, see [Procedures Concept Paper](/katalon-docs/en/reference/procedures).
