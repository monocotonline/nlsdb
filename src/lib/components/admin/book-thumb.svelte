<script lang="ts">
	import { cn } from '#lib/utils.js';
	import type { Book } from '#lib/types.js';

	let { book, class: className }: { book: Book; class?: string } = $props();
</script>

<!-- Cover thumbnail with a small badge when the book has more than one image. -->
<div class={cn('relative aspect-[3/4] shrink-0', className)}>
	{#if book.coverUrl}
		<img src={book.coverUrl} alt="" class="size-full rounded-md border object-cover" />
	{:else}
		<div class="size-full rounded-md border bg-muted"></div>
	{/if}
	{#if book.images.length > 1}
		<span
			class="absolute -right-1.5 -bottom-1.5 rounded-full bg-foreground px-1.5 text-[10px] font-semibold text-background"
		>
			{book.images.length}
		</span>
	{/if}
</div>
