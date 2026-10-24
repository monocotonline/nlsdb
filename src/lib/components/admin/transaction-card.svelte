<script lang="ts">
	import OrderActions from '#lib/components/admin/order-actions.svelte';
	import StatusBadge from '#lib/components/status-badge.svelte';
	import { FULFILMENT_LABELS } from '#lib/fulfilment.js';
	import { formatDate, formatNaira } from '#lib/format.js';
	import type { Order } from '#lib/types.js';

	let { order }: { order: Order } = $props();
</script>

<!-- Phone layout for one transaction: status and total up top, details below. -->
<article class="rounded-xl border bg-card">
	<header class="flex items-start justify-between gap-3 p-4 pb-3">
		<div class="min-w-0">
			<p class="truncate font-mono text-xs text-muted-foreground">{order.reference}</p>
			<p class="mt-1 text-xl font-semibold tracking-tight">{formatNaira(order.total)}</p>
		</div>
		<div class="flex items-center gap-1">
			<StatusBadge status={order.status} />
			<OrderActions {order} />
		</div>
	</header>

	<dl class="space-y-3 border-t px-4 py-3 text-sm">
		<div>
			<dt class="text-xs font-medium text-muted-foreground">Customer</dt>
			<dd class="mt-0.5">
				<p class="font-medium">{order.customerName}</p>
				<p class="text-muted-foreground">
					<a href="mailto:{order.email}" class="underline-offset-2 hover:underline">{order.email}</a
					>
				</p>
				<p class="text-muted-foreground">
					<a href="tel:{order.phone}" class="underline-offset-2 hover:underline">{order.phone}</a>
				</p>
			</dd>
		</div>
		<div>
			<dt class="text-xs font-medium text-muted-foreground">Deliver to</dt>
			<dd class="mt-0.5 text-muted-foreground">
				{order.address}, {order.city}, {order.state}
			</dd>
		</div>
		<div>
			<dt class="text-xs font-medium text-muted-foreground">Items</dt>
			<dd class="mt-0.5">
				<ul class="space-y-0.5">
					{#each order.items as item (item.id)}
						<li>
							{item.title}
							<span class="text-muted-foreground">× {item.quantity}</span>
						</li>
					{/each}
				</ul>
			</dd>
		</div>
		{#if order.status === 'success'}
			<div>
				<dt class="text-xs font-medium text-muted-foreground">Delivery</dt>
				<dd class="mt-0.5">{FULFILMENT_LABELS[order.fulfilment]}</dd>
			</div>
		{/if}
	</dl>

	<footer class="border-t px-4 py-2.5 text-xs text-muted-foreground">
		{formatDate(order.created)}
	</footer>
</article>
