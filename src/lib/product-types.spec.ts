import { describe, expect, it } from 'vitest';
import {
	PRODUCT_TYPES,
	isProductType,
	toProductType,
	typeInfo,
	usesCategories
} from './product-types.js';

describe('product types', () => {
	it('only books use categories', () => {
		expect(usesCategories('book')).toBe(true);
		expect(usesCategories('apparel')).toBe(false);
		expect(usesCategories('paraphernalia')).toBe(false);
	});

	it('treats records with no type (everything from before types existed) as books', () => {
		expect(toProductType('')).toBe('book');
		expect(toProductType(undefined)).toBe('book');
		expect(toProductType('teleporter')).toBe('book');
		expect(toProductType('apparel')).toBe('apparel');
	});

	it('recognises only known types', () => {
		expect(isProductType('book')).toBe(true);
		expect(isProductType('Book')).toBe(false);
		expect(isProductType(null)).toBe(false);
	});

	it('has labels and unique values for every type', () => {
		expect(new Set(PRODUCT_TYPES.map((t) => t.value)).size).toBe(PRODUCT_TYPES.length);
		for (const t of PRODUCT_TYPES) {
			expect(typeInfo(t.value).label).toBeTruthy();
			expect(typeInfo(t.value).plural).toBeTruthy();
		}
	});
});
