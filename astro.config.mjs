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
					],
				},
				{
					label: 'Konfiguration & Erfassung',
					items: [
						{ label: 'Schema verwalten', slug: 'administration/schema' },
						{ label: 'Normdaten & Linked Data', slug: 'administration/normdaten' },
						{ label: 'Formularvarianten', slug: 'administration/formularvarianten' },
						{ label: 'Subtypen', slug: 'administration/subtypen' },
						{ label: 'Mehrsprachigkeit', slug: 'administration/mehrsprachigkeit' },
						{ label: 'Metadaten- & Medienimport', slug: 'administration/import' },
						{ label: 'Stapelbearbeitung', slug: 'administration/batch-bearbeitung' },
						{ label: 'Cookbook (Rezepte)', slug: 'administration/cookbook' },
					],
				},
				{
					label: 'Schnittstellen & Export',
					items: [
						{ label: 'Portal-Suche', slug: 'integration/portal-suche' },
						{ label: 'REST API', slug: 'integration/rest-api' },
						{ label: 'Linked Data Export (JSON-LD & RDF)', slug: 'integration/linked-data-export' },
						{ label: 'OAI-PMH Schnittstelle', slug: 'integration/oai-pmh' },
						{ label: 'Export-Mappings', slug: 'integration/export-mappings' },
					],
				},
				{
					label: 'Betrieb & Wartung',
					items: [
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
