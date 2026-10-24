import { getProductNav } from '#lib/server/product-nav.js';
import { countNeedingReply } from '#lib/server/support.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.admin) return { admin: null, badges: { support: 0 }, productNav: null };

	// Counts and the category list for the navigation. A failure here must never stop a page loading.
	const [support, productNav] = await Promise.all([
		countNeedingReply(locals.pb).catch(() => 0),
		getProductNav(locals.pb).catch(() => null)
	]);
	return { admin: locals.admin, badges: { support }, productNav };
};
