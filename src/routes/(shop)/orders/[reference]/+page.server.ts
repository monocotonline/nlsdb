import { error } from '@sveltejs/kit';
import { getOrderByReference, settleOrder } from '#lib/server/orders.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	// Re-checks with the gateway while the order is still pending.
	const order =
		(await settleOrder(params.reference)) ?? (await getOrderByReference(params.reference));
	if (!order) error(404, 'Order not found');
	return { order };
};
