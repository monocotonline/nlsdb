import type { Book } from '#lib/types.js';

/** What real customers have done, used to rank and to word the heading honestly. */
export type PurchaseSignals = {
	/** Other product id -> paid orders that contain both it and the product being viewed. */
	together: Map<string, number>;
	/** Product id -> paid orders that contain it (all customers, all time). */
	popular: Map<string, number>;
};

export const NO_SIGNALS: PurchaseSignals = { together: new Map(), popular: new Map() };

/** A pair must have been ordered together at least this often before we say so. */
export const TOGETHER_MIN = 2;

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** How closely a candidate relates to the product being viewed (higher is closer). */
export function relatedScore(
	current: Book,
	candidate: Book,
	signals: PurchaseSignals = NO_SIGNALS
): number {
	let score = 0;
	// Real purchases are the strongest signal there is.
	score += Math.min(signals.together.get(candidate.id) ?? 0, 5) * 2;
	if (current.category && candidate.category && current.category.id === candidate.category.id) {
		score += 4;
	}
	if (current.author && candidate.author && same(current.author, candidate.author)) score += 3;
	// A similar price is a weak but useful signal (textbooks sit near textbooks).
	if (current.price > 0 && Math.abs(candidate.price - current.price) <= current.price * 0.4) {
		score += 1;
	}
	// Popular items edge ahead of equals, without outweighing relevance.
	score += Math.min(signals.popular.get(candidate.id) ?? 0, 5) * 0.3;
	// Prefer products that have pictures, to keep the row looking complete.
	if (candidate.images.length > 0) score += 0.5;
	return score;
}

/**
 * Picks the most related products. Candidates should already be ordered newest first, which is
 * how ties are broken.
 */
export function rankRelated(
	current: Book,
	candidates: Book[],
	limit: number,
	signals: PurchaseSignals = NO_SIGNALS
): Book[] {
	return candidates
		.filter((c) => c.id !== current.id)
		.map((book, index) => ({ book, index, score: relatedScore(current, book, signals) }))
		.sort((a, b) => b.score - a.score || a.index - b.index)
		.slice(0, limit)
		.map((entry) => entry.book);
}

export type RelatedReason = 'together' | 'popular' | 'category' | 'author' | 'general';

export type RelatedHeading = {
	reason: RelatedReason;
	/** Small label above the title. */
	eyebrow: string;
	title: string;
	/** One line of context. Only states what the data actually shows. */
	note: string;
};

/**
 * What the row should say. The wording is persuasive, but every claim is backed by something real
 * (actual orders, the category, the author), and anything weaker falls back to a plain heading.
 */
export function relatedHeading(
	current: Book,
	picks: Book[],
	signals: PurchaseSignals = NO_SIGNALS
): RelatedHeading {
	const togetherPicks = picks.filter((p) => (signals.together.get(p.id) ?? 0) >= TOGETHER_MIN);
	if (togetherPicks.length >= Math.min(2, picks.length) && togetherPicks.length > 0) {
		return {
			reason: 'together',
			eyebrow: 'Ordered together',
			title: 'Customers who bought this also ordered',
			note: 'Based on what other customers have ordered with this item.'
		};
	}

	const category = current.category;
	const allInCategory =
		category !== null && picks.length > 0 && picks.every((p) => p.category?.id === category.id);

	if (category && allInCategory) {
		const allSell = picks.every((p) => (signals.popular.get(p.id) ?? 0) >= 1);
		if (allSell) {
			return {
				reason: 'popular',
				eyebrow: `Popular in ${category.name}`,
				title: `Most ordered in ${category.name}`,
				note: 'The titles customers order most in this category.'
			};
		}
		return {
			reason: 'category',
			eyebrow: `More in ${category.name}`,
			title: `Complete your ${category.name} shelf`,
			note: 'More from the same category.'
		};
	}

	if (
		current.author &&
		picks.length > 0 &&
		picks.every((p) => p.author && same(p.author, current.author))
	) {
		return {
			reason: 'author',
			eyebrow: 'From the same author',
			title: `More by ${current.author}`,
			note: ''
		};
	}

	return { reason: 'general', eyebrow: 'Worth a look', title: 'More from the shop', note: '' };
}
