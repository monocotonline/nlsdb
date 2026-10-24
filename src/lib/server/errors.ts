import { ClientResponseError } from 'pocketbase';

/** An error whose message is safe to show to the user. */
export class FormError extends Error {}

/** Turns a PocketBase error into a message that can be shown to a user. */
export function errorMessage(e: unknown) {
	if (e instanceof ClientResponseError) {
		const fields = Object.entries(e.response?.data ?? {}).map(
			([k, v]) => `${k}: ${(v as { message: string }).message}`
		);
		return fields.length ? fields.join('; ') : e.message;
	}
	if (e instanceof FormError) return e.message;
	return 'Something went wrong';
}
