---
title: "Portal Search"
---

The quick search at the top of the portal searches Objects, Entities, Places, and Occurrences together. On the results page, hits can be narrowed down further using the available facets. Every result card shows a small marker next to the title with the record's subtype (e.g. "Painting", "Person"); if the record has no subtype, the general record type is shown instead.

![Public portal search with facets by object type, subtype, and material](../../../../assets/screenshots/portal/suche-facetten.png)

:::note[Available from version 1.36.0]
Consistent subtype marker on result cards.
:::

Number fields set up as a facet are filtered as a range. Enter an exact value in **From** and **To**, or move the two sliders. One of the two bounds can be left empty; **All** removes the number range again.

Under **Advanced Search**, you first choose the desired result type. Public search fields can then be combined with **all** or **at least one**. For relation fields, conditions for linked records can be added. Up to two linking steps are possible, for example:

> Objects whose photographer was born before 1950 and whose place of birth is Bremen.

![Advanced search in the portal with conditions for linked records](../../../../assets/screenshots/portal/erweiterte-suche.png)

For fixed vocabulary fields, the permitted terms are offered as a selection. Free vocabulary fields suggest configured terms but still allow a custom value.

The results list uses the same page as the quick search. The search definition is preserved in the URL and can therefore be bookmarked or shared. For very broad relation conditions, the portal prompts you to narrow the search further.

## Setting up facets

Which facets are offered in the portal is set per record type in the admin settings under **Facets**. This requires that the field is output publicly. Whether it also appears in the detail view no longer matters.

![Configuration of search facets per record type in the admin settings](../../../../assets/screenshots/einstellungen/facetten-konfiguration.png)

:::note[Available from version 1.26.0]
Turning a facet on or off takes effect **immediately** — no rebuild of the search index is needed for that. Only when you change a field's visibility itself (**"Output publicly via APIs"** or detail view) does Katalon rebuild the search index in the background; for very large holdings this can take a few minutes (see [Managing Schemas](/katalon-docs/en/administration/schema/)).
:::

### Facet order

:::note[Available from version 1.42.0]
:::

Under **Order in the portal**, all active facets of a record type appear in one shared list, whether field, date, hierarchy or relation facets. Change the order by dragging or with the arrow buttons (keyboard accessible); it applies directly to the portal search. Facets on sub-fields of a group appear as "Group › Field".

### Date facets by decade, century or year

:::note[Available from version 1.42.0]
:::

For date fields (including fields inside groups), the option **Grouping as portal facet** in the field form sets whether the facet groups by **decade**, **century** or **year**. Values are sorted chronologically. A range such as "1905/1912" counts in every decade it covers; very long ranges (over 50 years) only count at their start and end so they do not flood the facet. Implausible years are ignored. Changing the grouping rebuilds the search index in the background.

### Hierarchical subject facets

:::note[Available from version 1.42.0]
:::

Fields that reference a hierarchical vocabulary appear in the portal as an expandable tree with counts. Selecting a broader term filters to all records with that term or any of its narrower terms.

### Relation facets

:::note[Available from version 1.42.0]
:::

Relation facets filter by linked records, restricted to specific relation types — for example postcards by "composer", or by a place linked as sending or receiving location. Set them up under **Settings → Facets → Relation facets → Add relation facet**:

- **Label** in German and English; a **key** used in search links is suggested from it.
- **Linked type** (entity, place, occurrence, collection or object) and **direction** (this record → linked, the reverse, or both).
- **Relation types** from the "relation_types" vocabulary; the types allowed for this combination of record types are offered. Several types can be combined into one facet.
- Optionally **Only subtypes**, e.g. to include only persons of a certain subtype.

The facet only shows public linked records. On portal detail pages, matching relations link directly to the filtered search. Adding or changing a relation facet rebuilds the search index of the record type in the background.
