<script lang="ts">
	import { CreditCardIcon } from '@hugeicons/core-free-icons';
	import Pagination from '#lib/components/admin/pagination.svelte';
	import StatusFilter from '#lib/components/admin/status-filter.svelte';
	import TransactionCard from '#lib/components/admin/transaction-card.svelte';
	import TransactionsTable from '#lib/components/admin/transactions-table.svelte';
	import Icon from '#lib/components/icon.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const href = (status: string, page = 1) => {
		const parts = [];
		if (status) parts.push(`status=${status}`);
		if (page > 1) parts.push(`page=${page}`);
		return `?${parts.join('&')}`;
	};
</script>

<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
	<div>
		<h1 class="text-2xl font-semibold">Transactions</h1>
		<p class="mt-1 max-w-xl text-sm text-muted-foreground">
			Open an order's menu to update its delivery (Processing, Shipped, Delivered) once it is paid,
			or to copy a payment link or cancel it while it is unpaid.
		</p>
	</div>
	<StatusFilter current={data.status} hrefFor={(status) => href(status)} />
</div>

{#if data.orders.length === 0}
	<div
		class="flex flex-col items-center rounded-xl border border-dashed bg-card px-6 py-16 text-center"
	>
		<span class="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
			<Icon icon={CreditCardIcon} size={22} class="text-muted-foreground" />
		</span>
		<p class="font-medium">No transactions</p>
		<p class="mt-1 text-sm text-muted-foreground">
			{data.status
				? 'Nothing matches this filter.'
				: 'Orders will appear here once customers check out.'}
		</p>
	</div>
{:else}
	<!-- Cards on phones, a table from the md breakpoint up. -->
	<div class="grid gap-3 md:hidden">
		{#each data.orders as order (order.id)}
			<TransactionCard {order} />
		{/each}
	</div>
	<div class="hidden md:block"><TransactionsTable orders={data.orders} /></div>
{/if}

<Pagination
	page={data.page}
	totalPages={data.totalPages}
	hrefFor={(page) => href(data.status, page)}
/>
