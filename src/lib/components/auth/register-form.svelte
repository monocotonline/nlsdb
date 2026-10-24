<script lang="ts">
	import { LockPasswordIcon, Mail01Icon, UserIcon } from '@hugeicons/core-free-icons';
	import AuthForm from '#lib/components/auth/auth-form.svelte';
	import Field from '#lib/components/field.svelte';

	let { onsuccess }: { onsuccess: () => void | Promise<void> } = $props();
</script>

<AuthForm path="/account/register" submitLabel="Create account" {onsuccess}>
	{#snippet fields()}
		<Field
			label="Full name"
			name="name"
			icon={UserIcon}
			autocomplete="name"
			placeholder="Ada Obi"
			required
		/>
		<Field
			label="Email"
			name="email"
			type="email"
			icon={Mail01Icon}
			autocomplete="email"
			placeholder="you@example.com"
			required
		/>
		<Field
			label="Password"
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
