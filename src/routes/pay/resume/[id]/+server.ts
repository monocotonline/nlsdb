import { redirect } from '@sveltejs/kit';
import { getSuperuserPb } from '#lib/server/pb.js';
import { isNotFound } from '#lib/server/pb-errors.js';
import { getGateway } from '#lib/server/payment.js';
import { newReference, settleOrder } from '#lib/server/orders.js';
import type { RequestHandler } from './$types';

// The link an admin sends to a customer whose payment was never finished. It starts a fresh
// payment for the same order, so it keeps working even if the first payment page has expired.
export const GET: RequestHandler = async ({ params, url }) => {
	const pb = await getSuperuserPb();
	const order = await pb
		.collection('orders')
		.getOne(params.id)
		.catch((e) => {
			if (isNotFound(e)) return null;
			throw e;
		});
	if (!order) redirect(303, '/');

	// They may have paid in the meantime; never charge twice.
	const settled = await settleOrder(order.reference).catch(() => null);
	if (!settled || settled.status !== 'pending') {
		redirect(303, `/orders/${encodeURIComponent(order.reference)}`);
	}

	// Gateways reject a reference they have already seen, so the order gets a new one.
	const reference = newReference();
	const { redirectUrl } = await getGateway().initialize({
		reference,
		amount: order.total,
		email: order.email,
		callbackUrl: `${url.origin}/checkout/callback`
	});
	await pb.collection('orders').update(order.id, { reference });

	redirect(303, redirectUrl, { external: ['https://checkout.paystack.com'] });
};
