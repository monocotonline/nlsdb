<script lang="ts">
	import { LockPasswordIcon, Mail01Icon } from '@hugeicons/core-free-icons';
	import ThemeSwitcher from '#lib/components/theme-switcher.svelte';
	import Field from '#lib/components/field.svelte';
	import { Alert, AlertDescription } from '#lib/components/ui/alert/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
	let loading = $state(false);
</script>

<svelte:head><title>Admin login · NLS Bookshop</title></svelte:head>

<div class="flex min-h-screen flex-col bg-background">
	<header class="border-b">
		<div class="shell flex h-16 items-center justify-between sm:h-[76px]">
			<a href="/" class="flex items-baseline gap-3">
				<span class="font-serif text-xl tracking-tight sm:text-[22px]">NLS Bookshop</span>
				<span class="eyebrow">Admin</span>
			</a>
			<ThemeSwitcher size="sm" />
		</div>
	</header>

	<main class="flex flex-1 items-center justify-center px-6 py-16">
		<div class="w-full max-w-sm">
			<p class="mb-4 eyebrow">Admin</p>
			<h1 class="display text-4xl">Sign in</h1>
			<p class="mt-4 text-muted-foreground">Use the credentials your administrator gave you.</p>

			<form
				method="POST"
				action="?/login"
				class="mt-10 grid gap-5"
				onsubmit={() => (loading = true)}
			>
				{#if form?.message}
					<Alert variant="destructive"><AlertDescription>{form.message}</AlertDescription></Alert>
				{/if}
				<Field
					label="Email"
					name="email"
					type="email"
					icon={Mail01Icon}
					autocomplete="email"
					placeholder="admin@example.com"
					value={form?.email ?? ''}
					required
				/>
				<Field
					label="Password"
					name="password"
					type="password"
					icon={LockPasswordIcon}
					autocomplete="current-password"
					required
				/>
				<Button type="submit" size="lg" class="mt-1 w-full" disabled={loading}>
					{loading ? 'Signing in…' : 'Sign in'}
				</Button>
			</form>

			<p class="mt-10 text-sm text-muted-foreground">
				<a href="/" class="underline underline-offset-4 hover:text-foreground">← Back to the shop</a
				>
			</p>
		</div>
	</main>
</div>
