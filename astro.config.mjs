// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://katalon-collections.github.io',
	base: '/katalon-docs',
	integrations: [
		starlight({
			title: 'Katalon Docs',
			description: 'Dokumentation für Katalon, das Open-Source Metadata Management System für GLAM.',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/katalon-collections/katalon' }],
			sidebar: [
				{
					label: 'Loslegen',
					items: [
						{ label: 'Überblick', slug: 'index' },
						{ label: 'Über Katalon Collections', slug: 'ueber' },
						{ label: 'Installation', slug: 'getting-started/installation' },
						{ label: 'Erste Schritte', slug: 'getting-started/first-steps' },
						{ label: 'Eigene Sammlung einrichten', slug: 'getting-started/eigene-sammlung' },
					],
				},
				{
					label: 'Bestandsverwaltung',
					items: [
						{ label: 'Sammlungen & Bestände', slug: 'administration/sammlungen' },
						{ label: 'Lagerorte', slug: 'administration/lagerorte' },
						{ label: 'Vorgänge (Leihverkehr & Restaurierung)', slug: 'reference/procedures' },
						{ label: 'Arbeitslisten', slug: 'administration/arbeitslisten' },
					],
				},
				{
					label: 'Konfiguration & Erfassung',
					items: [
						{ label: 'Schema verwalten', slug: 'administration/schema' },
						{ label: 'Vokabulare verwalten', slug: 'administration/vokabulare' },
						{ label: 'Normdaten & Linked Data', slug: 'administration/normdaten' },
						{ label: 'Formularvarianten', slug: 'administration/formularvarianten' },
						{ label: 'Subtypen', slug: 'administration/subtypen' },
						{ label: 'Mehrsprachigkeit', slug: 'administration/mehrsprachigkeit' },
						{ label: 'Metadaten- & Medienimport', slug: 'administration/import' },
						{ label: 'Stapelbearbeitung', slug: 'administration/batch-bearbeitung' },
						{ label: 'Datensatz sperren', slug: 'administration/datensatz-sperren' },
						{ label: 'Statische Seiten', slug: 'administration/statische-seiten' },
						{ label: 'Banner', slug: 'administration/banner' },
						{ label: 'Cookbook (Rezepte)', slug: 'administration/cookbook' },
						{ label: 'Benutzer & Rollen', slug: 'administration/benutzer-und-rollen' },
					],
				},
				{
					label: 'Schnittstellen & Export',
					items: [
						{ label: 'Portal-Suche', slug: 'integration/portal-suche' },
						{ label: 'REST API', slug: 'integration/rest-api' },
						{ label: 'Linked Data Export (JSON-LD & RDF)', slug: 'integration/linked-data-export' },
						{ label: 'SPARQL-Endpoint (Oxigraph)', slug: 'integration/sparql' },
						{ label: 'OAI-PMH Schnittstelle', slug: 'integration/oai-pmh' },
						{ label: 'Export-Mappings', slug: 'integration/export-mappings' },
						{ label: 'Langzeitarchivierung', slug: 'integration/preservation-export' },
					],
				},
				{
					label: 'Betrieb & Wartung',
					items: [
						{ label: 'Einstellungen', slug: 'administration/einstellungen' },
						{ label: 'Portal-Themes & Erweiterungen', slug: 'administration/portal-themes' },
						{ label: 'Audit-Log', slug: 'administration/audit-log' },
						{ label: 'Produktionsbetrieb', slug: 'administration/production' },
						{ label: 'Updates & Datenpflege', slug: 'administration/upgrading' },
						{ label: 'Serverumzug', slug: 'administration/serverumzug' },
					],
				},
				{
					label: 'Referenz',
					items: [
						{ label: 'Feldtypen', slug: 'reference/field-types' },
					],
				},
			],
		}),
	],
});
