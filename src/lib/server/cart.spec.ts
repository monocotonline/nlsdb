import type { Cookies } from '@sveltejs/kit';
import { describe, expect, it } from 'vitest';
import { addToCart, readCart, setQuantity } from './cart.js';

function fakeCookies(initial?: string) {
	const store = new Map<string, string>();
	if (initial !== undefined) store.set('cart', initial);
	return {
		get: (name: string) => store.get(name),
		set: (name: string, value: string) => void store.set(name, value),
		delete: (name: string) => void store.delete(name)
	} as unknown as Cookies;
}

describe('cart cookie', () => {
	it('is empty when the cookie is missing or malformed', () => {
		expect(readCart(fakeCookies())).toEqual([]);
		expect(readCart(fakeCookies('not json'))).toEqual([]);
		expect(readCart(fakeCookies('{"id":"a"}'))).toEqual([]);
	});

	it('drops invalid lines and caps quantity', () => {
		const cookies = fakeCookies(
			JSON.stringify([
				{ id: 'a', qty: 2 },
				{ id: 'b', qty: 0 },
				{ id: 'c', qty: 1.5 },
				{ qty: 1 },
				{ id: 'd', qty: 500 }
			])
		);
		expect(readCart(cookies)).toEqual([
			{ id: 'a', qty: 2 },
			{ id: 'd', qty: 99 }
		]);
	});

	it('adds, increments, updates and removes books', () => {
		const cookies = fakeCookies();
		addToCart(cookies, 'a');
		addToCart(cookies, 'a', 2);
		addToCart(cookies, 'b');
		expect(readCart(cookies)).toEqual([
			{ id: 'a', qty: 3 },
			{ id: 'b', qty: 1 }
		]);

		setQuantity(cookies, 'a', 5);
		expect(readCart(cookies)[0]).toEqual({ id: 'a', qty: 5 });

		setQuantity(cookies, 'a', 0);
		expect(readCart(cookies)).toEqual([{ id: 'b', qty: 1 }]);
	});
});
