/// <reference path="../pb_data/types.d.ts" />

// Books can have several images; the first one is the cover.
migrate(
	(app) => {
		const books = app.findCollectionByNameOrId('books');
		const field = books.fields.getByName('cover');
		field.name = 'images';
		field.maxSelect = 8;
		app.save(books);
	},
	(app) => {
		const books = app.findCollectionByNameOrId('books');
		const field = books.fields.getByName('images');
		field.name = 'cover';
		field.maxSelect = 1;
		app.save(books);
	}
);
