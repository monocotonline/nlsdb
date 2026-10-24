/// <reference path="../pb_data/types.d.ts" />

const ADMIN_ONLY = '@request.auth.collectionName = "admins"';

// Admin-managed categories (courses / areas of law) that books can belong to.
migrate(
	(app) => {
		const categories = new Collection({
			type: 'base',
			name: 'categories',
			listRule: '',
			viewRule: '',
			createRule: ADMIN_ONLY,
			updateRule: ADMIN_ONLY,
			deleteRule: ADMIN_ONLY,
			fields: [
				{ type: 'text', name: 'name', required: true, min: 1, max: 100 },
				{ type: 'autodate', name: 'created', onCreate: true },
				{ type: 'autodate', name: 'updated', onCreate: true, onUpdate: true }
			],
			indexes: ['CREATE UNIQUE INDEX idx_categories_name ON categories (name COLLATE NOCASE)']
		});
		app.save(categories);

		const books = app.findCollectionByNameOrId('books');
		// Optional; deleting a category just un-categorises its books.
		books.fields.add(
			new RelationField({
				name: 'category',
				collectionId: categories.id,
				maxSelect: 1,
				cascadeDelete: false
			})
		);
		// Descriptions are now rich text (HTML), which needs more room than plain text.
		books.fields.getByName('description').max = 30000;
		app.save(books);
	},
	(app) => {
		const books = app.findCollectionByNameOrId('books');
		books.fields.removeByName('category');
		books.fields.getByName('description').max = 5000;
		app.save(books);
		app.delete(app.findCollectionByNameOrId('categories'));
	}
);
