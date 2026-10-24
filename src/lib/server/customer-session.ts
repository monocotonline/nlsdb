import type { Cookies } from '@sveltejs/kit';

export const CUSTOMER_COOKIE = 'customer_token';

export function setCustomerSession(cookies: Cookies, token: string) {
	cookies.set(CUSTOMER_COOKIE, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 7
	});
}

/** Only allow same-site relative redirects (blocks `//evil.com` and absolute URLs). */
export function safeRedirect(target: string | null | undefined, fallback = '/account') {
	return target && /^\/(?![/\\])/.test(target) ? target : fallback;
}
