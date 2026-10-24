import { createPb } from './pb.js';

export type NavCategory = { name: string; slug: string; count: number };

/** The busiest categories, for the footer links. Categories with nothing in them are left out. */
export async function getNavCategories(limit = 6): Promise<NavCategory[]> {
	const pb = createPb();
	const [categories, refs] = await Promise.all([
		pb.collection('categories').getFullList({ fields: 'id,name,slug' }),
		pb.collection('books').getFullList({ fields: 'category' })
	]);
	const counts = new Map<string, number>();
	for (const ref of refs) {
		if (ref.category) counts.set(ref.category, (counts.get(ref.category) ?? 0) + 1);
	}
	return categories
		.map((c) => ({ name: c.name as string, slug: c.slug as string, count: counts.get(c.id) ?? 0 }))
		.filter((c) => c.count > 0)
		.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
		.slice(0, limit);
}
