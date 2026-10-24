<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';

	type Filter = { value: string; label: string };

	const ORDER_FILTERS: Filter[] = [
		{ value: '', label: 'All' },
		{ value: 'success', label: 'Paid' },
		{ value: 'pending', label: 'Pending' },
		{ value: 'failed', label: 'Failed' },
		{ value: 'cancelled', label: 'Cancelled' }
	];

	let {
		current,
		hrefFor,
		filters = ORDER_FILTERS,
		label = 'Filter by status'
	}: {
		current: string;
		hrefFor: (status: string) => string;
		filters?: Filter[];
		label?: string;
	} = $props();
</script>

<!-- Full width with equal tabs on phones; compact on larger screens. -->
<div
	class="grid auto-cols-fr grid-flow-col gap-1 rounded-lg border bg-background p-1 sm:inline-grid"
	role="group"
	aria-label={label}
>
	{#each filters as f (f.value)}
		<Button
			href={hrefFor(f.value)}
			size="sm"
			variant={current === f.value ? 'secondary' : 'ghost'}
			aria-current={current === f.value ? 'true' : undefined}
		>
			{f.label}
		</Button>
	{/each}
</div>
