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
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/karkraeg/Katalon' }],
			sidebar: [
				{
					label: 'Loslegen',
					items: [
						{ label: 'Überblick', slug: 'index' },
						{ label: 'Erste Schritte', slug: 'getting-started/first-steps' },
						{ label: 'Eigene Sammlung einrichten', slug: 'getting-started/eigene-sammlung' },
					],
				},
				{
					label: 'Administration',
					items: [
						{ label: 'Schema verwalten', slug: 'administration/schema' },
						{ label: 'Import', slug: 'administration/import' },
						{ label: 'Stapelbearbeitung', slug: 'administration/batch-bearbeitung' },
						{ label: 'Formularvarianten', slug: 'administration/formularvarianten' },
						{ label: 'Subtypen', slug: 'administration/subtypen' },
						{ label: 'Mehrsprachigkeit', slug: 'administration/mehrsprachigkeit' },
						{ label: 'Cookbook', slug: 'administration/cookbook' },
					],
				},
				{
					label: 'Portal',
					items: [
						{ label: 'Portal-Suche', slug: 'integration/portal-suche' },
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
