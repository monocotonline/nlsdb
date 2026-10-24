import { fail, redirect } from '@sveltejs/kit';
import { ADMIN_COOKIE, setAdminSession } from '#lib/server/admin-session.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.admin) redirect(303, '/admin');
};

export const actions: Actions = {
	login: async ({ request, locals, cookies }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();
		const password = String(form.get('password') ?? '');
		try {
			await locals.pb.collection('admins').authWithPassword(email, password);
		} catch {
			return fail(400, { email, message: 'Invalid email or password' });
		}
		setAdminSession(cookies, locals.pb.authStore.token);
		redirect(303, '/admin');
	},
	logout: async ({ cookies, locals }) => {
		locals.pb.authStore.clear();
		cookies.delete(ADMIN_COOKIE, { path: '/' });
		redirect(303, '/admin/login');
	}
};
