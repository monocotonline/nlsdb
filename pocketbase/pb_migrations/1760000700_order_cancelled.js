/// <reference path="../pb_data/types.d.ts" />

// Admins can cancel an order that was started but never paid.
migrate(
	(app) => {
		const orders = app.findCollectionByNameOrId('orders');
		orders.fields.getByName('status').values = ['pending', 'success', 'failed', 'cancelled'];
		app.save(orders);
	},
	(app) => {
		const orders = app.findCollectionByNameOrId('orders');
		orders.fields.getByName('status').values = ['pending', 'success', 'failed'];
		app.save(orders);
	}
);
