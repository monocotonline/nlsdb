import { error, fail } from '@sveltejs/kit';
import { validateMessage } from '#lib/support.js';
import { getThread, replyAsAdmin, setTicketStatus } from '#lib/server/support.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const thread = await getThread(locals.pb, params.id);
	if (!thread) error(404, 'Conversation not found');
	return thread;
};

export const actions: Actions = {
	reply: async ({ locals, params, request }) => {
		const body = String((await request.formData()).get('message') ?? '').trim();
		const problem = validateMessage(body);
		if (problem) return fail(400, { message: problem });
		await replyAsAdmin(locals.pb, params.id, body, locals.admin?.name ?? 'Support');
		return { success: true };
	},
	resolve: async ({ locals, params }) => {
		await setTicketStatus(locals.pb, params.id, 'resolved');
		return { success: true };
	},
	reopen: async ({ locals, params }) => {
		await setTicketStatus(locals.pb, params.id, 'open');
		return { success: true };
	}
};
