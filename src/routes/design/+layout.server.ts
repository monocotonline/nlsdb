import { parseCatalogueQuery } from '#lib/catalogue.js';
import { cartCount } from '#lib/server/cart.js';
import { loadCatalogue } from '#lib/server/catalogue.js';
import type { LayoutServerLoad } from './$types';

// Design lab: the same real products and categories for every prototype, filtered by the URL
// exactly like the real shop, so each look can be judged with real content.
export const load: LayoutServerLoad = async ({ url, cookies }) => {
	const query = parseCatalogueQuery(url.searchParams);
	const catalogue = await loadCatalogue(query);
	return { ...catalogue, query, cartCount: await cartCount(cookies) };
};
