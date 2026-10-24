import { fail, redirect } from '@sveltejs/kit';
import { SORTS, catalogueHref, parseCatalogueQuery } from '#lib/catalogue.js';
import { errorMessage } from '#lib/server/errors.js';
import { toBook } from '#lib/server/pb.js';
import { getProductNav } from '#lib/server/product-nav.js';
import { saveBook } from './book-payload.js';
import type { Actions, PageServerLoad } from './$types';

const PER_PAGE = 20;

// The list is filtered by the URL (?type=…&category=…&q=…&sort=…&page=…), so a view can be
// bookmarked. The category "none" means books that have no category yet.
export const load: PageServerLoad = async ({ locals, url, parent }) => {
	const pb = locals.pb;
	const query = parseCatalogueQuery(url.searchParams);

	// The layout already counted the categories for the sidebar.
	const { productNav } = await parent();
	const nav = productNav ?? (await getProductNav(pb));

	const selected = nav.categories.find((c) => c.slug === query.category);
	const filter = [
		query.type && pb.filter('type = {:type}', { type: query.type }),
		query.category === 'none' && 'type = "book" && category = ""',
		// A category that does not exist matches nothing, rather than showing everything.
		query.category &&
			query.category !== 'none' &&
			(selected ? pb.filter('category = {:id}', { id: selected.id }) : 'id = "none"'),
		query.q && pb.filter('(title ~ {:q} || author ~ {:q})', { q: query.q })
	]
		.filter(Boolean)
		.join(' && ');

	const result = await pb.collection('books').getList(query.page, PER_PAGE, {
		filter,
		sort: SORTS[query.sort],
		expand: 'category'
	});

	// A bookmarked page that no longer exists (items were removed) goes to the last page.
	if (result.totalPages > 0 && query.page > result.totalPages) {
		redirect(303, `/admin${catalogueHref(query, { page: result.totalPages })}`);
	}

	return {
		books: result.items.map((r) => toBook(pb, r)),
		query,
		total: result.totalItems,
		page: result.page,
		totalPages: result.totalPages,
		allCount: nav.allCount,
		uncategorised: nav.uncategorised,
		// For the drawer's dropdown and the filter.
		categories: nav.categories.map(({ id, name, slug }) => ({ id, name, slug })),
		typeCounts: nav.types,
		categoryCounts: nav.categories.map(({ slug, name, count }) => ({ slug, name, count }))
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		try {
			await saveBook(locals.pb, await request.formData());
		} catch (e) {
			return fail(400, { message: errorMessage(e) });
		}
		return { success: true };
	},
	update: async ({ request, locals }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		try {
			await saveBook(locals.pb, form, id);
		} catch (e) {
			return fail(400, { message: errorMessage(e) });
		}
		return { success: true };
	},
	delete: async ({ request, locals }) => {
		const id = String((await request.formData()).get('id') ?? '');
		try {
			await locals.pb.collection('books').delete(id);
		} catch {
			return fail(400, { message: 'Could not delete that product' });
		}
		return { success: true };
	}
};
