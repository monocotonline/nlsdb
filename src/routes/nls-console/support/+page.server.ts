import { listTickets } from '#lib/server/support.js';
import type { TicketStatus } from '#lib/types.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const raw = url.searchParams.get('status');
	const status: TicketStatus | '' = raw === 'open' || raw === 'resolved' ? raw : '';
	const page = Math.max(1, Number.parseInt(url.searchParams.get('page') ?? '', 10) || 1);
	return { status, ...(await listTickets(locals.pb, { status, page })) };
};
