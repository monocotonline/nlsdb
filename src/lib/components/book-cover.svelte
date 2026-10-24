<script lang="ts">
	import { cn } from '#lib/utils.js';

	let {
		src,
		title,
		class: className
	}: { src: string | null; title: string; class?: string } = $props();
</script>

<div class={cn('relative aspect-[3/4] overflow-hidden bg-muted', className)}>
	{#if src}
		<img {src} alt="Cover of {title}" class="size-full object-cover cover-img" loading="lazy" />
	{:else}
		<div class="flex size-full items-center justify-center p-4 text-center">
			<span class="line-clamp-4 font-serif text-sm leading-snug text-balance text-muted-foreground">
				{title}
			</span>
		</div>
	{/if}
</div>
