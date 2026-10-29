<script lang="ts">
	import { Delete02Icon, Edit02Icon } from '@hugeicons/core-free-icons';
	import BookThumb from '#lib/components/admin/book-thumb.svelte';
	import Icon from '#lib/components/icon.svelte';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { typeInfo } from '#lib/product-types.js';
	import { formatNaira } from '#lib/format.js';
	import type { Book } from '#lib/types.js';

	let {
		book,
		onedit,
		ondelete
	}: { book: Book; onedit: (book: Book) => void; ondelete: (book: Book) => void } = $props();
</script>

<!-- Phone layout for one book: everything readable, with big tap targets. -->
<article class="rounded-lg border p-3">
	<div class="flex gap-3">
		<BookThumb {book} class="w-16" />
		<div class="min-w-0 flex-1">
			<h3 class="line-clamp-2 leading-snug font-semibold">{book.title}</h3>
			{#if book.author}
				<p class="mt-0.5 truncate text-sm text-muted-foreground">{book.author}</p>
			{/if}
			<div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
				<span class="font-semibold">{formatNaira(book.price)}</span>
				<Badge variant="outline">{typeInfo(book.type).label}</Badge>
				{#if book.category}
					<Badge variant="secondary">{book.category.name}</Badge>
				{:else if book.type === 'book'}
					<Badge variant="outline" class="text-muted-foreground">Uncategorised</Badge>
				{/if}
			</div>
		</div>
	</div>

	<div class="mt-3 grid grid-cols-2 gap-2 border-t pt-3">
		<Button variant="outline" onclick={() => onedit(book)}>
			<Icon icon={Edit02Icon} size={16} /> Edit
		</Button>
		<Button
			variant="outline"
			class="text-destructive hover:text-destructive"
			onclick={() => ondelete(book)}
		>
			<Icon icon={Delete02Icon} size={16} /> Delete
		</Button>
	</div>
</article>
