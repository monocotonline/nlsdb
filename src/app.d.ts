import type PocketBase from 'pocketbase';
import type { Customer } from '#lib/types.js';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			/** PocketBase client; authenticated as the admin on /admin routes when logged in. */
			pb: PocketBase;
			admin: { id: string; email: string; name: string } | null;
			/** Logged-in shop customer (optional; guests are null). */
			customer: Customer | null;
		}
	}
}

export {};
