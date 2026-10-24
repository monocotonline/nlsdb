<script lang="ts">
	import { openAuth } from '#lib/auth.svelte.js';
	import ThemeSwitcher from '#lib/components/theme-switcher.svelte';
	import type { Customer } from '#lib/types.js';

	let {
		categories,
		customer
	}: { categories: { name: string; slug: string }[]; customer: Customer | null } = $props();

	const link = 'text-sm text-muted-foreground transition-colors hover:text-foreground';
</script>

<footer class="border-t">
	<div class="shell grid gap-12 py-14 sm:grid-cols-2 sm:py-20 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
		<div class="max-w-xs">
			<a href="/" class="font-serif text-2xl tracking-tight">NLS Bookshop</a>
			<p class="mt-4 text-sm leading-relaxed text-muted-foreground">
				Books, apparel and Law School essentials, delivered to your door. Order as a guest or with
				an account.
			</p>
		</div>

		<div>
			<h3 class="mb-5 eyebrow">Shop</h3>
			<ul class="space-y-3">
				<li><a href="/#products" class={link}>All products</a></li>
				{#each categories as category (category.slug)}
					<li><a href="/?category={category.slug}#products" class={link}>{category.name}</a></li>
				{/each}
			</ul>
		</div>

		<div>
			<h3 class="mb-5 eyebrow">Account</h3>
			<ul class="space-y-3">
				{#if customer}
					<li><a href="/account" class={link}>My orders</a></li>
				{:else}
					<li>
						<button type="button" class={link} onclick={() => openAuth('login')}>Log in</button>
					</li>
					<li>
						<button type="button" class={link} onclick={() => openAuth('register')}>
							Create an account
						</button>
					</li>
				{/if}
				<li><a href="/cart" class={link}>Cart</a></li>
			</ul>
		</div>

		<div>
			<h3 class="mb-5 eyebrow">Help</h3>
			<ul class="space-y-3">
				<li><a href="/support" class={link}>Contact support</a></li>
				<li><a href="/support#track" class={link}>Find your order</a></li>
			</ul>
		</div>
	</div>

	<div class="border-t">
		<div
			class="shell flex flex-col items-start justify-between gap-5 py-6 text-[13px] text-muted-foreground sm:flex-row sm:items-center"
		>
			<p>
				© {new Date().getFullYear()} Nigerian Law School. Physical items, delivered to your address.
			</p>
			<!-- Phones only: from sm up the switcher is in the header, so it is never shown twice. -->
			<div class="sm:hidden"><ThemeSwitcher /></div>
		</div>
	</div>
</footer>
