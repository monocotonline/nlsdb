import { hydrateCart, setQuantity } from '#lib/server/cart.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => hydrateCart(cookies);

export const actions: Actions = {
	update: async ({ request, cookies }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const qty = Math.floor(Number(form.get('qty')));
		if (id && Number.isFinite(qty)) setQuantity(cookies, id, Math.max(0, qty));
	},
	remove: async ({ request, cookies }) => {
		const id = String((await request.formData()).get('id') ?? '');
		if (id) setQuantity(cookies, id, 0);
	}
};
