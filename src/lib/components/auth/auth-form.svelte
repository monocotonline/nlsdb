<script lang="ts">
	import type { Snippet } from 'svelte';
	import { postJson } from '#lib/auth-client.js';
	import { Alert, AlertDescription } from '#lib/components/ui/alert/index.js';
	import { Button } from '#lib/components/ui/button/index.js';

	let {
		path,
		extra = {},
		submitLabel,
		busyLabel = 'Please wait…',
		onsuccess,
		fields
	}: {
		/** The account endpoint to POST the fields to, e.g. /account/login. */
		path: string;
		/** Values added to the fields (for example a reset token). */
		extra?: Record<string, string>;
		submitLabel: string;
		busyLabel?: string;
		onsuccess: () => void | Promise<void>;
		fields: Snippet;
	} = $props();

	let error = $state('');
	let loading = $state(false);

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		error = '';
		loading = true;
		const data = Object.fromEntries(new FormData(event.currentTarget as HTMLFormElement));
		const result = await postJson(path, { ...data, ...extra });
		loading = false;
		if (result.ok) await onsuccess();
		else error = result.message;
	}
</script>

<!-- The shared shell for every sign-in form: errors, the busy state and the submit button. -->
<form onsubmit={submit} class="grid gap-4">
	{#if error}
		<Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
	{/if}

	{@render fields()}

	<Button type="submit" size="lg" class="mt-1 w-full" disabled={loading}>
		{loading ? busyLabel : submitLabel}
	</Button>
</form>
