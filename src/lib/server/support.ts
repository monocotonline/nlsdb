import { randomBytes } from 'node:crypto';
import type PocketBase from 'pocketbase';
import type { RecordModel } from 'pocketbase';
import type { TicketInput } from '#lib/support.js';
import type { Ticket, TicketMessage, TicketStatus } from '#lib/types.js';
import { getSuperuserPb } from './pb.js';
import { isNotFound } from './pb-errors.js';

/** An unguessable key for a ticket's private link (24 characters). */
export const newToken = () => randomBytes(18).toString('base64url');

const TOKEN_SHAPE = /^[A-Za-z0-9_-]{16,64}$/;

export const toTicket = (r: RecordModel): Ticket => ({
	id: r.id,
	token: r.token,
	name: r.name,
	email: r.email,
	subject: r.subject ?? '',
	orderReference: r.orderReference ?? '',
	status: r.status,
	awaiting: r.awaiting,
	created: r.created,
	updated: r.updated
});

export const toMessage = (r: RecordModel): TicketMessage => ({
	id: r.id,
	sender: r.sender,
	authorName: r.authorName ?? '',
	body: r.body,
	created: r.created
});

async function messagesOf(pb: PocketBase, ticketId: string) {
	const records = await pb.collection('support_messages').getFullList({
		filter: pb.filter('ticket = {:id}', { id: ticketId }),
		sort: '@rowid'
	});
	return records.map(toMessage);
}

/* ---------- Customer side: a private link (token) is the proof of access ---------- */

export async function createTicket(input: TicketInput, customerId?: string): Promise<Ticket> {
	const pb = await getSuperuserPb();
	const ticket = await pb.collection('support_tickets').create({
		token: newToken(),
		name: input.name,
		email: input.email,
		subject: input.subject,
		orderReference: input.orderReference,
		status: 'open',
		awaiting: 'admin',
		customer: customerId ?? ''
	});
	await pb.collection('support_messages').create({
		ticket: ticket.id,
		sender: 'customer',
		authorName: input.name,
		body: input.message
	});
	return toTicket(ticket);
}

export async function getThreadByToken(token: string) {
	if (!TOKEN_SHAPE.test(token)) return null;
	const pb = await getSuperuserPb();
	const record = await pb
		.collection('support_tickets')
		.getFirstListItem(pb.filter('token = {:token}', { token }))
		.catch((e) => {
			if (isNotFound(e)) return null;
			throw e;
		});
	if (!record) return null;
	return { ticket: toTicket(record), messages: await messagesOf(pb, record.id) };
}

export async function addCustomerMessage(ticket: Ticket, body: string) {
	const pb = await getSuperuserPb();
	await pb.collection('support_messages').create({
		ticket: ticket.id,
		sender: 'customer',
		authorName: ticket.name,
		body
	});
	// A reply reopens a resolved conversation and puts it back in the admins' queue.
	await pb.collection('support_tickets').update(ticket.id, { status: 'open', awaiting: 'admin' });
}

/* ---------- Admin side: uses the admin's own client, so the collection rules apply ---------- */

export const TICKETS_PER_PAGE = 20;

export async function listTickets(
	pb: PocketBase,
	{ status, page }: { status: TicketStatus | ''; page: number }
) {
	const result = await pb.collection('support_tickets').getList(page, TICKETS_PER_PAGE, {
		filter: status ? pb.filter('status = {:status}', { status }) : '',
		// Open before resolved, then conversations waiting on an admin first, then newest.
		sort: 'status,awaiting,-updated'
	});
	return {
		tickets: result.items.map(toTicket),
		page: result.page,
		totalPages: result.totalPages,
		total: result.totalItems
	};
}

export async function getThread(pb: PocketBase, id: string) {
	const record = await pb
		.collection('support_tickets')
		.getOne(id)
		.catch((e) => {
			if (isNotFound(e)) return null;
			throw e;
		});
	if (!record) return null;
	return { ticket: toTicket(record), messages: await messagesOf(pb, id) };
}

export async function replyAsAdmin(
	pb: PocketBase,
	ticketId: string,
	body: string,
	adminName: string
) {
	await pb.collection('support_messages').create({
		ticket: ticketId,
		sender: 'admin',
		authorName: adminName,
		body
	});
	await pb.collection('support_tickets').update(ticketId, { awaiting: 'customer' });
}

export const setTicketStatus = (pb: PocketBase, id: string, status: TicketStatus) =>
	pb.collection('support_tickets').update(id, { status });

/** Conversations waiting for an admin's reply; shown as a badge on the Support link. */
export async function countNeedingReply(pb: PocketBase): Promise<number> {
	const result = await pb.collection('support_tickets').getList(1, 1, {
		filter: 'status = "open" && awaiting = "admin"',
		fields: 'id'
	});
	return result.totalItems;
}
