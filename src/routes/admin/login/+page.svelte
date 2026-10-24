<script lang="ts">
	import {
		BookOpen01Icon,
		LockPasswordIcon,
		Mail01Icon,
		PackageIcon,
		Tick02Icon
	} from '@hugeicons/core-free-icons';
	import ThemeSwitcher from '#lib/components/theme-switcher.svelte';
	import Field from '#lib/components/field.svelte';
	import Icon from '#lib/components/icon.svelte';
	import { Alert, AlertDescription } from '#lib/components/ui/alert/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
	let loading = $state(false);

	const points = [
		'Manage products, images and categories',
		'Track every order and payment status',
		'Register fellow administrators'
	];
</script>

<svelte:head><title>Admin login · NLS Bookshop</title></svelte:head>

<div class="grid min-h-screen bg-background lg:grid-cols-[1.1fr_1fr]">
	<aside
		class="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between"
	>
		<div
			class="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-primary-foreground/10 blur-3xl"
		></div>
		<div
			class="pointer-events-none absolute -bottom-40 -left-24 size-[28rem] rounded-full bg-primary-foreground/10 blur-3xl"
		></div>

		<div class="relative flex items-center gap-3">
			<span class="flex size-10 items-center justify-center rounded-lg bg-primary-foreground/15">
				<Icon icon={BookOpen01Icon} size={22} />
			</span>
			<span class="font-semibold">NLS Bookshop</span>
		</div>

		<div class="relative max-w-md">
			<h1 class="text-4xl leading-tight font-semibold text-balance">
				Everything about the shop, in one place.
			</h1>
			<ul class="mt-8 space-y-4">
				{#each points as point (point)}
					<li class="flex items-center gap-3 text-primary-foreground/85">
						<span
							class="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15"
						>
							<Icon icon={Tick02Icon} size={14} strokeWidth={2.5} />
						</span>
						{point}
					</li>
				{/each}
			</ul>
		</div>

		<p class="relative flex items-center gap-2 text-sm text-primary-foreground/70">
			<Icon icon={PackageIcon} size={16} /> Nigerian Law School Digital Bookshop
		</p>
	</aside>

	<main class="relative flex items-center justify-center px-6 py-12">
		<ThemeSwitcher size="sm" class="absolute top-4 right-4" />
		<div class="w-full max-w-sm">
			<h2 class="text-2xl font-semibold">Admin sign in</h2>
			<p class="mt-2 text-sm text-muted-foreground">
				Use the credentials your administrator gave you.
			</p>

			<form
				method="POST"
				action="?/login"
				class="mt-8 grid gap-5"
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

			<p class="mt-8 text-center text-sm text-muted-foreground">
				<a href="/" class="underline-offset-4 hover:underline">← Back to the shop</a>
			</p>
		</div>
	</main>
</div>
