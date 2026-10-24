import { json, redirect } from '@sveltejs/kit';
import { safeRedirect, setCustomerSession } from '#lib/server/customer-session.js';
import type { RequestHandler } from './$types';

/** The sign-in UI is a dialog; old links to this URL open it on the home page. */
export const GET: RequestHandler = ({ url }) => {
	const redirectTo = safeRedirect(url.searchParams.get('redirectTo'), '');
	redirect(303, `/?auth=login${redirectTo ? `&redirectTo=${encodeURIComponent(redirectTo)}` : ''}`);
};

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	const body = await request.json().catch(() => ({}));
	const email = String(body.email ?? '').trim();
	const password = String(body.password ?? '');
	try {
		await locals.pb.collection('customers').authWithPassword(email, password);
	} catch {
		return json({ message: 'Invalid email or password' }, { status: 400 });
	}
	setCustomerSession(cookies, locals.pb.authStore.token);
	locals.pb.authStore.clear();
	return json({ ok: true });
};
