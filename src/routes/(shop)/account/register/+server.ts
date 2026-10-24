import { json, redirect } from '@sveltejs/kit';
import { safeRedirect, setCustomerSession } from '#lib/server/customer-session.js';
import { errorMessage } from '#lib/server/errors.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
	const redirectTo = safeRedirect(url.searchParams.get('redirectTo'), '');
	redirect(
		303,
		`/?auth=register${redirectTo ? `&redirectTo=${encodeURIComponent(redirectTo)}` : ''}`
	);
};

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	const body = await request.json().catch(() => ({}));
	const name = String(body.name ?? '').trim();
	const email = String(body.email ?? '').trim();
	const password = String(body.password ?? '');
	try {
		await locals.pb
			.collection('customers')
			.create({ name, email, password, passwordConfirm: password });
		await locals.pb.collection('customers').authWithPassword(email, password);
	} catch (e) {
		return json({ message: errorMessage(e) }, { status: 400 });
	}
	setCustomerSession(cookies, locals.pb.authStore.token);
	locals.pb.authStore.clear();
	return json({ ok: true });
};
