/// <reference path="../pb_data/types.d.ts" />

const ADMIN_ONLY = '@request.auth.collectionName = "admins"';

// Support conversations, order fulfilment status, and the customer password-reset email.
migrate(
	(app) => {
		const customers = app.findCollectionByNameOrId('customers');

		// Support tickets. Customers never touch these directly: the SvelteKit server reads and
		// writes them for a person who holds the ticket's private link (token).
		const tickets = new Collection({
			type: 'base',
			name: 'support_tickets',
			listRule: ADMIN_ONLY,
			viewRule: ADMIN_ONLY,
			createRule: ADMIN_ONLY,
			updateRule: ADMIN_ONLY,
			deleteRule: ADMIN_ONLY,
			fields: [
				{ type: 'text', name: 'token', required: true, min: 16, max: 64 },
				{ type: 'text', name: 'name', required: true, max: 120 },
				{ type: 'email', name: 'email', required: true },
				{ type: 'text', name: 'subject', max: 150 },
				{ type: 'text', name: 'orderReference', max: 64 },
				{
					type: 'select',
					name: 'status',
					required: true,
					maxSelect: 1,
					values: ['open', 'resolved']
				},
				// Whose turn it is to reply, so the admin inbox can show what needs attention.
				{
					type: 'select',
					name: 'awaiting',
					required: true,
					maxSelect: 1,
					values: ['admin', 'customer']
				},
				{
					type: 'relation',
					name: 'customer',
					collectionId: customers.id,
					maxSelect: 1,
					cascadeDelete: false
				},
				{ type: 'autodate', name: 'created', onCreate: true },
				{ type: 'autodate', name: 'updated', onCreate: true, onUpdate: true }
			],
			indexes: ['CREATE UNIQUE INDEX idx_support_tickets_token ON support_tickets (token)']
		});
		app.save(tickets);

		const messages = new Collection({
			type: 'base',
			name: 'support_messages',
			listRule: ADMIN_ONLY,
			viewRule: ADMIN_ONLY,
			createRule: ADMIN_ONLY,
			updateRule: ADMIN_ONLY,
			deleteRule: ADMIN_ONLY,
			fields: [
				{
					type: 'relation',
					name: 'ticket',
					required: true,
					collectionId: tickets.id,
					maxSelect: 1,
					cascadeDelete: true
				},
				{
					type: 'select',
					name: 'sender',
					required: true,
					maxSelect: 1,
					values: ['customer', 'admin']
				},
				{ type: 'text', name: 'authorName', max: 120 },
				{ type: 'text', name: 'body', required: true, max: 5000 },
				{ type: 'autodate', name: 'created', onCreate: true }
			]
		});
		app.save(messages);

		// Fulfilment: what has happened to the goods (payment status is separate).
		const orders = app.findCollectionByNameOrId('orders');
		orders.fields.add(
			new SelectField({
				name: 'fulfilment',
				maxSelect: 1,
				values: ['processing', 'shipped', 'delivered']
			})
		);
		app.save(orders);

		// The reset email links back to the shop, where the sign-in dialog opens on "new password".
		// {APP_URL} is the "Application URL" in the PocketBase dashboard settings (set it to the shop).
		customers.resetPasswordTemplate.subject = 'Reset your NLS Bookshop password';
		customers.resetPasswordTemplate.body =
			'<p>Hello,</p>' +
			'<p>Click the button below to choose a new password.</p>' +
			'<p><a class="btn" href="{APP_URL}/?auth=reset&token={TOKEN}" target="_blank" rel="noopener">Choose a new password</a></p>' +
			"<p><i>If you didn't ask for this, you can safely ignore this email.</i></p>" +
			'<p>Thanks,<br/>{APP_NAME}</p>';
		app.save(customers);
	},
	(app) => {
		app.delete(app.findCollectionByNameOrId('support_messages'));
		app.delete(app.findCollectionByNameOrId('support_tickets'));
		const orders = app.findCollectionByNameOrId('orders');
		orders.fields.removeByName('fulfilment');
		app.save(orders);
	}
);
