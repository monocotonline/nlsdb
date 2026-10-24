import { json } from '@sveltejs/kit';
import { resetConfirmLimiter } from '#lib/server/limits.js';
import type { RequestHandler } from './$types';

/** Sets the new password using the token from the emailed link. */
export const POST: RequestHandler = async ({ request, locals, getClientAddress }) => {
	const body = await request.json().catch(() => ({}));
	const token = String(body.token ?? '');
	const password = String(body.password ?? '');

	if (password.length < 8) {
		return json({ message: 'Your password must be at least 8 characters.' }, { status: 400 });
	}
	if (!resetConfirmLimiter.allow(getClientAddress())) {
		return json({ message: 'Too many attempts. Please try again later.' }, { status: 429 });
	}

	try {
		await locals.pb.collection('customers').confirmPasswordReset(token, password, password);
	} catch {
		return json(
			{ message: 'This reset link has expired or was already used. Please request a new one.' },
			{ status: 400 }
		);
	}
	return json({ ok: true });
};
