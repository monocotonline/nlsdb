import { fail } from '@sveltejs/kit';
import { FULFILMENT_STEPS, type Fulfilment } from '#lib/fulfilment.js';
import { settleOrder } from '#lib/server/orders.js';
import { getSuperuserPb, toOrder } from '#lib/server/pb.js';
import type { Actions, PageServerLoad } from './$types';

const STATUSES = ['pending', 'success', 'failed', 'cancelled'];
const PER_PAGE = 20;

export const load: PageServerLoad = async ({ locals, url }) => {
	const status = url.searchParams.get('status') ?? '';
	const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
	const filter = STATUSES.includes(status)
		? locals.pb.filter('status = {:status}', { status })
		: '';

	const result = await locals.pb.collection('orders').getList(page, PER_PAGE, {
		sort: '-created',
		filter,
		expand: 'order_items_via_order'
	});

	return {
		status,
		page,
		totalPages: result.totalPages,
		orders: result.items.map((r) => toOrder(r, r.expand?.order_items_via_order ?? []))
	};
};

export const actions: Actions = {
	// Stops an unpaid order for good. The gateway is asked first, so an order the customer did pay
	// for (but we have not heard about yet) is recorded as paid instead of being cancelled.
	cancel: async ({ request }) => {
		const id = String((await request.formData()).get('id') ?? '');
		try {
			const pb = await getSuperuserPb();
			const order = await pb.collection('orders').getOne(id);
			if (order.status !== 'pending')
				return fail(400, { message: 'Only unpaid orders can be cancelled.' });

			const settled = await settleOrder(order.reference).catch(() => null);
			if (settled && settled.status !== 'pending') {
				return fail(400, {
					message:
						settled.status === 'success'
							? 'The customer has already paid for this order, so it was not cancelled.'
							: 'This order has already ended.'
				});
			}
			await pb.collection('orders').update(id, { status: 'cancelled' });
		} catch {
			return fail(400, { message: 'Could not cancel that order.' });
		}
		return { success: true };
	},

	// Orders can only be written by the server (payment status must never be editable from the
	// browser), so this uses the server's own login after the admin guard has let the request in.
	fulfilment: async ({ request }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const value = String(form.get('fulfilment') ?? '') as Fulfilment;
		if (!FULFILMENT_STEPS.includes(value)) return fail(400, { message: 'Unknown status.' });

		try {
			const pb = await getSuperuserPb();
			const order = await pb.collection('orders').getOne(id);
			// Only paid orders have goods to ship.
			if (order.status !== 'success') {
				return fail(400, { message: 'Only paid orders can be marked as shipped.' });
			}
			await pb.collection('orders').update(id, { fulfilment: value });
		} catch {
			return fail(400, { message: 'Could not update that order.' });
		}
		return { success: true };
	}
};
