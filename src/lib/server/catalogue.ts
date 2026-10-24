import { PAGE_SIZE, SORTS, type CatalogueQuery } from '#lib/catalogue.js';
import { createPb, toBook } from './pb.js';

/** Everything the shop front page needs for one set of filters. Filtering happens in PocketBase. */
export async function loadCatalogue(query: CatalogueQuery) {
	const pb = createPb();

	const [categories, refs] = await Promise.all([
		pb.collection('categories').getFullList({ sort: 'name', fields: 'id,name,slug' }),
		// Just the category of every product, to show how many each category holds.
		pb.collection('books').getFullList({ fields: 'category' })
	]);

	const counts = new Map<string, number>();
	for (const ref of refs) {
		if (ref.category) counts.set(ref.category, (counts.get(ref.category) ?? 0) + 1);
	}

	const selected = query.category ? categories.find((c) => c.slug === query.category) : undefined;
	const unknownCategory = Boolean(query.category && !selected);

	const filter = [
		selected && pb.filter('category = {:id}', { id: selected.id }),
		// A category that does not exist matches nothing, rather than showing everything.
		unknownCategory && 'id = "none"',
		query.q && pb.filter('(title ~ {:q} || author ~ {:q})', { q: query.q })
	]
		.filter(Boolean)
		.join(' && ');

	const result = await pb.collection('books').getList(query.page, PAGE_SIZE, {
		filter,
		sort: SORTS[query.sort],
		expand: 'category'
	});

	return {
		products: result.items.map((r) => toBook(pb, r)),
		total: result.totalItems,
		totalPages: result.totalPages,
		page: result.page,
		allCount: refs.length,
		uncategorised: refs.filter((r) => !r.category).length,
		categories: categories.map((c) => ({
			id: c.id,
			name: c.name,
			slug: c.slug as string,
			count: counts.get(c.id) ?? 0
		})),
		selectedCategory: selected
			? { id: selected.id, name: selected.name, slug: selected.slug }
			: null,
		unknownCategory
	};
}
