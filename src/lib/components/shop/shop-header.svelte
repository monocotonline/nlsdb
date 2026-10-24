<script lang="ts">
	import { page } from '$app/state';
	import { openAuth } from '#lib/auth.svelte.js';
	import ThemeSwitcher from '#lib/components/theme-switcher.svelte';
	import { cn } from '#lib/utils.js';
	import type { Customer } from '#lib/types.js';

	let { cartCount, customer }: { cartCount: number; customer: Customer | null } = $props();

	const path = $derived(page.url.pathname);
	const current = $derived({
		shop: path === '/' || path.startsWith('/products'),
		support: path.startsWith('/support'),
		account: path.startsWith('/account'),
		cart: path.startsWith('/cart') || path.startsWith('/checkout')
	});

	const link =
		'border-b border-transparent pb-0.5 transition-colors hover:text-foreground aria-[current=page]:border-foreground aria-[current=page]:text-foreground';
</script>

<!-- The line under the bar spans the screen; the wordmark and links share the page's margins. -->
<header class="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
	<div class="shell flex h-16 items-center justify-between sm:h-[76px]">
		<a href="/" class="font-serif text-xl tracking-tight sm:text-[22px]">NLS Bookshop</a>

		<nav
			aria-label="Main"
			class="flex items-center gap-4 text-[11px] tracking-[0.1em] text-muted-foreground uppercase sm:gap-9 sm:text-xs"
		>
			<a
				href="/#products"
				aria-current={current.shop ? 'page' : undefined}
				class={cn(link, 'max-sm:hidden')}
			>
				Shop
			</a>
			<a
				href="/support"
				aria-current={current.support ? 'page' : undefined}
				class={cn(link, 'max-sm:hidden')}
			>
				Support
			</a>

			{#if customer}
				<a href="/account" aria-current={current.account ? 'page' : undefined} class={link}
					>Account</a
				>
			{:else}
				<button type="button" class={cn(link, 'uppercase')} onclick={() => openAuth('login')}>
					Log in
				</button>
			{/if}

			<a href="/cart" aria-current={current.cart ? 'page' : undefined} class={link}>
				Cart{cartCount > 0 ? ` (${cartCount})` : ''}
			</a>

			<!-- The footer carries the switcher on phones, so the header is never crowded. -->
			<div class="-my-1 hidden sm:block"><ThemeSwitcher size="sm" /></div>
		</nav>
	</div>
</header>
