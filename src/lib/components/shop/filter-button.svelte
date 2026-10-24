<script lang="ts">
	import { cn } from '#lib/utils.js';

	let {
		count,
		onclick,
		class: className
	}: { count: number; onclick: () => void; class?: string } = $props();
</script>

<button
	type="button"
	class={cn(
		'h-10 border px-4 text-[11px] font-medium tracking-[0.12em] whitespace-nowrap uppercase transition-colors hover:bg-muted',
		className
	)}
	aria-label={count > 0 ? `Filters, ${count} active` : 'Filters'}
	{onclick}
>
	Filters{count > 0 ? ` (${count})` : ''}
</button>
