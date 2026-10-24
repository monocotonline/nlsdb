<script lang="ts">
	import AuthDialog from '#lib/components/auth-dialog.svelte';
	import ShopFooter from '#lib/components/shop/shop-footer.svelte';
	import ShopHeader from '#lib/components/shop/shop-header.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<AuthDialog />

<div class="flex min-h-screen flex-col">
	<ShopHeader cartCount={data.cartCount} customer={data.customer} />

	<main class="flex-1">
		<div class="shell pb-20 sm:pb-28">
			{@render children()}
		</div>
	</main>

	<ShopFooter categories={data.navCategories} customer={data.customer} />
</div>
