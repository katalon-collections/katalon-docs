// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
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
						{ label: 'Installation', slug: 'getting-started/installation' },
						{ label: 'Erste Schritte', slug: 'getting-started/first-steps' },
					],
				},
				{
					label: 'Administration',
					items: [
						{ label: 'Schema verwalten', slug: 'administration/schema' },
						{ label: 'Import', slug: 'administration/import' },
						{ label: 'Produktion', slug: 'administration/production' },
						{ label: 'Upgrading', slug: 'administration/upgrading' },
					],
				},
				{
					label: 'Integration',
					items: [
						{ label: 'REST API', slug: 'integration/rest-api' },
						{ label: 'OAI-PMH', slug: 'integration/oai-pmh' },
						{ label: 'LIDO', slug: 'integration/lido' },
						{ label: 'Export-Mappings', slug: 'integration/export-mappings' },
					],
				},
				{
					label: 'Entwicklung',
					items: [
						{ label: 'Architektur', slug: 'development/architecture' },
						{ label: 'Datenmodell', slug: 'development/data-model' },
						{ label: 'Anpassungen', slug: 'development/customization' },
						{ label: 'Dev-Compose', slug: 'development/dev-compose' },
						{ label: 'Dev-Reset', slug: 'development/dev-reset' },
					],
				},
				{
					label: 'Referenz',
					items: [
						{ label: 'Feldtypen', slug: 'reference/field-types' },
						{ label: 'Vorgänge', slug: 'reference/procedures' },
					],
				},
			],
		}),
	],
});
