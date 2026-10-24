/// <reference path="../pb_data/types.d.ts" />

const SELF = 'id = @request.auth.id';

migrate(
	(app) => {
		// Optional customer accounts. Guests can still buy without one.
		const customers = new Collection({
			type: 'auth',
			name: 'customers',
			listRule: SELF,
			viewRule: SELF,
			createRule: '', // public sign-up
			updateRule: SELF,
			deleteRule: null,
			passwordAuth: { enabled: true, identityFields: ['email'] },
			fields: [
				{ type: 'text', name: 'name', required: true, max: 100 },
				{ type: 'text', name: 'phone', max: 30 },
				{ type: 'text', name: 'address', max: 500 },
				{ type: 'text', name: 'city', max: 100 },
				{ type: 'text', name: 'state', max: 100 }
			]
		});
		app.save(customers);

		// Orders placed while logged in are linked to the customer (set by the server).
		const orders = app.findCollectionByNameOrId('orders');
		orders.fields.add(
			new RelationField({
				name: 'customer',
				collectionId: customers.id,
				maxSelect: 1,
				cascadeDelete: false
			})
		);
		app.save(orders);
	},
	(app) => {
		const orders = app.findCollectionByNameOrId('orders');
		orders.fields.removeByName('customer');
		app.save(orders);
		app.delete(app.findCollectionByNameOrId('customers'));
	}
);
