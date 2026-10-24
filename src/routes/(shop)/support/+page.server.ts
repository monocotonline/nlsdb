import { fail, redirect } from '@sveltejs/kit';
import { readTicketInput, validateTicket } from '#lib/support.js';
import { getOrderByReference } from '#lib/server/orders.js';
import { createTicket } from '#lib/server/support.js';
import { newTicketLimiter, trackLimiter } from '#lib/server/limits.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, url }) => ({
	customer: locals.customer,
	// Links such as "Need help with this order?" arrive with ?order=NLS-…
	order: (url.searchParams.get('order') ?? '').trim().toUpperCase().slice(0, 64)
});

export const actions: Actions = {
	create: async ({ request, locals, getClientAddress }) => {
		const form = await request.formData();

		// A hidden field real people never see; bots fill it in.
		if (form.get('website')) return fail(400, { message: 'We could not send your message.' });

		const input = readTicketInput(form);
		const errors = validateTicket(input);
		if (Object.keys(errors).length > 0) return fail(400, { values: input, errors });

		// Only real submissions count, so fixing a typo never uses up someone's allowance.
		if (!newTicketLimiter.allow(getClientAddress())) {
			return fail(429, {
				values: input,
				message: 'You have sent several messages recently. Please try again a little later.'
			});
		}

		const ticket = await createTicket(input, locals.customer?.id);
		redirect(303, `/support/${ticket.token}?sent=1`);
	},

	// Lets guests find an order's receipt again with its reference and the email used.
	track: async ({ request, getClientAddress }) => {
		const form = await request.formData();
		const reference = String(form.get('reference') ?? '')
			.trim()
			.toUpperCase();
		const email = String(form.get('trackEmail') ?? '')
			.trim()
			.toLowerCase();

		if (!trackLimiter.allow(getClientAddress())) {
			return fail(429, {
				trackError: 'Too many attempts. Please wait a few minutes and try again.',
				trackValues: { reference, email }
			});
		}

		const order = reference ? await getOrderByReference(reference) : null;
		// The same message for a wrong reference or a wrong email, so this can't be used to probe.
		if (!order || order.email.toLowerCase() !== email) {
			return fail(404, {
				trackError: "We couldn't find an order with those details. Check them and try again.",
				trackValues: { reference, email }
			});
		}
		redirect(303, `/orders/${encodeURIComponent(order.reference)}`);
	}
};
