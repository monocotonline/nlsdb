import { cartCount } from '#lib/server/cart.js';
import { getNavCategories } from '#lib/server/nav.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
	const [count, navCategories] = await Promise.all([cartCount(cookies), getNavCategories()]);
	return { cartCount: count, navCategories, customer: locals.customer };
};
