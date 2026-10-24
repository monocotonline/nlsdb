<script lang="ts">
	import {
		FULFILMENT_LABELS,
		FULFILMENT_STEPS,
		fulfilmentProgress,
		type Fulfilment
	} from '#lib/fulfilment.js';
	import { cn } from '#lib/utils.js';

	let { fulfilment }: { fulfilment: Fulfilment } = $props();

	const done = $derived(fulfilmentProgress(fulfilment));
</script>

<!-- Three steps on a hairline: the line fills in as far as the order has got. -->
<ol class="grid grid-cols-3 border-y py-8" aria-label="Delivery progress">
	{#each FULFILMENT_STEPS as step, i (step)}
		{@const complete = i < done}
		{@const current = i === done - 1}
		<li class="relative pt-7">
			<span
				class={cn('absolute top-0 left-0 h-px w-full', complete ? 'bg-foreground' : 'bg-border')}
				aria-hidden="true"
			></span>
			<span
				class={cn(
					'absolute top-0 left-0 size-2 -translate-y-1/2',
					complete ? 'bg-foreground' : 'bg-border'
				)}
				aria-hidden="true"
			></span>
			<p class="mb-1.5 eyebrow">0{i + 1}</p>
			<p class={cn('font-serif text-lg', current ? 'text-foreground' : 'text-muted-foreground')}>
				{FULFILMENT_LABELS[step]}
			</p>
		</li>
	{/each}
</ol>
