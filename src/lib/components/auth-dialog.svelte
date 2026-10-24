<script lang="ts">
	import { BookOpen01Icon, LockPasswordIcon } from '@hugeicons/core-free-icons';
	import { goto, refreshAll } from '$app/navigation';
	import { page } from '$app/state';
	import { auth } from '#lib/auth.svelte.js';
	import AuthTabs from '#lib/components/auth/auth-tabs.svelte';
	import ForgotForm from '#lib/components/auth/forgot-form.svelte';
	import LoginForm from '#lib/components/auth/login-form.svelte';
	import RegisterForm from '#lib/components/auth/register-form.svelte';
	import ResetForm from '#lib/components/auth/reset-form.svelte';
	import Icon from '#lib/components/icon.svelte';
	import { Alert, AlertDescription } from '#lib/components/ui/alert/index.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';

	const copy = {
		login: {
			title: 'Welcome back',
			description: 'Log in to see your orders and check out faster.'
		},
		register: {
			title: 'Create your account',
			description: 'Save your details and keep track of every order.'
		},
		forgot: {
			title: 'Forgot your password?',
			description: "Enter your email and we'll send you a link to choose a new one."
		},
		reset: {
			title: 'Choose a new password',
			description: 'Pick something you will remember, at least 8 characters.'
		}
	} as const;

	// Links such as /account/login or an emailed reset link (/?auth=reset&token=…) open the
	// dialog in place on the home page.
	$effect(() => {
		const mode = page.url.searchParams.get('auth');
		if (mode === 'login' || mode === 'register') {
			auth.mode = mode;
			auth.redirectTo = page.url.searchParams.get('redirectTo');
			auth.open = true;
		} else if (mode === 'reset') {
			auth.mode = 'reset';
			auth.token = page.url.searchParams.get('token');
			auth.open = true;
		}
	});

	// The notice ("Password updated") belongs to one visit to the dialog, so clear it on close.
	$effect(() => {
		if (!auth.open) auth.notice = '';
	});

	async function stripAuthParams() {
		const url = new URL(page.url.href);
		if (!url.searchParams.has('auth')) return;
		for (const key of ['auth', 'redirectTo', 'token']) url.searchParams.delete(key);
		await goto(url, { replace: true, shallow: true });
	}

	function onOpenChange(open: boolean) {
		if (!open) stripAuthParams();
	}

	// After logging in or registering: close, tidy the address, and refresh (or go where asked).
	async function signedIn() {
		const target = auth.redirectTo;
		auth.open = false;
		auth.redirectTo = null;
		await stripAuthParams();
		if (target && target !== page.url.pathname) await goto(target, { refreshAll: true });
		else await refreshAll();
	}
</script>

<Dialog.Root bind:open={auth.open} {onOpenChange}>
	<Dialog.Content class="gap-6">
		<div class="flex flex-col items-center gap-3 pt-2 text-center">
			<span
				class="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"
			>
				<Icon
					icon={auth.mode === 'forgot' || auth.mode === 'reset' ? LockPasswordIcon : BookOpen01Icon}
					size={24}
				/>
			</span>
			<div class="space-y-1.5">
				<Dialog.Title class="text-xl font-semibold">{copy[auth.mode].title}</Dialog.Title>
				<Dialog.Description class="text-sm text-muted-foreground">
					{copy[auth.mode].description}
				</Dialog.Description>
			</div>
		</div>

		{#if auth.mode === 'login' || auth.mode === 'register'}
			<AuthTabs />
		{/if}

		{#if auth.notice}
			<Alert><AlertDescription>{auth.notice}</AlertDescription></Alert>
		{/if}

		<!-- A new form each time the mode changes, so nothing typed carries over. -->
		{#key auth.mode}
			{#if auth.mode === 'login'}
				<LoginForm onsuccess={signedIn} />
			{:else if auth.mode === 'register'}
				<RegisterForm onsuccess={signedIn} />
			{:else if auth.mode === 'forgot'}
				<ForgotForm />
			{:else}
				<ResetForm />
			{/if}
		{/key}

		<p class="text-center text-sm text-muted-foreground">
			No account needed to buy.
			<button
				type="button"
				class="font-medium text-foreground underline-offset-4 hover:underline"
				onclick={() => (auth.open = false)}
			>
				Continue as guest
			</button>
		</p>
	</Dialog.Content>
</Dialog.Root>
