<script lang="ts">
	import { LockPasswordIcon } from '@hugeicons/core-free-icons';
	import { auth } from '#lib/auth.svelte.js';
	import AuthForm from '#lib/components/auth/auth-form.svelte';
	import Field from '#lib/components/field.svelte';

	// After a successful reset, send the person to log in with a confirmation.
	function done() {
		auth.token = null;
		auth.notice = 'Password updated. Log in with your new password.';
		auth.mode = 'login';
	}
</script>

<AuthForm
	path="/account/reset"
	extra={{ token: auth.token ?? '' }}
	submitLabel="Update password"
	busyLabel="Updating…"
	onsuccess={done}
>
	{#snippet fields()}
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
	{/snippet}
</AuthForm>
