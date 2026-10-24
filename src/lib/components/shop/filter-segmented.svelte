<script lang="ts">
	import type { IconSvgElement } from '@hugeicons/svelte';
	import Icon from '#lib/components/icon.svelte';
	import { cn } from '#lib/utils.js';

	type Option = { value: string; label: string; icon?: IconSvgElement };

	let {
		options,
		value,
		label,
		onselect
	}: {
		options: Option[];
		value: string;
		label: string;
		onselect: (value: string) => void;
	} = $props();
</script>

<!-- Two or three equal-width choices in one bar. -->
<div
	role="radiogroup"
	aria-label={label}
	class="grid auto-cols-fr grid-flow-col gap-1 rounded-xl bg-muted p-1"
>
	{#each options as option (option.value)}
		{@const selected = option.value === value}
		<button
			type="button"
			role="radio"
			aria-checked={selected}
			onclick={() => onselect(option.value)}
			class={cn(
				'flex min-h-10 items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
				selected
					? 'bg-background text-foreground shadow-sm ring-1 ring-foreground/10'
					: 'text-muted-foreground'
			)}
		>
			{#if option.icon}<Icon icon={option.icon} size={17} />{/if}
			{option.label}
		</button>
	{/each}
</div>
