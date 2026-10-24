import { fail } from '@sveltejs/kit';
import { errorMessage } from '#lib/server/errors.js';
import { uniqueSlug } from '#lib/slug.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const [categories, books] = await Promise.all([
		locals.pb.collection('categories').getFullList({ sort: 'name' }),
		locals.pb.collection('books').getFullList({ fields: 'id,category' })
	]);
	const counts = new Map<string, number>();
	for (const book of books) {
		if (book.category) counts.set(book.category, (counts.get(book.category) ?? 0) + 1);
	}
	return {
		categories: categories.map((c) => ({ id: c.id, name: c.name, books: counts.get(c.id) ?? 0 })),
		uncategorised: books.filter((b) => !b.category).length
	};
};

const nameOf = (form: FormData) => String(form.get('name') ?? '').trim();

export const actions: Actions = {
	// Accepts one or many names (`names`), so several categories can be added at once.
	create: async ({ request, locals }) => {
		const form = await request.formData();
		const seen = new Set<string>();
		const names = [...form.getAll('names'), form.get('name')]
			.map((n) =>
				String(n ?? '')
					.replace(/\s+/g, ' ')
					.trim()
					.slice(0, 100)
			)
			.filter((n) => {
				const key = n.toLowerCase();
				if (!n || seen.has(key)) return false;
				seen.add(key);
				return true;
			})
			.slice(0, 50);
		if (names.length === 0) {
			return fail(400, { message: 'Add at least one category name.', action: 'create' });
		}

		const current = await locals.pb.collection('categories').getFullList({ fields: 'name,slug' });
		const existing = new Set(current.map((c) => c.name.toLowerCase()));
		// Slugs are used in shareable links, so they are created once and kept when renaming.
		const slugs = new Set(current.map((c) => c.slug as string));
		const skipped = names.filter((n) => existing.has(n.toLowerCase()));
		let created = 0;
		for (const name of names.filter((n) => !existing.has(n.toLowerCase()))) {
			try {
				const slug = uniqueSlug(name, slugs);
				await locals.pb.collection('categories').create({ name, slug });
				slugs.add(slug);
				created++;
			} catch (e) {
				if (created === 0) return fail(400, { message: errorMessage(e), action: 'create' });
				skipped.push(name);
			}
		}
		if (created === 0) {
			return fail(400, {
				message:
					skipped.length === 1
						? `“${skipped[0]}” already exists.`
						: 'Those categories already exist.',
				action: 'create'
			});
		}
		return { success: true, action: 'create', created, skipped };
	},
	rename: async ({ request, locals }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const name = nameOf(form);
		if (!name) return fail(400, { message: 'Enter a category name.', action: 'rename', id });
		try {
			await locals.pb.collection('categories').update(id, { name });
		} catch (e) {
			const message = errorMessage(e);
			return fail(400, {
				message: /unique/i.test(message) ? `“${name}” already exists.` : message,
				action: 'rename',
				id
			});
		}
		return { success: true, action: 'rename' };
	},
	delete: async ({ request, locals }) => {
		const id = String((await request.formData()).get('id') ?? '');
		try {
			await locals.pb.collection('categories').delete(id);
		} catch (e) {
			return fail(400, { message: errorMessage(e), action: 'delete', id });
		}
		return { success: true, action: 'delete' };
	}
};
