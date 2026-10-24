<script lang="ts">
	import { Tick02Icon } from '@hugeicons/core-free-icons';
	import Icon from '#lib/components/icon.svelte';
	import { cn } from '#lib/utils.js';

	type Option = { value: string; label: string; count?: number };

	let {
		options,
		value,
		label,
		onselect
	}: {
		options: Option[];
		value: string;
		/** Accessible name for the group. */
		label: string;
		onselect: (value: string) => void;
	} = $props();
</script>

<!-- One choice per row, like a settings screen: label on the left, count and tick on the right. -->
<div
	role="radiogroup"
	aria-label={label}
	class="divide-y overflow-hidden rounded-xl border bg-card"
>
	{#each options as option (option.value)}
		{@const selected = option.value === value}
		<button
			type="button"
			role="radio"
			aria-checked={selected}
			onclick={() => onselect(option.value)}
			class={cn(
				'flex min-h-12 w-full items-center gap-3 px-4 text-left text-sm transition-colors focus-visible:bg-muted focus-visible:outline-none active:bg-muted',
				selected && 'bg-accent/50 font-medium'
			)}
		>
			<span class="min-w-0 flex-1 truncate">{option.label}</span>
			{#if option.count !== undefined}
				<span class="text-xs text-muted-foreground tabular-nums">{option.count}</span>
			{/if}
			<span class="flex size-5 shrink-0 items-center justify-center text-primary">
				{#if selected}<Icon icon={Tick02Icon} size={18} strokeWidth={2.5} />{/if}
			</span>
		</button>
	{/each}
</div>
