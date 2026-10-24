import { error } from '@sveltejs/kit';
import { PB_URL } from '#lib/server/pb.js';
import type { RequestHandler } from './$types';

// Only these thumbnail sizes are allowed (the book field defines them).
const THUMBS = new Set(['400x0']);

/** Serves a book image from PocketBase, so the browser never needs to reach PocketBase itself. */
export const GET: RequestHandler = async ({ params, url, fetch }) => {
	const thumb = url.searchParams.get('thumb');
	if (thumb && !THUMBS.has(thumb)) error(400, 'Unsupported size');

	const upstream = await fetch(
		`${PB_URL}/api/files/books/${encodeURIComponent(params.id)}/${encodeURIComponent(params.file)}${thumb ? `?thumb=${thumb}` : ''}`
	);
	if (!upstream.ok) error(upstream.status === 404 ? 404 : 502, 'Image not found');

	return new Response(upstream.body, {
		headers: {
			'content-type': upstream.headers.get('content-type') ?? 'application/octet-stream',
			// File names are unique per upload, so they can be cached for good.
			'cache-control': 'public, max-age=31536000, immutable'
		}
	});
};
