import { describe, expect, it } from 'vitest';
import {
	NO_SIGNALS,
	TOGETHER_MIN,
	rankRelated,
	relatedHeading,
	relatedScore,
	type PurchaseSignals
} from './related.js';
import type { Book } from './types.js';

let n = 0;
const book = (over: Partial<Book> = {}): Book => ({
	id: `b${++n}`,
	title: 'Title',
	author: '',
	type: 'book',
	description: '',
	descriptionText: '',
	category: null,
	price: 10000,
	coverUrl: null,
	images: [],
	...over
});
const cat = (id: string, name = id) => ({ id, name, slug: id });
const signals = (over: Partial<PurchaseSignals> = {}): PurchaseSignals => ({
	together: new Map(),
	popular: new Map(),
	...over
});

describe('relatedScore', () => {
	const current = book({ category: cat('law'), author: 'A. Author', price: 10000 });

	it('rates the same category above a similar price', () => {
		const sameCategory = book({ category: cat('law'), price: 90000 });
		const similarPrice = book({ category: cat('other'), price: 10500 });
		expect(relatedScore(current, sameCategory)).toBeGreaterThan(
			relatedScore(current, similarPrice)
		);
	});

	it('counts the same author, ignoring case and spacing', () => {
		expect(relatedScore(current, book({ author: '  a. AUTHOR ' }))).toBeGreaterThan(
			relatedScore(current, book({ author: 'Someone Else' }))
		);
	});

	it('does not treat two blank authors or two missing categories as a match', () => {
		const plain = book({ author: '', category: null });
		const other = book({ author: '', category: null });
		// Only the similar price counts; blank authors and missing categories add nothing.
		expect(relatedScore(plain, other)).toBe(1);
	});

	it('ranks something actually ordered together above a same-category item', () => {
		const together = book({ category: cat('other'), price: 90000 });
		const sameCategory = book({ category: cat('law'), price: 90000 });
		const s = signals({ together: new Map([[together.id, 4]]) });
		expect(relatedScore(current, together, s)).toBeGreaterThan(
			relatedScore(current, sameCategory, s)
		);
	});
});

describe('rankRelated', () => {
	it('never includes the product itself and respects the limit', () => {
		const current = book({ category: cat('law') });
		const pool = [current, ...Array.from({ length: 10 }, () => book({ category: cat('law') }))];
		const picks = rankRelated(current, pool, 4);
		expect(picks).toHaveLength(4);
		expect(picks.some((p) => p.id === current.id)).toBe(false);
	});

	it('puts the same category first, then the same author, then the rest', () => {
		const current = book({ category: cat('law'), author: 'A. Author' });
		const inCategory = book({ category: cat('law'), author: 'X' });
		const byAuthor = book({ category: cat('other'), author: 'A. Author' });
		const unrelated = book({ category: cat('other'), author: 'Y', price: 999999 });
		const picks = rankRelated(current, [unrelated, byAuthor, inCategory], 3);
		expect(picks.map((p) => p.id)).toEqual([inCategory.id, byAuthor.id, unrelated.id]);
	});

	it('keeps the incoming (newest first) order when scores tie', () => {
		const current = book({ category: cat('law') });
		const first = book({ category: cat('law') });
		const second = book({ category: cat('law') });
		expect(rankRelated(current, [first, second], 2).map((p) => p.id)).toEqual([
			first.id,
			second.id
		]);
	});

	it('leads with items other customers ordered together with this one', () => {
		const current = book({ category: cat('law') });
		const sameCategory = book({ category: cat('law') });
		const together = book({ category: cat('far') });
		const s = signals({ together: new Map([[together.id, 3]]) });
		expect(rankRelated(current, [sameCategory, together], 2, s)[0].id).toBe(together.id);
	});
});

describe('relatedHeading', () => {
	const current = book({ category: cat('law', 'Private Law'), author: 'A. Author' });
	const inCategory = () => book({ category: cat('law', 'Private Law') });

	it('says customers ordered them together only when the data shows it', () => {
		const picks = [book(), book(), book()];
		const strong = signals({
			together: new Map(picks.slice(0, 2).map((p) => [p.id, TOGETHER_MIN]))
		});
		expect(relatedHeading(current, picks, strong).reason).toBe('together');

		// One lone pair, or pairs below the threshold, is not enough to make the claim.
		const weak = signals({ together: new Map([[picks[0].id, TOGETHER_MIN - 1]]) });
		expect(relatedHeading(current, picks, weak).reason).not.toBe('together');
	});

	it('says "most ordered" only when every pick has actually sold', () => {
		const picks = [inCategory(), inCategory()];
		const sold = signals({ popular: new Map(picks.map((p) => [p.id, 3])) });
		const h = relatedHeading(current, picks, sold);
		expect(h.reason).toBe('popular');
		expect(h.title).toBe('Most ordered in Private Law');

		const oneUnsold = signals({ popular: new Map([[picks[0].id, 3]]) });
		expect(relatedHeading(current, picks, oneUnsold).reason).toBe('category');
	});

	it('uses a category heading with no sales data', () => {
		const h = relatedHeading(current, [inCategory()], NO_SIGNALS);
		expect(h).toMatchObject({ reason: 'category', title: 'Complete your Private Law shelf' });
	});

	it('names the author when picks are all by them', () => {
		const picks = [book({ category: cat('x'), author: 'A. Author' })];
		expect(relatedHeading(current, picks)).toMatchObject({
			reason: 'author',
			title: 'More by A. Author'
		});
	});

	it('falls back to a plain heading for a mixed set', () => {
		const picks = [book({ category: cat('law') }), book({ category: cat('x') })];
		expect(relatedHeading(current, picks).reason).toBe('general');
	});
});
