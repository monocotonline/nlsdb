import { dev } from '$app/env';
import { error, redirect } from '@sveltejs/kit';
import { mockOutcomes } from '#lib/server/payment.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	if (!dev) error(404);
	return { reference: url.searchParams.get('reference') ?? '' };
};

export const actions: Actions = {
	default: async ({ request }) => {
		if (!dev) error(404);
		const form = await request.formData();
		const reference = String(form.get('reference'));
		const outcome = form.get('outcome') === 'success' ? 'success' : 'failed';
		const existing = mockOutcomes.get(reference);
		if (existing) mockOutcomes.set(reference, { ...existing, status: outcome });
		redirect(303, `/checkout/callback?reference=${encodeURIComponent(reference)}`);
	}
};
