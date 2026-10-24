<script lang="ts">
	import { Mail01Icon, MailSend01Icon } from '@hugeicons/core-free-icons';
	import { auth } from '#lib/auth.svelte.js';
	import AuthForm from '#lib/components/auth/auth-form.svelte';
	import Field from '#lib/components/field.svelte';
	import Icon from '#lib/components/icon.svelte';
	import { Button } from '#lib/components/ui/button/index.js';

	let sentTo = $state('');
	let email = $state('');
</script>

{#if sentTo}
	<div class="grid gap-5 text-center">
		<span class="mx-auto flex size-14 items-center justify-center rounded-full bg-accent">
			<Icon icon={MailSend01Icon} size={26} class="text-accent-foreground" />
		</span>
		<div class="space-y-1.5">
			<p class="font-semibold">Check your email</p>
			<p class="text-sm text-muted-foreground">
				If there's an account for <span class="font-medium text-foreground">{sentTo}</span>, we've
				sent a link to choose a new password. It can take a minute to arrive.
			</p>
		</div>
		<Button type="button" variant="outline" size="lg" onclick={() => (auth.mode = 'login')}>
			Back to log in
		</Button>
	</div>
{:else}
	<AuthForm
		path="/account/forgot"
		submitLabel="Send reset link"
		busyLabel="Sending…"
		onsuccess={() => {
			sentTo = email.trim();
		}}
	>
		{#snippet fields()}
			<Field
				label="Email"
				name="email"
				type="email"
				icon={Mail01Icon}
				autocomplete="email"
				placeholder="you@example.com"
				bind:value={email}
				required
			/>
		{/snippet}
	</AuthForm>
	<button
		type="button"
		class="-mt-2 text-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
		onclick={() => (auth.mode = 'login')}
	>
		Back to log in
	</button>
{/if}
