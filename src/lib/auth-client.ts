export type PostResult = { ok: true } | { ok: false; message: string };

/** POSTs JSON to one of the account endpoints and turns any failure into a readable message. */
export async function postJson(path: string, body: unknown): Promise<PostResult> {
	try {
		const res = await fetch(path, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body)
		});
		if (!res.ok) {
			const data = await res.json().catch(() => ({}));
			return { ok: false, message: data.message ?? 'Something went wrong' };
		}
		return { ok: true };
	} catch {
		return { ok: false, message: 'Could not reach the server. Please try again.' };
	}
}
