<script lang="ts">
	import { Delete02Icon, Edit02Icon } from '@hugeicons/core-free-icons';
	import BookThumb from '#lib/components/admin/book-thumb.svelte';
	import Icon from '#lib/components/icon.svelte';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import { typeInfo } from '#lib/product-types.js';
	import { formatNaira } from '#lib/format.js';
	import type { Book } from '#lib/types.js';

	let {
		books,
		onedit,
		ondelete
	}: { books: Book[]; onedit: (book: Book) => void; ondelete: (book: Book) => void } = $props();
</script>

<!-- Desktop / tablet layout. -->
<Card.Root class="py-0">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-16 pl-6">Cover</Table.Head>
				<Table.Head>Title</Table.Head>
				<Table.Head>Author / brand</Table.Head>
				<Table.Head>Type</Table.Head>
				<Table.Head>Category</Table.Head>
				<Table.Head class="text-right">Price</Table.Head>
				<Table.Head class="w-28 pr-6"></Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each books as book (book.id)}
				<Table.Row>
					<Table.Cell class="pl-6"><BookThumb {book} class="w-10" /></Table.Cell>
					<Table.Cell class="font-medium whitespace-normal">{book.title}</Table.Cell>
					<Table.Cell class="text-muted-foreground">{book.author || '—'}</Table.Cell>
					<Table.Cell class="text-muted-foreground">{typeInfo(book.type).label}</Table.Cell>
					<Table.Cell>
						{#if book.category}
							<Badge variant="secondary">{book.category.name}</Badge>
						{:else if book.type === 'book'}
							<span class="text-xs text-muted-foreground">Uncategorised</span>
						{:else}
							<span class="text-muted-foreground">—</span>
						{/if}
					</Table.Cell>
					<Table.Cell class="text-right">{formatNaira(book.price)}</Table.Cell>
					<Table.Cell class="pr-6">
						<div class="flex justify-end gap-1">
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label="Edit {book.title}"
								onclick={() => onedit(book)}
							>
								<Icon icon={Edit02Icon} />
							</Button>
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label="Delete {book.title}"
								class="text-muted-foreground hover:text-destructive"
								onclick={() => ondelete(book)}
							>
								<Icon icon={Delete02Icon} />
							</Button>
						</div>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</Card.Root>
