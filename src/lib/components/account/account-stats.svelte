<script lang="ts">
	import { formatNaira } from '#lib/format.js';

	let { stats }: { stats: { orders: number; items: number; spent: number } } = $props();

	const tiles = $derived([
		{ label: 'Orders', value: String(stats.orders) },
		{ label: 'Items bought', value: String(stats.items) },
		{ label: 'Total spent', value: formatNaira(stats.spent) }
	]);
</script>

<dl class="grid grid-cols-3 divide-x border-y">
	{#each tiles as tile, i (tile.label)}
		<div class={i === 0 ? 'py-6 pr-4 sm:py-8 sm:pr-8' : 'px-4 py-6 sm:px-8 sm:py-8'}>
			<dt class="mb-2 eyebrow">{tile.label}</dt>
			<dd class="font-serif text-2xl tracking-tight tabular-nums sm:text-4xl">{tile.value}</dd>
		</div>
	{/each}
</dl>
