import { describe, expect, it } from 'vitest';
import { slugify, uniqueSlug } from './slug.js';

describe('slugify', () => {
	it('lowercases and replaces spaces and symbols', () => {
		expect(slugify('Civil Litigation')).toBe('civil-litigation');
		expect(slugify('Litigation & Procedure')).toBe('litigation-and-procedure');
		expect(slugify('  T-Shirts / Polos!  ')).toBe('t-shirts-polos');
	});

	it('strips accents', () => {
		expect(slugify('Café Équipe')).toBe('cafe-equipe');
	});

	it('never returns an empty slug', () => {
		expect(slugify('!!!')).toBe('category');
		expect(slugify('')).toBe('category');
	});
});

describe('uniqueSlug', () => {
	it('returns the base slug when free', () => {
		expect(uniqueSlug('Clothing', ['books'])).toBe('clothing');
	});

	it('adds a numeric suffix on collision', () => {
		expect(uniqueSlug('Clothing', ['clothing'])).toBe('clothing-2');
		expect(uniqueSlug('Clothing', ['clothing', 'clothing-2'])).toBe('clothing-3');
	});
});
