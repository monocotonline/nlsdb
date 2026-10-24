import { defineEnvVars } from '@sveltejs/kit/env';

const optional = (fallback = '') => ({ schema: (value: string | undefined) => value || fallback });

export const variables = defineEnvVars({
	PB_URL: optional('http://127.0.0.1:8090'),
	PB_SUPERUSER_EMAIL: optional(),
	PB_SUPERUSER_PASSWORD: optional(),
	PAYSTACK_SECRET_KEY: optional()
});
