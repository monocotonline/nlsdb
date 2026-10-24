import type { Cookies } from '@sveltejs/kit';

export const ADMIN_COOKIE = 'admin_token';

export function setAdminSession(cookies: Cookies, token: string) {
	cookies.set(ADMIN_COOKIE, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 7
	});
}
