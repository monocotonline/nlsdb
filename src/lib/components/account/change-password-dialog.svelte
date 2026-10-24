<script lang="ts">
	import { LockPasswordIcon } from '@hugeicons/core-free-icons';
	import { enhance } from '$app/forms';
	import DialogHeading from '#lib/components/dialog-heading.svelte';
	import Field from '#lib/components/field.svelte';
	import { Alert, AlertDescription } from '#lib/components/ui/alert/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	let saving = $state(false);
	let error = $state('');
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="gap-6">
		<DialogHeading
			icon={LockPasswordIcon}
			title="Change password"
			description="Enter your current password, then choose a new one."
		/>

		<form
			method="POST"
			action="?/password"
			class="grid gap-4"
			use:enhance={() => {
				saving = true;
				error = '';
				return async ({ result, update }) => {
					saving = false;
					if (result.type === 'failure') {
						error = (result.data?.message as string | undefined) ?? 'Something went wrong';
						return;
					}
					await update({ reset: false });
					if (result.type === 'success') open = false;
				};
			}}
		>
			{#if error}
				<Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
			{/if}
			<Field
				label="Current password"
				name="oldPassword"
				type="password"
				icon={LockPasswordIcon}
				autocomplete="current-password"
				required
			/>
			<Field
				label="New password"
				name="password"
				type="password"
				icon={LockPasswordIcon}
				autocomplete="new-password"
				minlength={8}
				hint="At least 8 characters."
				required
			/>
			<div class="mt-1 grid grid-cols-2 gap-3">
				<Button type="button" variant="outline" size="lg" onclick={() => (open = false)}>
					Cancel
				</Button>
				<Button type="submit" size="lg" disabled={saving}>
					{saving ? 'Saving…' : 'Update password'}
				</Button>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
