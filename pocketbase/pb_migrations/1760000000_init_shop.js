/// <reference path="../pb_data/types.d.ts" />

const ADMIN_ONLY = '@request.auth.collectionName = "admins"';

migrate(
	(app) => {
		// Shop administrators. Existing admins can register new ones (createRule).
		const admins = new Collection({
			type: 'auth',
			name: 'admins',
			listRule: ADMIN_ONLY,
			viewRule: ADMIN_ONLY,
			createRule: ADMIN_ONLY,
			updateRule: '@request.auth.id = id',
			deleteRule: null,
			passwordAuth: { enabled: true, identityFields: ['email'] },
			fields: [{ type: 'text', name: 'name', required: true, max: 100 }]
		});
		app.save(admins);

		const books = new Collection({
			type: 'base',
			name: 'books',
			listRule: '',
			viewRule: '',
			createRule: ADMIN_ONLY,
			updateRule: ADMIN_ONLY,
			deleteRule: ADMIN_ONLY,
			fields: [
				{ type: 'text', name: 'title', required: true, max: 300 },
				{ type: 'text', name: 'author', required: true, max: 200 },
				{ type: 'text', name: 'description', max: 5000 },
				// Naira, whole units
				{ type: 'number', name: 'price', required: true, min: 0, onlyInt: true },
				{
					type: 'file',
					name: 'cover',
					maxSelect: 1,
					maxSize: 5242880,
					mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
					thumbs: ['400x0']
				},
				{ type: 'autodate', name: 'created', onCreate: true },
				{ type: 'autodate', name: 'updated', onCreate: true, onUpdate: true }
			]
		});
		app.save(books);

		// Orders and items are only written by the SvelteKit server (superuser).
		const orders = new Collection({
			type: 'base',
			name: 'orders',
			listRule: ADMIN_ONLY,
			viewRule: ADMIN_ONLY,
			createRule: null,
			updateRule: null,
			deleteRule: null,
			fields: [
				{ type: 'text', name: 'reference', required: true, max: 64 },
				{ type: 'text', name: 'customerName', required: true, max: 200 },
				{ type: 'email', name: 'email', required: true },
				{ type: 'text', name: 'phone', required: true, max: 30 },
				{ type: 'text', name: 'address', required: true, max: 500 },
				{ type: 'text', name: 'city', required: true, max: 100 },
				{ type: 'text', name: 'state', required: true, max: 100 },
				{ type: 'number', name: 'total', required: true, min: 0, onlyInt: true },
				{
					type: 'select',
					name: 'status',
					required: true,
					maxSelect: 1,
					values: ['pending', 'success', 'failed']
				},
				{ type: 'text', name: 'gateway', max: 30 },
				{ type: 'date', name: 'paidAt' },
				{ type: 'autodate', name: 'created', onCreate: true },
				{ type: 'autodate', name: 'updated', onCreate: true, onUpdate: true }
			],
			indexes: ['CREATE UNIQUE INDEX idx_orders_reference ON orders (reference)']
		});
		app.save(orders);

		const orderItems = new Collection({
			type: 'base',
			name: 'order_items',
			listRule: ADMIN_ONLY,
			viewRule: ADMIN_ONLY,
			createRule: null,
			updateRule: null,
			deleteRule: null,
			fields: [
				{
					type: 'relation',
					name: 'order',
					required: true,
					collectionId: orders.id,
					maxSelect: 1,
					cascadeDelete: true
				},
				// Snapshot of the book at purchase time, so deleting a book keeps history.
				{ type: 'text', name: 'bookId', max: 30 },
				{ type: 'text', name: 'title', required: true, max: 300 },
				{ type: 'text', name: 'author', max: 200 },
				{ type: 'number', name: 'unitPrice', required: true, min: 0, onlyInt: true },
				{ type: 'number', name: 'quantity', required: true, min: 1, onlyInt: true }
			]
		});
		app.save(orderItems);
	},
	(app) => {
		for (const name of ['order_items', 'orders', 'books', 'admins']) {
			app.delete(app.findCollectionByNameOrId(name));
		}
	}
);
