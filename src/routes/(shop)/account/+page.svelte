<script lang="ts">
	import AccountStats from '#lib/components/account/account-stats.svelte';
	import ChangePasswordDialog from '#lib/components/account/change-password-dialog.svelte';
	import OrderRow from '#lib/components/account/order-row.svelte';
	import OrdersEmpty from '#lib/components/account/orders-empty.svelte';
	import PageHeader from '#lib/components/page-header.svelte';
	import BookCard from '#lib/components/shop/book-card.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let changingPassword = $state(false);

	// Only paid orders count towards what has actually been bought.
	const stats = $derived.by(() => {
		const paid = data.orders.filter((o) => o.status === 'success');
		return {
			orders: data.orders.length,
			items: paid.reduce((n, o) => n + o.items.reduce((m, i) => m + i.quantity, 0), 0),
			spent: paid.reduce((sum, o) => sum + o.total, 0)
		};
	});

	const action = 'text-sm underline underline-offset-4 hover:no-underline';
</script>

<svelte:head><title>My account · NLS Bookshop</title></svelte:head>

<PageHeader
	eyebrow="Account"
	title={data.customer.name}
	description={data.customer.email}
	rule={false}
>
	{#snippet actions()}
		<button type="button" class={action} onclick={() => (changingPassword = true)}>
			Change password
		</button>
		<form method="POST" action="?/logout">
			<button type="submit" class={action}>Log out</button>
		</form>
	{/snippet}
</PageHeader>

<AccountStats {stats} />

<section class="mt-16 sm:mt-24">
	<h2 class="mb-6 eyebrow">Order history</h2>
	{#if data.orders.length === 0}
		<OrdersEmpty />
	{:else}
		<ul class="divide-y border-y">
			{#each data.orders as order (order.id)}
				<li><OrderRow {order} /></li>
			{/each}
		</ul>
	{/if}
</section>

{#if data.fresh.length > 0}
	<section class="mt-20 sm:mt-28">
		<h2 class="mb-10 display text-[clamp(1.9rem,3.4vw,2.75rem)]">Fresh in the shop</h2>
		<div class="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 lg:grid-cols-4">
			{#each data.fresh as book (book.id)}
				<BookCard {book} layout="grid" />
			{/each}
		</div>
	</section>
{/if}

<ChangePasswordDialog bind:open={changingPassword} />
