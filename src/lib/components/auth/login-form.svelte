<script lang="ts">
	import { LockPasswordIcon, Mail01Icon } from '@hugeicons/core-free-icons';
	import { auth } from '#lib/auth.svelte.js';
	import AuthForm from '#lib/components/auth/auth-form.svelte';
	import Field from '#lib/components/field.svelte';

	let { onsuccess }: { onsuccess: () => void | Promise<void> } = $props();
</script>

<AuthForm path="/account/login" submitLabel="Log in" {onsuccess}>
	{#snippet fields()}
		<Field
			label="Email"
			name="email"
			type="email"
			icon={Mail01Icon}
			autocomplete="email"
			placeholder="you@example.com"
			required
		/>
		<div class="grid gap-2">
			<Field
				label="Password"
				name="password"
				type="password"
				icon={LockPasswordIcon}
				autocomplete="current-password"
				required
			/>
			<button
				type="button"
				class="justify-self-end text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
				onclick={() => (auth.mode = 'forgot')}
			>
				Forgot password?
			</button>
		</div>
	{/snippet}
</AuthForm>
