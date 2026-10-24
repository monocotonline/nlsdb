import type PocketBase from 'pocketbase';
import {
	rankRelated,
	relatedHeading,
	type PurchaseSignals,
	type RelatedHeading
} from '#lib/related.js';
import type { Book } from '#lib/types.js';
import { toBook } from './pb.js';
import { popularityCounts, togetherCounts } from './purchase-signals.js';

/**
 * Products to suggest next to one being viewed, led by what other customers actually ordered with
 * it, then the same category and author, topped up with the newest so the row is never short.
 */
export async function getRelated(
	pb: PocketBase,
	book: Book,
	limit = 4
): Promise<{ items: Book[]; heading: RelatedHeading }> {
	// Purchase history only improves the suggestions. If it can't be read, carry on without it.
	const together = await togetherCounts(book.id).catch(() => new Map<string, number>());
	const togetherIds = [...together.entries()]
		.sort((a, b) => b[1] - a[1])
		.slice(0, 8)
		.map(([id]) => id);

	const same = [
		book.category && pb.filter('category = {:id}', { id: book.category.id }),
		book.author && pb.filter('author = {:author}', { author: book.author })
	].filter(Boolean);

	const [bought, close, recent] = await Promise.all([
		togetherIds.length > 0
			? pb.collection('books').getList(1, 8, {
					filter: togetherIds.map((id) => pb.filter('id = {:id}', { id })).join(' || '),
					expand: 'category'
				})
			: { items: [] },
		same.length > 0
			? pb.collection('books').getList(1, 40, {
					filter: `${pb.filter('id != {:id}', { id: book.id })} && (${same.join(' || ')})`,
					sort: '-created',
					expand: 'category'
				})
			: { items: [] },
		pb.collection('books').getList(1, 16, {
			filter: pb.filter('id != {:id}', { id: book.id }),
			sort: '-created',
			expand: 'category'
		})
	]);

	const seen = new Set<string>();
	const pool: Book[] = [];
	for (const record of [...bought.items, ...close.items, ...recent.items]) {
		if (seen.has(record.id)) continue;
		seen.add(record.id);
		pool.push(toBook(pb, record));
	}

	const popular = await popularityCounts(pool.map((b) => b.id)).catch(
		() => new Map<string, number>()
	);
	const signals: PurchaseSignals = { together, popular };

	const items = rankRelated(book, pool, limit, signals);
	return { items, heading: relatedHeading(book, items, signals) };
}
