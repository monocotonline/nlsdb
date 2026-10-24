import { createHmac, timingSafeEqual } from 'node:crypto';
import { error, json } from '@sveltejs/kit';
import { PAYSTACK_SECRET_KEY } from '$app/env/private';
import { settleOrder } from '#lib/server/orders.js';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const secret = PAYSTACK_SECRET_KEY;
	if (!secret) error(404);

	const body = await request.text();
	const expected = createHmac('sha512', secret).update(body).digest();
	const given = Buffer.from(request.headers.get('x-paystack-signature') ?? '', 'hex');
	if (given.length !== expected.length || !timingSafeEqual(given, expected)) error(401);

	const event = JSON.parse(body);
	// settleOrder re-verifies with Paystack, so the payload itself is never trusted.
	if (event.event === 'charge.success' && event.data?.reference) {
		await settleOrder(event.data.reference);
	}
	return json({ received: true });
};
