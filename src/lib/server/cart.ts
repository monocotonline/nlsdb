import type { Cookies } from '@sveltejs/kit';
import { createPb, toBook } from './pb';
import type { Book } from '#lib/types.js';

type CartLine = { id: string; qty: number };
export type HydratedLine = { book: Book; qty: number; subtotal: number };

const COOKIE = 'cart';
const MAX_QTY = 99;

export function readCart(cookies: Cookies): CartLine[] {
	try {
		const parsed = JSON.parse(cookies.get(COOKIE) ?? '[]');
		if (!Array.isArray(parsed)) return [];
		return parsed
			.filter((l) => typeof l?.id === 'string' && Number.isInteger(l?.qty) && l.qty > 0)
			.map((l) => ({ id: l.id, qty: Math.min(l.qty, MAX_QTY) }));
	} catch {
		return [];
	}
}

export function writeCart(cookies: Cookies, lines: CartLine[]) {
	cookies.set(COOKIE, JSON.stringify(lines), {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 30
	});
}

export const clearCart = (cookies: Cookies) => cookies.delete(COOKIE, { path: '/' });

export function addToCart(cookies: Cookies, id: string, qty = 1) {
	const lines = readCart(cookies);
	const line = lines.find((l) => l.id === id);
	if (line) line.qty = Math.min(line.qty + qty, MAX_QTY);
	else lines.push({ id, qty: Math.min(qty, MAX_QTY) });
	writeCart(cookies, lines);
}

export function setQuantity(cookies: Cookies, id: string, qty: number) {
	const lines = readCart(cookies).filter((l) => l.id !== id || qty > 0);
	const line = lines.find((l) => l.id === id);
	if (line) line.qty = Math.min(qty, MAX_QTY);
	writeCart(cookies, lines);
}

/** Fetches the books in the cart that still exist, in one request. */
async function fetchExisting(ids: string[]) {
	if (ids.length === 0) return { pb: createPb(), records: [] };
	const pb = createPb();
	const filter = ids.map((id) => pb.filter('id = {:id}', { id })).join(' || ');
	const records = await pb.collection('books').getFullList({ filter });
	return { pb, records };
}

/**
 * Number of items that can actually be bought. Books that were deleted since being added are
 * not counted, so the header badge always matches what the cart page shows.
 */
export async function cartCount(cookies: Cookies) {
	const cart = readCart(cookies);
	if (cart.length === 0) return 0;
	const { records } = await fetchExisting(cart.map((l) => l.id));
	const live = new Set(records.map((r) => r.id));
	return cart.filter((l) => live.has(l.id)).reduce((n, l) => n + l.qty, 0);
}

/**
 * Loads current book data for the cart; prices always come from the database.
 * Lines whose book no longer exists are dropped from the cookie and reported in `removed`.
 */
export async function hydrateCart(cookies: Cookies) {
	const cart = readCart(cookies);
	const { pb, records } = await fetchExisting(cart.map((l) => l.id));
	const byId = new Map(records.map((r) => [r.id, r]));

	const lines: HydratedLine[] = cart
		.filter((l) => byId.has(l.id))
		.map((l) => {
			const book = toBook(pb, byId.get(l.id)!);
			return { book, qty: l.qty, subtotal: book.price * l.qty };
		});

	const removed = cart.length - lines.length;
	if (removed > 0) {
		writeCart(
			cookies,
			lines.map((l) => ({ id: l.book.id, qty: l.qty }))
		);
	}

	const total = lines.reduce((sum, l) => sum + l.subtotal, 0);
	const count = lines.reduce((sum, l) => sum + l.qty, 0);
	return { lines, total, count, removed };
}
