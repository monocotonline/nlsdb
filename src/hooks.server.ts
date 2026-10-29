import { redirect } from '@sveltejs/kit';
import type { Handle, HandleServerError, ServerInit } from '@sveltejs/kit/hooks';
import { PB_URL, createPb, toCustomer } from '#lib/server/pb.js';
import { ADMIN_COOKIE, setAdminSession } from '#lib/server/admin-session.js';
import { isUnreachable } from '#lib/server/pb-errors.js';

const CUSTOMER_COOKIE = 'customer_token';
const SESSION_SECONDS = 60 * 60 * 24 * 7;

/** On startup, say which PocketBase the shop is using and whether it can be reached. */
export const init: ServerInit = async () => {
	const override = process.env.PB_URL
		? ' (from the PB_URL environment variable, which overrides .env)'
		: '';
	console.log(`[shop] PocketBase: ${PB_URL}${override}`);
	try {
		const res = await fetch(`${PB_URL}/api/health`, { signal: AbortSignal.timeout(3000) });
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		console.log('[shop] PocketBase is reachable.');
	} catch {
		console.error(
			`[shop] Cannot reach PocketBase at ${PB_URL}. Is it running? ` +
				'Check PB_URL in .env, and in your terminal with: echo $PB_URL'
		);
	}
};

export const handleError: HandleServerError = ({ error, event }) => {
	if (isUnreachable(error)) {
		console.error(
			`[shop] PocketBase is unreachable at ${PB_URL} (${event.request.method} ${event.url.pathname})`
		);
		return { message: 'The shop is temporarily unavailable. Please try again in a moment.' };
	}
	console.error(error);
};

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;
	const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');

	event.locals.pb = createPb();
	event.locals.admin = null;
	event.locals.customer = null;

	const token = event.cookies.get(ADMIN_COOKIE);
	if (isAdminRoute && token) {
		event.locals.pb.authStore.save(token, null);
		try {
			const { record, token: fresh } = await event.locals.pb.collection('admins').authRefresh();
			event.locals.admin = { id: record.id, email: record.email, name: record.name };
			setAdminSession(event.cookies, fresh);
		} catch {
			event.locals.pb.authStore.clear();
			event.cookies.delete(ADMIN_COOKIE, { path: '/' });
		}
	}

	const customerToken = event.cookies.get(CUSTOMER_COOKIE);
	if (!isAdminRoute && customerToken) {
		const customerPb = createPb();
		customerPb.authStore.save(customerToken, null);
		try {
			const { record, token } = await customerPb.collection('customers').authRefresh();
			event.locals.customer = toCustomer(record);
			event.cookies.set(CUSTOMER_COOKIE, token, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				maxAge: SESSION_SECONDS
			});
		} catch {
			event.cookies.delete(CUSTOMER_COOKIE, { path: '/' });
		}
	}

	if (isAdminRoute && pathname !== '/admin/login' && !event.locals.admin) {
		redirect(303, '/admin/login');
	}

	// Every page, the admin included, gets the Editorial look (see layout.css).
	return resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace('<html lang="en">', '<html lang="en" class="editorial">')
	});
};
