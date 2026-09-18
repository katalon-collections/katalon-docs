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
			defaultLocale: 'root',
			locales: {
				root: { label: 'Deutsch', lang: 'de' },
				en: { label: 'English', lang: 'en' },
			},
			sidebar: [
				{
					label: 'Loslegen',
					translations: { en: 'Getting Started' },
					items: [
						{ label: 'Überblick', translations: { en: 'Overview' }, slug: 'index' },
						{ label: 'Über Katalon Collections', translations: { en: 'About Katalon Collections' }, slug: 'ueber' },
						{ label: 'Systemarchitektur', translations: { en: 'System Architecture' }, slug: 'ueber/architektur' },
						{ label: 'Installation', translations: { en: 'Installation' }, slug: 'getting-started/installation' },
						{ label: 'Erste Schritte', translations: { en: 'First Steps' }, slug: 'getting-started/first-steps' },
						{ label: 'Eigene Sammlung einrichten', translations: { en: 'Setting Up Your Own Collection' }, slug: 'getting-started/eigene-sammlung' },
					],
				},
				{
					label: 'Bestandsverwaltung',
					translations: { en: 'Collection Management' },
					items: [
						{ label: 'Sammlungen & Bestände', translations: { en: 'Collections & Holdings' }, slug: 'administration/sammlungen' },
						{ label: 'Lagerorte', translations: { en: 'Storage Locations' }, slug: 'administration/lagerorte' },
						{ label: 'Vorgänge (Leihverkehr & Restaurierung)', translations: { en: 'Procedures (Loans & Conservation)' }, slug: 'reference/procedures' },
						{ label: 'Arbeitslisten', translations: { en: 'Work Lists' }, slug: 'administration/arbeitslisten' },
					],
				},
				{
					label: 'Konfiguration & Erfassung',
					translations: { en: 'Configuration & Data Entry' },
					items: [
						{ label: 'Schema verwalten', translations: { en: 'Managing Schemas' }, slug: 'administration/schema' },
						{ label: 'Vokabulare verwalten', translations: { en: 'Managing Vocabularies' }, slug: 'administration/vokabulare' },
						{ label: 'Normdaten & Linked Data', translations: { en: 'Authority Data & Linked Data' }, slug: 'administration/normdaten' },
						{ label: 'Formularvarianten', translations: { en: 'Form Variants' }, slug: 'administration/formularvarianten' },
						{ label: 'Subtypen', translations: { en: 'Subtypes' }, slug: 'administration/subtypen' },
						{ label: 'Mehrsprachigkeit', translations: { en: 'Multilingual Support' }, slug: 'administration/mehrsprachigkeit' },
						{ label: 'Metadaten- & Medienimport', translations: { en: 'Metadata & Media Import' }, slug: 'administration/import' },
						{ label: 'Stapelbearbeitung', translations: { en: 'Batch Editing' }, slug: 'administration/batch-bearbeitung' },
						{ label: 'Datensatz sperren', translations: { en: 'Locking Records' }, slug: 'administration/datensatz-sperren' },
						{ label: 'Statische Seiten', translations: { en: 'Static Pages' }, slug: 'administration/statische-seiten' },
						{ label: 'Banner', translations: { en: 'Banner' }, slug: 'administration/banner' },
						{ label: 'Cookbook (Rezepte)', translations: { en: 'Cookbook (Recipes)' }, slug: 'administration/cookbook' },
						{ label: 'Benutzer & Rollen', translations: { en: 'Users & Roles' }, slug: 'administration/benutzer-und-rollen' },
					],
				},
				{
					label: 'Schnittstellen & Export',
					translations: { en: 'Interfaces & Export' },
					items: [
						{ label: 'Portal-Suche', translations: { en: 'Portal Search' }, slug: 'integration/portal-suche' },
						{ label: 'REST API', translations: { en: 'REST API' }, slug: 'integration/rest-api' },
						{ label: 'Linked Data Export (JSON-LD & RDF)', translations: { en: 'Linked Data Export (JSON-LD & RDF)' }, slug: 'integration/linked-data-export' },
						{ label: 'SPARQL-Endpoint (Oxigraph)', translations: { en: 'SPARQL Endpoint (Oxigraph)' }, slug: 'integration/sparql' },
						{ label: 'OAI-PMH Schnittstelle', translations: { en: 'OAI-PMH Interface' }, slug: 'integration/oai-pmh' },
						{ label: 'Export-Mappings', translations: { en: 'Export Mappings' }, slug: 'integration/export-mappings' },
						{ label: 'Langzeitarchivierung', translations: { en: 'Long-Term Preservation' }, slug: 'integration/preservation-export' },
					],
				},
				{
					label: 'Betrieb & Wartung',
					translations: { en: 'Operations & Maintenance' },
					items: [
						{ label: 'Einstellungen', translations: { en: 'Settings' }, slug: 'administration/einstellungen' },
						{ label: 'Portal-Themes & Erweiterungen', translations: { en: 'Portal Themes & Extensions' }, slug: 'administration/portal-themes' },
						{ label: 'Audit-Log', translations: { en: 'Audit Log' }, slug: 'administration/audit-log' },
						{ label: 'Produktionsbetrieb', translations: { en: 'Production Operation' }, slug: 'administration/production' },
						{ label: 'Updates & Datenpflege', translations: { en: 'Updates & Data Maintenance' }, slug: 'administration/upgrading' },
						{ label: 'Serverumzug', translations: { en: 'Server Migration' }, slug: 'administration/serverumzug' },
					],
				},
				{
					label: 'Entwicklung & Mitwirken',
					translations: { en: 'Development & Contributing' },
					items: [
						{ label: 'Erste Schritte für Entwickler', translations: { en: 'Getting Started for Developers' }, slug: 'development/getting-started' },
						{ label: 'Backend-Entwicklung', translations: { en: 'Backend Development' }, slug: 'development/backend' },
						{ label: 'Frontend-Entwicklung', translations: { en: 'Frontend Development' }, slug: 'development/frontend' },
						{ label: 'Mitwirken & Richtlinien', translations: { en: 'Contributing & Guidelines' }, slug: 'development/contributing' },
					],
				},
				{
					label: 'Referenz',
					translations: { en: 'Reference' },
					items: [
						{ label: 'Feldtypen', translations: { en: 'Field Types' }, slug: 'reference/field-types' },
					],
				},
			],
		}),
	],
});
