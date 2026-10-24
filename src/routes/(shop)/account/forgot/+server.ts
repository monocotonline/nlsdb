import { json } from '@sveltejs/kit';
import { resetRequestLimiter } from '#lib/server/limits.js';
import type { RequestHandler } from './$types';

/**
 * Asks PocketBase to email a reset link. The answer is always "ok" for a well-formed request,
 * whether or not an account exists, so this can't be used to find out who has an account.
 */
export const POST: RequestHandler = async ({ request, locals, getClientAddress }) => {
	const body = await request.json().catch(() => ({}));
	const email = String(body.email ?? '').trim();
	if (!/^\S+@\S+\.\S+$/.test(email)) {
		return json({ message: 'Enter a valid email address.' }, { status: 400 });
	}
	if (!resetRequestLimiter.allow(getClientAddress())) {
		return json(
			{ message: 'Too many reset requests. Please try again a little later.' },
			{ status: 429 }
		);
	}

	try {
		await locals.pb.collection('customers').requestPasswordReset(email);
	} catch (e) {
		// Never reveal why. The cause (for example email not being set up) is for the server log.
		console.error('[shop] Password reset request failed:', e);
	}
	return json({ ok: true });
};
