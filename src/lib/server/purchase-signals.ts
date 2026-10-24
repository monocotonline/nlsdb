import { getSuperuserPb } from './pb.js';

const chunk = <T>(list: T[], size: number): T[][] =>
	Array.from({ length: Math.ceil(list.length / size) }, (_, i) =>
		list.slice(i * size, i * size + size)
	);

/**
 * For one product: how many paid orders it shared with each other product. Counts only, so no
 * individual customer is ever exposed. Orders that were never paid don't count.
 */
export async function togetherCounts(
	bookId: string,
	maxOrders = 300
): Promise<Map<string, number>> {
	const pb = await getSuperuserPb();

	const lines = await pb.collection('order_items').getFullList({
		filter: pb.filter('bookId = {:id} && order.status = "success"', { id: bookId }),
		fields: 'order'
	});
	const orderIds = [...new Set(lines.map((l) => l.order as string))].slice(0, maxOrders);

	const counts = new Map<string, number>();
	for (const ids of chunk(orderIds, 40)) {
		const others = await pb.collection('order_items').getFullList({
			filter:
				pb.filter('bookId != {:id} && bookId != ""', { id: bookId }) +
				` && (${ids.map((id) => pb.filter('order = {:id}', { id })).join(' || ')})`,
			fields: 'bookId,order'
		});
		// One count per order, even if the same book sits on two lines of it.
		const seen = new Set<string>();
		for (const row of others) {
			const key = `${row.order}|${row.bookId}`;
			if (seen.has(key)) continue;
			seen.add(key);
			counts.set(row.bookId, (counts.get(row.bookId) ?? 0) + 1);
		}
	}
	return counts;
}

/** How many paid orders each of these products appears in. */
export async function popularityCounts(bookIds: string[]): Promise<Map<string, number>> {
	const counts = new Map<string, number>();
	if (bookIds.length === 0) return counts;

	const pb = await getSuperuserPb();
	const rows = await pb.collection('order_items').getFullList({
		filter:
			'order.status = "success" && (' +
			bookIds.map((id) => pb.filter('bookId = {:id}', { id })).join(' || ') +
			')',
		fields: 'bookId,order'
	});
	const seen = new Set<string>();
	for (const row of rows) {
		const key = `${row.order}|${row.bookId}`;
		if (seen.has(key)) continue;
		seen.add(key);
		counts.set(row.bookId, (counts.get(row.bookId) ?? 0) + 1);
	}
	return counts;
}
