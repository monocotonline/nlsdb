<script lang="ts">
	import StatusBadge from '#lib/components/status-badge.svelte';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { FULFILMENT_LABELS } from '#lib/fulfilment.js';
	import { formatDate, formatNaira } from '#lib/format.js';
	import type { Order } from '#lib/types.js';

	let { order }: { order: Order } = $props();

	const units = $derived(order.items.reduce((sum, item) => sum + item.quantity, 0));
	// "Civil Litigation, Property Law +2 more" keeps long orders to one tidy line.
	const summary = $derived.by(() => {
		const titles = order.items.map((i) => i.title);
		const shown = titles.slice(0, 2).join(', ');
		return titles.length > 2 ? `${shown} +${titles.length - 2} more` : shown;
	});
</script>

<a
	href="/orders/{order.reference}"
	class="group flex items-start justify-between gap-6 py-7 transition-colors hover:bg-muted/40 sm:gap-10"
>
	<div class="min-w-0">
		<div class="flex flex-wrap items-center gap-x-3 gap-y-2">
			<p class="font-mono text-[13px] tracking-tight underline-offset-4 group-hover:underline">
				{order.reference}
			</p>
			<StatusBadge status={order.status} />
			{#if order.status === 'success'}
				<Badge variant="outline">{FULFILMENT_LABELS[order.fulfilment]}</Badge>
			{/if}
		</div>
		<p class="mt-3 truncate font-serif text-lg">{summary}</p>
		<p class="mt-1 text-[13px] text-muted-foreground">
			{formatDate(order.created)} · {units}
			{units === 1 ? 'item' : 'items'}
		</p>
	</div>
	<p class="font-serif text-xl whitespace-nowrap tabular-nums sm:text-2xl">
		{formatNaira(order.total)}
	</p>
</a>
