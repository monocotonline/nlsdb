<script lang="ts">
	import { cn } from '#lib/utils.js';

	let {
		name,
		size = 'md',
		class: className
	}: { name: string; size?: 'sm' | 'md' | 'lg'; class?: string } = $props();

	const initials = $derived(
		name
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase())
			.join('') || '?'
	);

	const sizes = {
		sm: 'size-7 text-[11px]',
		md: 'size-9 text-xs',
		lg: 'size-16 text-xl'
	} as const;
</script>

<span
	class={cn(
		'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary/40 font-semibold text-accent-foreground ring-1 ring-foreground/10',
		sizes[size],
		className
	)}
	aria-hidden="true"
>
	{initials}
</span>
