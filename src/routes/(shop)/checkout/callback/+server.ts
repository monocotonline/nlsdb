import { redirect } from '@sveltejs/kit';
import { clearCart } from '#lib/server/cart.js';
import { settleOrder } from '#lib/server/orders.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const reference = url.searchParams.get('reference') ?? url.searchParams.get('trxref');
	if (!reference) redirect(303, '/');

	const order = await settleOrder(reference);
	if (!order) redirect(303, '/');
	if (order.status === 'success') clearCart(cookies);

	redirect(303, `/orders/${encodeURIComponent(order.reference)}`);
};
