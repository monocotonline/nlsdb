<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	data-slot="dropdown-menu-label"
	class={cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', className)}
	{...restProps}
></div>
