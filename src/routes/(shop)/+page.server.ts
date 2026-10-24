import { fail, redirect } from '@sveltejs/kit';
import { catalogueHref, parseCatalogueQuery } from '#lib/catalogue.js';
import { addToCart } from '#lib/server/cart.js';
import { loadCatalogue } from '#lib/server/catalogue.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
	// Filters come from the URL (?category=…&q=…&sort=…&page=…) so every view can be shared.
	const query = parseCatalogueQuery(url.searchParams);
	const catalogue = await loadCatalogue(query);

	// A bookmarked page that no longer exists (items were removed) goes to the last page.
	if (catalogue.totalPages > 0 && query.page > catalogue.totalPages) {
		redirect(303, `/${catalogueHref(query, { page: catalogue.totalPages }, '#products')}`);
	}

	return {
		...catalogue,
		query,
		// Set from the client when the intro banner is dismissed, so there is no flash on reload.
		heroDismissed: cookies.get('hero') === 'dismissed'
	};
};

export const actions: Actions = {
	add: async ({ request, cookies }) => {
		const id = String((await request.formData()).get('id') ?? '');
		if (!id) return fail(400, { message: 'Missing product' });
		addToCart(cookies, id);
		return { added: id };
	}
};
