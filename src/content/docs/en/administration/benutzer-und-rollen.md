---
title: "Katalon – Users & Roles"
---

## Overview

:::note[Available from version 1.19.2]
:::

Katalon has a role-based access control system (RBAC). User accounts are set up for staff in the admin UI. Management happens under **Management → Users** and **Management → Users → Role Permissions**.

Only users with the `admin` or `superuser` role can create user accounts, assign roles, or adjust permissions.

---

## Roles at a glance

Katalon distinguishes five fixed roles:

| Role | Technical identifier | Description & typical audience |
|---|---|---|
| **Superuser** | `superuser` | Full access to all functions and records, bypasses all permission checks. Created automatically during initial installation. |
| **Administrator** | `admin` | Full access to holdings data, system configuration, schemas, form variants, vocabularies, import, API keys, and user management. |
| **Editor** | `editor` | Creating, editing, and deleting holdings data (Objects, Entities, Places, Occurrences, Procedures, Collections). No access to system or schema configuration. |
| **Cataloger** | `cataloger` | Ongoing entry and maintenance of holdings data. Permissions per record type configurable via the permissions matrix. |
| **Viewer** | `viewer` | **Read-only access** to the backend. Can view and search holdings data, but cannot create, edit, or delete records (`manage_content` does not apply). |

---

## Scope of the "Viewer" role

The `viewer` role suits:
- External or internal researchers who need access to the curatorial data in the backend.
- Staff in read-only mode (e.g. loans desk, direction, front-of-house) who need to look up records but must not accidentally change them.

**Permissions & restrictions:**
- **Holdings data:** Can view holdings data (Objects, Entities, Places, Occurrences, Procedures, Collections) and linked media.
- **No write access:** Buttons for creating new records, saving changes, deleting records, or adding/removing links are disabled or hidden.
- **No configuration access:** Menu items under *Configuration* (Schemas, Subtypes, Storage Locations, Form Variants, Vocabularies, Export, etc.) and *Management* (Users, Settings) are not visible to viewers.
- **Import / AI assistance:** No permission to start data or media imports, or to use write-capable AI completions.

---

## Fine-grained permissions (role permissions)

Under **Management → Users**, the **Role Permissions** button leads to the configuration matrix (`/admin/user-roles`).

Here, administrators can define for the `editor`, `cataloger`, and `viewer` roles, per record type (**Object**, **Entity**, **Place**, **Occurrence**, **Procedure**), which actions are allowed:

- **Read (`read`):** Query records of this type and open detail pages.
- **Create (`create`):** Create new records of this type.
- **Update (`update`):** Change existing records of this type or create snapshots.
- **Delete (`delete`):** Move records of this type to the trash or delete them.

> **Note:** Administrators (`admin`) and `superuser` always have full access to all record types; their permissions are not restricted by the matrix.

---

## Managing users

### Creating a new user
1. In the admin UI, select **Management → Users** from the left-hand menu.
2. Click **New User**.
3. Choose an email address, a secure password (at least 8 characters), and the desired role.
4. Click **Create**.

### Changing a role or deactivating an account
In the user list, the role of an existing user can be adjusted directly. Users can also be deactivated (login is blocked without deleting the account). For security reasons, you cannot demote your own account.
