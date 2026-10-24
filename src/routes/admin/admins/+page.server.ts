import { fail } from '@sveltejs/kit';
import { setAdminSession } from '#lib/server/admin-session.js';
import { errorMessage } from '#lib/server/errors.js';
import { getSuperuserPb } from '#lib/server/pb.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const records = await locals.pb.collection('admins').getFullList({ sort: '@rowid' });
	return { admins: records.map((r) => ({ id: r.id, name: r.name, email: r.email })) };
};

export const actions: Actions = {
	// Any admin can set another admin's password (all admins are equally trusted). PocketBase only
	// lets the account owner change their own password, so this goes through the server's login.
	resetPassword: async ({ request, locals, cookies }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const password = String(form.get('password') ?? '');
		if (password.length < 8) {
			return fail(400, { message: 'The password must be at least 8 characters.' });
		}

		try {
			const su = await getSuperuserPb();
			const target = await su
				.collection('admins')
				.update(id, { password, passwordConfirm: password });
			// Changing a password signs that account out. If it was your own, sign you back in.
			if (locals.admin?.id === id) {
				await locals.pb.collection('admins').authWithPassword(target.email, password);
				setAdminSession(cookies, locals.pb.authStore.token);
			}
		} catch (e) {
			return fail(400, { message: errorMessage(e) });
		}
		return { success: true };
	},

	register: async ({ request, locals }) => {
		const form = await request.formData();
		const name = String(form.get('name') ?? '').trim();
		const email = String(form.get('email') ?? '').trim();
		const password = String(form.get('password') ?? '');
		try {
			await locals.pb
				.collection('admins')
				.create({ name, email, password, passwordConfirm: password });
		} catch (e) {
			return fail(400, { message: errorMessage(e) });
		}
		return { success: true };
	}
};
