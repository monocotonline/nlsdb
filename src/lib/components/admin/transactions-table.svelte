<script lang="ts">
	import OrderActions from '#lib/components/admin/order-actions.svelte';
	import StatusBadge from '#lib/components/status-badge.svelte';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import { FULFILMENT_LABELS } from '#lib/fulfilment.js';
	import { formatDate, formatNaira } from '#lib/format.js';
	import type { Order } from '#lib/types.js';

	let { orders }: { orders: Order[] } = $props();

	const units = (order: Order) => order.items.reduce((sum, i) => sum + i.quantity, 0);
</script>

<!-- Desktop / tablet layout. -->
<Card.Root class="py-0">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="pl-6">Order</Table.Head>
				<Table.Head>Customer</Table.Head>
				<Table.Head>Items</Table.Head>
				<Table.Head class="text-right">Total</Table.Head>
				<Table.Head>Payment</Table.Head>
				<Table.Head class="w-16 pr-6 text-right">Actions</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each orders as order (order.id)}
				<Table.Row class="align-top">
					<Table.Cell class="py-4 pl-6">
						<span class="block font-mono text-xs">{order.reference}</span>
						<span class="mt-1 block text-xs text-muted-foreground">{formatDate(order.created)}</span
						>
					</Table.Cell>
					<Table.Cell class="max-w-64 py-4 whitespace-normal">
						<span class="block font-medium">{order.customerName}</span>
						<span class="block truncate text-muted-foreground">{order.email}</span>
						<span class="block text-muted-foreground">{order.phone}</span>
						<span class="mt-1 block text-xs text-muted-foreground">
							{order.address}, {order.city}, {order.state}
						</span>
					</Table.Cell>
					<Table.Cell class="max-w-64 py-4 whitespace-normal">
						<ul class="space-y-1">
							{#each order.items as item (item.id)}
								<li class="flex gap-2">
									<span class="w-6 shrink-0 text-muted-foreground tabular-nums"
										>{item.quantity}×</span
									>
									<span>{item.title}</span>
								</li>
							{/each}
						</ul>
					</Table.Cell>
					<Table.Cell class="py-4 text-right whitespace-nowrap">
						<span class="block font-semibold">{formatNaira(order.total)}</span>
						<span class="block text-xs text-muted-foreground">
							{units(order)}
							{units(order) === 1 ? 'item' : 'items'}
						</span>
					</Table.Cell>
					<Table.Cell class="py-4">
						<StatusBadge status={order.status} />
						{#if order.status === 'success'}
							<span class="mt-1.5 block text-xs text-muted-foreground">
								{FULFILMENT_LABELS[order.fulfilment]}
							</span>
						{/if}
					</Table.Cell>
					<Table.Cell class="py-4 pr-6 text-right"><OrderActions {order} /></Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</Card.Root>
