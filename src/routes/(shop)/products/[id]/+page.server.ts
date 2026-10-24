import { error, redirect } from '@sveltejs/kit';
import { createPb, toBook } from '#lib/server/pb.js';
import { isNotFound } from '#lib/server/pb-errors.js';
import { getRelated } from '#lib/server/related.js';
import { addToCart } from '#lib/server/cart.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const pb = createPb();
	const record = await pb
		.collection('books')
		.getOne(params.id, { expand: 'category' })
		// Only a missing record is a 404. Any other failure (such as PocketBase being unreachable)
		// must not masquerade as "not found".
		.catch((e) => {
			if (isNotFound(e)) return null;
			throw e;
		});
	if (!record) error(404, 'Product not found');
	const book = toBook(pb, record);
	return { book, related: await getRelated(pb, book) };
};

export const actions: Actions = {
	add: async ({ request, cookies, params }) => {
		const qty = Math.max(1, Math.min(99, Number((await request.formData()).get('qty')) || 1));
		addToCart(cookies, params.id, qty);
		redirect(303, '/cart');
	}
};
