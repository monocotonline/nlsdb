/// <reference path="../pb_data/types.d.ts" />

// What kind of thing a product is. Categories (subjects such as Civil Litigation) apply to books;
// apparel and paraphernalia are told apart by type alone. Everything already in the shop is a book.
migrate(
	(app) => {
		const books = app.findCollectionByNameOrId('books');
		books.fields.add(
			new SelectField({
				name: 'type',
				maxSelect: 1,
				values: ['book', 'apparel', 'paraphernalia']
			})
		);
		app.save(books);

		for (const record of app.findAllRecords('books')) {
			record.set('type', 'book');
			app.save(record);
		}

		const refreshed = app.findCollectionByNameOrId('books');
		refreshed.fields.getByName('type').required = true;
		app.save(refreshed);
	},
	(app) => {
		const books = app.findCollectionByNameOrId('books');
		books.fields.removeByName('type');
		app.save(books);
	}
);
