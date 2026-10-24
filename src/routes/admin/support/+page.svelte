<script lang="ts">
	import { CustomerSupportIcon } from '@hugeicons/core-free-icons';
	import Pagination from '#lib/components/admin/pagination.svelte';
	import StatusFilter from '#lib/components/admin/status-filter.svelte';
	import TicketRow from '#lib/components/admin/ticket-row.svelte';
	import Icon from '#lib/components/icon.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const filters = [
		{ value: '', label: 'All' },
		{ value: 'open', label: 'Open' },
		{ value: 'resolved', label: 'Resolved' }
	];
	const href = (status: string, page = 1) => {
		const parts = [];
		if (status) parts.push(`status=${status}`);
		if (page > 1) parts.push(`page=${page}`);
		return `?${parts.join('&')}`;
	};
</script>

<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
	<div>
		<h1 class="text-2xl font-semibold">Support</h1>
		<p class="text-sm text-muted-foreground">
			Conversations started by customers. Replies show on the customer's private conversation page.
		</p>
	</div>
	<StatusFilter
		current={data.status}
		{filters}
		label="Filter conversations"
		hrefFor={(status) => href(status)}
	/>
</div>

{#if data.tickets.length === 0}
	<div
		class="flex flex-col items-center rounded-xl border border-dashed bg-card px-6 py-16 text-center"
	>
		<span class="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
			<Icon icon={CustomerSupportIcon} size={22} class="text-muted-foreground" />
		</span>
		<p class="font-medium">No conversations</p>
		<p class="mt-1 text-sm text-muted-foreground">
			{data.status ? 'Nothing matches this filter.' : 'Messages from customers will appear here.'}
		</p>
	</div>
{:else}
	<ul class="space-y-3">
		{#each data.tickets as ticket (ticket.id)}
			<li><TicketRow {ticket} /></li>
		{/each}
	</ul>
{/if}

<Pagination
	page={data.page}
	totalPages={data.totalPages}
	hrefFor={(page) => href(data.status, page)}
/>
