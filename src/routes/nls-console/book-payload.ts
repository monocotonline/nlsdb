import type PocketBase from 'pocketbase';
import { sanitizeDescription } from '#lib/server/description.js';
import { isProductType, usesCategories } from '#lib/product-types.js';
import { FormError } from '#lib/server/errors.js';

export const MAX_IMAGES = 8;

/**
 * Saves a book from the admin form.
 *
 * Images arrive as an ordered list of tokens in `order` (an existing filename, or `new:<n>` for
 * the n-th uploaded file in `newImages`). PocketBase can keep, delete and append files but only
 * appends new ones at the end, so when the requested order differs we reorder in a second step
 * once we know the stored filenames.
 */
export async function saveBook(pb: PocketBase, form: FormData, id?: string) {
	const type = String(form.get('type') ?? '');
	if (!isProductType(type)) throw new FormError('Choose what kind of product this is.');

	const order: string[] = JSON.parse(String(form.get('order') ?? '[]'));
	const files = form.getAll('newImages').filter((f): f is File => f instanceof File && f.size > 0);

	if (!Array.isArray(order) || order.length > MAX_IMAGES) {
		throw new FormError(`A book can have at most ${MAX_IMAGES} images.`);
	}
	if (order.filter((t) => t.startsWith('new:')).length !== files.length) {
		throw new FormError('Image upload did not match. Please try again.');
	}

	const current: string[] = id ? ((await pb.collection('books').getOne(id)).images ?? []) : [];
	const kept = order.filter((t) => current.includes(t));

	const data = new FormData();
	for (const key of ['title', 'author', 'price']) {
		data.set(key, String(form.get(key) ?? '').trim());
	}
	data.set('description', sanitizeDescription(String(form.get('description') ?? '')));
	data.set('type', type);
	// The category is optional and only for types that use categories; empty clears it.
	data.set('category', usesCategories(type) ? String(form.get('category') ?? '').trim() : '');
	for (const name of current.filter((n) => !kept.includes(n))) data.append('images-', name);
	for (const file of files) data.append('images+', file);

	const saved = id
		? await pb.collection('books').update(id, data)
		: await pb.collection('books').create(data);

	// An out-of-date database has no `images` field and would silently drop the upload.
	if (!('images' in saved)) {
		throw new FormError(
			'The database is out of date, so images were not saved. Restart PocketBase to apply the latest migrations.'
		);
	}

	const stored: string[] = saved.images ?? [];
	const added = stored.filter((n) => !current.includes(n));
	const wanted = order
		.map((t) => (t.startsWith('new:') ? added[Number(t.slice(4))] : t))
		.filter((n): n is string => !!n && stored.includes(n));

	if (wanted.join('|') !== stored.join('|')) {
		await pb.collection('books').update(saved.id, { images: wanted });
	}
	return saved;
}
