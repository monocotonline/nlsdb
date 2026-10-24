import { fail, redirect } from '@sveltejs/kit';
import { CUSTOMER_COOKIE, setCustomerSession } from '#lib/server/customer-session.js';
import { passwordChangeLimiter } from '#lib/server/limits.js';
import { getOrdersForCustomer } from '#lib/server/orders.js';
import { createPb, toBook } from '#lib/server/pb.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.customer) redirect(303, '/?auth=login&redirectTo=/account');
	const orders = await getOrdersForCustomer(locals.customer.id);

	// With no orders yet the page would be empty, so suggest what's new in the shop instead.
	let fresh: ReturnType<typeof toBook>[] = [];
	if (orders.length === 0) {
		const pb = createPb();
		const latest = await pb
			.collection('books')
			.getList(1, 4, { sort: '-created', expand: 'category' });
		fresh = latest.items.map((r) => toBook(pb, r));
	}
	return { customer: locals.customer, orders, fresh };
};

export const actions: Actions = {
	password: async ({ request, locals, cookies, getClientAddress }) => {
		if (!locals.customer) redirect(303, '/?auth=login&redirectTo=/account');

		const form = await request.formData();
		const oldPassword = String(form.get('oldPassword') ?? '');
		const password = String(form.get('password') ?? '');
		if (password.length < 8) {
			return fail(400, { message: 'Your new password must be at least 8 characters.' });
		}
		if (!passwordChangeLimiter.allow(getClientAddress())) {
			return fail(429, { message: 'Too many attempts. Please try again later.' });
		}

		// Changing a password needs the customer's own login, not the server's.
		const pb = createPb();
		pb.authStore.save(cookies.get(CUSTOMER_COOKIE) ?? '', null);
		try {
			await pb
				.collection('customers')
				.update(locals.customer.id, { oldPassword, password, passwordConfirm: password });
			// PocketBase signs the old session out when the password changes; sign in again.
			await pb.collection('customers').authWithPassword(locals.customer.email, password);
		} catch {
			return fail(400, { message: 'Your current password is incorrect.' });
		}
		setCustomerSession(cookies, pb.authStore.token);
		return { success: true };
	},

	logout: async ({ cookies }) => {
		cookies.delete(CUSTOMER_COOKIE, { path: '/' });
		redirect(303, '/');
	}
};
