import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/** Products used to live at /books/:id. Old links (and shared links) keep working. */
export const GET: RequestHandler = ({ params, url }) => {
	redirect(301, `/products/${encodeURIComponent(params.id)}${url.search}`);
};
