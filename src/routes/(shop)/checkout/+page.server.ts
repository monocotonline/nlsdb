import { fail, redirect } from '@sveltejs/kit';
import { hydrateCart } from '#lib/server/cart.js';
import { getSuperuserPb } from '#lib/server/pb.js';
import { getGateway } from '#lib/server/payment.js';
import { newReference } from '#lib/server/orders.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	const cart = await hydrateCart(cookies);
	if (cart.lines.length === 0) redirect(303, '/cart');
	return { ...cart, customer: locals.customer };
};

const FIELDS = ['customerName', 'email', 'phone', 'address', 'city', 'state'] as const;

export const actions: Actions = {
	default: async ({ request, cookies, url, locals }) => {
		const form = await request.formData();
		const values = Object.fromEntries(
			FIELDS.map((f) => [f, String(form.get(f) ?? '').trim()])
		) as Record<(typeof FIELDS)[number], string>;

		const errors: Partial<Record<(typeof FIELDS)[number], string>> = {};
		for (const f of FIELDS) if (!values[f]) errors[f] = 'Required';
		if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Enter a valid email';
		if (values.phone && values.phone.replace(/\D/g, '').length < 7)
			errors.phone = 'Enter a valid phone number';
		if (Object.keys(errors).length) return fail(400, { values, errors });

		const cart = await hydrateCart(cookies);
		if (cart.lines.length === 0) redirect(303, '/cart');

		const pb = await getSuperuserPb();
		const reference = newReference();
		const gateway = getGateway();

		const order = await pb.collection('orders').create({
			...values,
			reference,
			customer: locals.customer?.id ?? '',
			total: cart.total,
			status: 'pending',
			gateway: gateway.name
		});
		await Promise.all(
			cart.lines.map((l) =>
				pb.collection('order_items').create({
					order: order.id,
					bookId: l.book.id,
					title: l.book.title,
					author: l.book.author,
					unitPrice: l.book.price,
					quantity: l.qty
				})
			)
		);

		// Logged-in customers can opt to keep these details for next time.
		if (locals.customer && form.get('saveDetails')) {
			const { customerName, phone, address, city, state } = values;
			await pb
				.collection('customers')
				.update(locals.customer.id, { name: customerName, phone, address, city, state })
				.catch((e) => console.error('Could not save customer details', e));
		}

		let redirectUrl: string;
		try {
			({ redirectUrl } = await gateway.initialize({
				reference,
				amount: cart.total,
				email: values.email,
				callbackUrl: `${url.origin}/checkout/callback`
			}));
		} catch (e) {
			console.error('Payment initialisation failed', e);
			await pb.collection('orders').update(order.id, { status: 'failed' });
			return fail(502, {
				values,
				errors: {},
				message: 'We could not start the payment. Please try again.'
			});
		}

		// Paystack's hosted checkout is on another origin, which Kit only follows if it is allowed.
		redirect(303, redirectUrl, { external: ['https://checkout.paystack.com'] });
	}
};
