<script lang="ts">
	import { cn } from '#lib/utils.js';

	let { count, class: className }: { count: number; class?: string } = $props();
</script>

{#if count > 0}
	<span
		class={cn(
			'flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] leading-5 font-semibold text-primary-foreground',
			className
		)}
		aria-label="{count} waiting"
	>
		{count > 99 ? '99+' : count}
	</span>
{/if}
