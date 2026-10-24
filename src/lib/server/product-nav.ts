import type PocketBase from 'pocketbase';
import { PRODUCT_TYPES, toProductType, type ProductType } from '#lib/product-types.js';

export type ProductNav = {
	allCount: number;
	/** Books with no category yet. */
	uncategorised: number;
	types: { value: ProductType; label: string; count: number }[];
	categories: { id: string; slug: string; name: string; count: number }[];
};

/** How many products each type and category holds, for the admin sidebar and filters. */
export async function getProductNav(pb: PocketBase): Promise<ProductNav> {
	const [categories, refs] = await Promise.all([
		pb.collection('categories').getFullList({ sort: 'name' }),
		pb.collection('books').getFullList({ fields: 'category,type' })
	]);

	const counts = new Map<string, number>();
	const typeCounts = new Map<ProductType, number>();
	for (const ref of refs) {
		if (ref.category) counts.set(ref.category, (counts.get(ref.category) ?? 0) + 1);
		const type = toProductType(ref.type);
		typeCounts.set(type, (typeCounts.get(type) ?? 0) + 1);
	}

	return {
		allCount: refs.length,
		uncategorised: refs.filter((r) => toProductType(r.type) === 'book' && !r.category).length,
		types: PRODUCT_TYPES.map((t) => ({
			value: t.value,
			label: t.plural,
			count: typeCounts.get(t.value) ?? 0
		})),
		categories: categories.map((c) => ({
			id: c.id,
			slug: c.slug as string,
			name: c.name as string,
			count: counts.get(c.id) ?? 0
		}))
	};
}
