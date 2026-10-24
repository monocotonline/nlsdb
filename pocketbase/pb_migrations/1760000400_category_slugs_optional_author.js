/// <reference path="../pb_data/types.d.ts" />

const slugify = (name) =>
	name
		.toLowerCase()
		.replace(/&/g, ' and ')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '') || 'category';

// Categories get a URL-friendly name (used in ?category=… links), and the catalogue is no
// longer only books, so "author" becomes optional (a T-shirt has no author).
migrate(
	(app) => {
		const categories = app.findCollectionByNameOrId('categories');
		categories.fields.add(new TextField({ name: 'slug', max: 120 }));
		app.save(categories);

		const used = new Set();
		for (const record of app.findAllRecords('categories')) {
			const base = slugify(record.getString('name'));
			let slug = base;
			for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;
			used.add(slug);
			record.set('slug', slug);
			app.save(record);
		}

		const refreshed = app.findCollectionByNameOrId('categories');
		refreshed.fields.getByName('slug').required = true;
		refreshed.indexes.push('CREATE UNIQUE INDEX idx_categories_slug ON categories (slug)');
		app.save(refreshed);

		const books = app.findCollectionByNameOrId('books');
		books.fields.getByName('author').required = false;
		app.save(books);
	},
	(app) => {
		const categories = app.findCollectionByNameOrId('categories');
		categories.indexes = categories.indexes.filter((i) => !i.includes('idx_categories_slug'));
		categories.fields.removeByName('slug');
		app.save(categories);

		const books = app.findCollectionByNameOrId('books');
		books.fields.getByName('author').required = true;
		app.save(books);
	}
);
