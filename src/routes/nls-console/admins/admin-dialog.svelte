<script lang="ts">
	import {
		LockPasswordIcon,
		Mail01Icon,
		ShieldUserIcon,
		UserIcon
	} from '@hugeicons/core-free-icons';
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
			icon={ShieldUserIcon}
			title="Register an admin"
			description="They can sign in to the admin area straight away."
		/>

		<form
			method="POST"
			action="?/register"
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
				label="Full name"
				name="name"
				icon={UserIcon}
				autocomplete="off"
				placeholder="Ada Obi"
				required
			/>
			<Field
				label="Email"
				name="email"
				type="email"
				icon={Mail01Icon}
				autocomplete="off"
				placeholder="admin@example.com"
				required
			/>
			<Field
				label="Password"
				name="password"
				type="password"
				icon={LockPasswordIcon}
				autocomplete="new-password"
				minlength={8}
				hint="At least 8 characters. Share it with them securely."
				required
			/>
			<div class="mt-1 grid grid-cols-2 gap-3">
				<Button type="button" variant="outline" size="lg" onclick={() => (open = false)}>
					Cancel
				</Button>
				<Button type="submit" size="lg" disabled={saving}>
					{saving ? 'Registering…' : 'Register admin'}
				</Button>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
