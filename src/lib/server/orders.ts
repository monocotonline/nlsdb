import { randomBytes } from 'node:crypto';
import { getSuperuserPb, toOrder } from './pb';
import { isNotFound } from './pb-errors';
import { getGateway } from './payment';
import type { Order } from '#lib/types.js';

export const newReference = () => `NLS-${randomBytes(8).toString('hex').toUpperCase()}`;

export async function getOrdersForCustomer(customerId: string): Promise<Order[]> {
	const pb = await getSuperuserPb();
	const orders = await pb.collection('orders').getFullList({
		filter: pb.filter('customer = {:customerId}', { customerId }),
		sort: '-created',
		expand: 'order_items_via_order'
	});
	return orders.map((r) => toOrder(r, r.expand?.order_items_via_order ?? []));
}

export async function getOrderByReference(reference: string): Promise<Order | null> {
	const pb = await getSuperuserPb();
	const order = await pb
		.collection('orders')
		.getFirstListItem(pb.filter('reference = {:reference}', { reference }))
		.catch((e) => {
			if (isNotFound(e)) return null;
			throw e;
		});
	if (!order) return null;
	const items = await pb.collection('order_items').getFullList({
		filter: pb.filter('order = {:id}', { id: order.id }),
		sort: '@rowid'
	});
	return toOrder(order, items);
}

/**
 * Asks the gateway for the real payment status and records it. Safe to call
 * repeatedly (callback, webhook, receipt refresh): a settled order is never changed.
 */
export async function settleOrder(reference: string): Promise<Order | null> {
	const order = await getOrderByReference(reference);
	if (!order || order.status !== 'pending') return order;

	const result = await getGateway().verify(reference);
	if (result.status === 'pending') return order;

	// A "successful" payment for the wrong amount is not a successful order.
	const status =
		result.status === 'success' && result.amount !== order.total ? 'failed' : result.status;

	const pb = await getSuperuserPb();
	await pb.collection('orders').update(order.id, {
		status,
		paidAt: status === 'success' ? new Date().toISOString() : ''
	});
	return { ...order, status };
}
