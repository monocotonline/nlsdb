import { error, fail } from '@sveltejs/kit';
import { validateMessage } from '#lib/support.js';
import { addCustomerMessage, getThreadByToken } from '#lib/server/support.js';
import { replyLimiter } from '#lib/server/limits.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const thread = await getThreadByToken(params.token);
	if (!thread) error(404, 'Conversation not found');
	return { ...thread, sent: url.searchParams.has('sent') };
};

export const actions: Actions = {
	reply: async ({ params, request, getClientAddress }) => {
		const thread = await getThreadByToken(params.token);
		if (!thread) error(404, 'Conversation not found');

		if (!replyLimiter.allow(getClientAddress())) {
			return fail(429, { message: 'You are sending messages very quickly. Please wait a moment.' });
		}

		const body = String((await request.formData()).get('message') ?? '').trim();
		const problem = validateMessage(body);
		if (problem) return fail(400, { message: problem });

		await addCustomerMessage(thread.ticket, body);
		return { success: true };
	}
};
