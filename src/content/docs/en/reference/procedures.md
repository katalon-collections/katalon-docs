---
title: Procedures
description: Concept and documentation for procedures such as loans, acquisitions, and conservation.
---

Alongside collection data (Objects, Entities, Places, Occurrences, Collections, Storage Locations), Katalon also manages **processes and transactions** around the holdings: loans, acquisitions, conservation, or intake review.

Such procedures are relevant daily in museums, archives, and libraries — for insurance, location management, reporting obligations, and institutional memory.

---

## What is a procedure?

A **Procedure** (internally: *Procedure*) describes a time-bounded process on one or more objects. It has:

- a **procedure type** (e.g. outgoing loan, conservation, acquisition)
- a **status** (`draft` → `active` → `completed` or `cancelled`)
- a **start and end date** (including the return deadline for loans)
- a **reference number** (for internal file numbers or external correspondence)
- **free metadata fields** (configurable via the schema engine)
- **links** to objects, entities, and places via the relation system

Procedures are **not Occurrences**. A historical exhibition or performance is an Occurrence; the loan agreement or transport for an exhibited object is a Procedure.

---

## Pre-configured procedure types

Katalon ships with six field-tested types:

| Type | Label | Typical scenario |
|---|---|---|
| `loan_out` | Outgoing loan | Own object goes to an external institution |
| `loan_in` | Incoming loan | External object comes in-house for exhibition |
| `acquisition` | Acquisition | Purchase, donation, transfer into the collection |
| `conservation` | Restoration / conservation | Conservation examination or treatment |
| `object_entry` | Intake review | Provisional acceptance for assessment or selection |
| `deaccession` | Deaccession | Disposal, sale, return, or deaccessioning |

In addition, any number of institution-specific procedure types can be created under **Configuration → Subtypes** for the *Procedures* type.

---

## Lifecycle and status

A procedure goes through fixed phases:

1. **Draft (`draft`):** planning the procedure. Mandatory fields may be incomplete.
2. **Active (`active`):** the procedure is underway (e.g. a loan is in transit, conservation is in progress).
3. **Completed (`completed`):** the action has ended, the object has returned or been permanently acquired.
4. **Cancelled (`cancelled`):** the procedure did not go ahead (e.g. a loan request was declined).

### Status changes on objects

When completing a procedure, Katalon suggests matching status changes for linked objects:
- For `loan_out`, the system suggests setting the collection status from *On loan* back to *Active*.
- For `acquisition`, the system suggests setting the collection status from *In progress* to *Active*.

The suggestion can be confirmed or left unchanged.

### Integrity rule for `loan_out`

Katalon ensures that an object cannot be part of two active outgoing loans (`loan_out`) at the same time. An attempt is blocked with a clear message.

---

## Schema fields for procedures

Each procedure type can be equipped with its own fields under **Configuration → Schemas**:
- For `conservation`: condition report, conservation goal, materials used, workshop notes.
- For `loan_out`: insurance value, transport conditions, conservation requirements, approval notes.
- For `acquisition`: purchase price, resolution number, funder, mode of acquisition.
