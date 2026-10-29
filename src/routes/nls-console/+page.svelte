<script lang="ts">
	import { Add01Icon, BookOpen01Icon } from '@hugeicons/core-free-icons';
	import BookCard from '#lib/components/admin/book-card.svelte';
	import BooksTable from '#lib/components/admin/books-table.svelte';
	import DeleteBookDialog from '#lib/components/admin/delete-book-dialog.svelte';
	import Pagination from '#lib/components/admin/pagination.svelte';
	import ProductFilters from '#lib/components/admin/product-filters.svelte';
	import Icon from '#lib/components/icon.svelte';
	import { Alert, AlertDescription } from '#lib/components/ui/alert/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { catalogueHref, hasFilters } from '#lib/catalogue.js';
	import type { Book } from '#lib/types.js';
	import BookSheet from './book-sheet.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	// A new key each time the drawer opens, so it always starts with fresh form state.
	let sheet = $state<{ open: boolean; book: Book | null; key: number }>({
		open: false,
		book: null,
		key: 0
	});
	let removal = $state<{ open: boolean; book: Book | null }>({ open: false, book: null });

	function openSheet(book: Book | null) {
		sheet.book = book;
		sheet.key++;
		sheet.open = true;
	}
	const askDelete = (book: Book) => (removal = { open: true, book });

	// Adding while looking at one type or category starts the new product there.
	const defaultType = $derived(data.query.type);
	const defaultCategory = $derived(
		data.categories.find((c) => c.slug === data.query.category)?.id ?? ''
	);
	const filtered = $derived(hasFilters(data.query));
</script>

<div class="mb-6 flex items-center justify-between gap-4">
	<div>
		<h1 class="display text-3xl sm:text-4xl">Products</h1>
		<p class="text-sm text-muted-foreground">
			{#if filtered}{data.total} of {data.allCount} products{:else}{data.allCount} listed{/if}
		</p>
	</div>
	<Button onclick={() => openSheet(null)}><Icon icon={Add01Icon} /> Add product</Button>
</div>

{#if form?.message}
	<Alert variant="destructive" class="mb-4"
		><AlertDescription>{form.message}</AlertDescription></Alert
	>
{/if}

<ProductFilters
	query={data.query}
	types={data.typeCounts}
	categories={data.categoryCounts}
	allCount={data.allCount}
	uncategorised={data.uncategorised}
/>

{#if data.books.length === 0}
	<div class="flex flex-col items-center px-6 py-20 text-center">
		<span class="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
			<Icon icon={BookOpen01Icon} size={22} class="text-muted-foreground" />
		</span>
		<p class="font-serif text-2xl tracking-tight">
			{filtered ? 'No products match these filters' : 'No products yet'}
		</p>
		<p class="mt-1 text-sm text-muted-foreground">
			{filtered
				? 'Try a different search, type or category.'
				: 'Add your first product to get the shop started.'}
		</p>
		{#if filtered}
			<a
				href={catalogueHref(data.query, { category: '', type: '', q: '', sort: 'newest' })}
				class="mt-4 text-sm underline underline-offset-4"
			>
				Clear filters
			</a>
		{/if}
	</div>
{:else}
	<!-- Cards on phones, a table from the md breakpoint up. -->
	<div class="grid gap-3 md:hidden">
		{#each data.books as book (book.id)}
			<BookCard {book} onedit={openSheet} ondelete={askDelete} />
		{/each}
	</div>
	<div class="hidden md:block">
		<BooksTable books={data.books} onedit={openSheet} ondelete={askDelete} />
	</div>
{/if}

{#key sheet.key}
	<BookSheet
		bind:open={sheet.open}
		book={sheet.book}
		categories={data.categories}
		{defaultType}
		{defaultCategory}
	/>
{/key}

<Pagination
	page={data.page}
	totalPages={data.totalPages}
	hrefFor={(page) => catalogueHref(data.query, { page })}
/>

<DeleteBookDialog bind:open={removal.open} book={removal.book} />
