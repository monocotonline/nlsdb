import { describe, expect, it } from 'vitest';
import { DEFAULT_QUERY, catalogueHref, hasFilters, parseCatalogueQuery } from './catalogue.js';

const parse = (qs: string) => parseCatalogueQuery(new URLSearchParams(qs));

describe('parseCatalogueQuery', () => {
	it('uses defaults for an empty URL', () => {
		expect(parse('')).toEqual(DEFAULT_QUERY);
	});

	it('reads every filter', () => {
		expect(parse('category=Clothing&q=  navy   hoodie &sort=price-asc&page=3')).toEqual({
			category: 'clothing',
			type: '',
			q: 'navy hoodie',
			sort: 'price-asc',
			page: 3
		});
	});

	it('ignores invalid values instead of failing', () => {
		expect(parse('sort=hacked&page=-4').sort).toBe('newest');
		expect(parse('sort=hacked&page=-4').page).toBe(1);
		expect(parse('page=abc').page).toBe(1);
		expect(parse('sort=__proto__').sort).toBe('newest');
		expect(parse('sort=toString').sort).toBe('newest');
	});

	it('reads a product type and ignores unknown ones', () => {
		expect(parse('type=apparel').type).toBe('apparel');
		expect(parse('type=hats').type).toBe('');
		expect(hasFilters({ ...DEFAULT_QUERY, type: 'apparel' })).toBe(true);
	});

	it('limits the length of free text', () => {
		expect(parse(`q=${'a'.repeat(500)}`).q).toHaveLength(100);
	});
});

describe('catalogueHref', () => {
	const base = { ...DEFAULT_QUERY, category: 'clothing', q: 'hoodie' };

	it('omits defaults', () => {
		expect(catalogueHref(DEFAULT_QUERY)).toBe('?');
		expect(catalogueHref(base)).toBe('?category=clothing&q=hoodie');
	});

	it('keeps other filters when one changes', () => {
		expect(catalogueHref(base, { sort: 'price-desc' })).toBe(
			'?category=clothing&q=hoodie&sort=price-desc'
		);
	});

	it('goes back to page 1 when a filter changes, but not when only the page changes', () => {
		expect(catalogueHref({ ...base, page: 4 }, { category: 'books' })).toBe(
			'?category=books&q=hoodie'
		);
		expect(catalogueHref(base, { page: 3 })).toBe('?category=clothing&q=hoodie&page=3');
	});

	it('can clear a filter and append a hash', () => {
		expect(catalogueHref(base, { category: '' }, '#products')).toBe('?q=hoodie#products');
	});

	it('encodes special characters', () => {
		expect(catalogueHref(DEFAULT_QUERY, { q: 'a&b c' })).toBe('?q=a%26b+c');
	});

	it('round-trips through the parser', () => {
		const query = {
			category: 'law-reports',
			type: 'book' as const,
			q: 'torts & equity',
			sort: 'title' as const,
			page: 2
		};
		expect(parse(catalogueHref(query).slice(1))).toEqual(query);
	});
});

describe('hasFilters', () => {
	it('is false for the default view and true once anything is set', () => {
		expect(hasFilters(DEFAULT_QUERY)).toBe(false);
		expect(hasFilters({ ...DEFAULT_QUERY, q: 'x' })).toBe(true);
		expect(hasFilters({ ...DEFAULT_QUERY, sort: 'title' })).toBe(true);
		expect(hasFilters({ ...DEFAULT_QUERY, page: 5 })).toBe(false);
	});
});
