<script lang="ts">
	import { page } from '$app/state';
	import { PAGE_SIZE, catalogueHref, hasFilters } from '#lib/catalogue.js';
	import Seo from '#lib/components/seo.svelte';
	import ActiveFilters from '#lib/components/shop/active-filters.svelte';
	import BookCard from '#lib/components/shop/book-card.svelte';
	import CataloguePagination from '#lib/components/shop/catalogue-pagination.svelte';
	import CatalogueToolbar from '#lib/components/shop/catalogue-toolbar.svelte';
	import HeroBanner from '#lib/components/shop/hero-banner.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let layout = $state<'grid' | 'list'>('grid');

	const query = $derived(data.query);
	// Every link keeps the other filters and jumps back to the product list.
	const href = (changes: Parameters<typeof catalogueHref>[1] = {}) =>
		catalogueHref(query, changes, '#products');

	const heading = $derived(
		data.selectedCategory?.name ?? (query.q ? 'Search results' : 'All products')
	);
	const first = $derived((data.page - 1) * PAGE_SIZE + 1);
	const summary = $derived(
		data.total === 0
			? 'No products'
			: data.totalPages > 1
				? `Showing ${first}–${first + data.products.length - 1} of ${data.total}`
				: `${data.total} ${data.total === 1 ? 'product' : 'products'}`
	);
	const canonical = $derived(`${page.url.origin}/${catalogueHref(query)}`.replace(/\?$/, ''));
</script>

<Seo
	title={data.selectedCategory
		? `${data.selectedCategory.name} · NLS Bookshop`
		: 'Shop · NLS Bookshop'}
	description="Books, apparel and essentials from the Nigerian Law School. Order online and pay securely."
	url={canonical}
/>

<HeroBanner dismissed={data.heroDismissed} />

<section id="products" class="scroll-mt-24 pt-8 sm:pt-12">
	<CatalogueToolbar
		{query}
		categories={data.categories}
		allCount={data.allCount}
		total={data.total}
		bind:layout
	/>

	<ActiveFilters
		category={data.selectedCategory?.name ?? (data.unknownCategory ? query.category : null)}
		q={query.q}
		clearCategoryHref={href({ category: '' })}
		clearSearchHref={href({ q: '' })}
		clearAllHref={href({ category: '', q: '', sort: 'newest' })}
	/>

	<p class="mt-8 mb-10 eyebrow sm:mt-10 sm:mb-12" aria-live="polite">{heading} · {summary}</p>

	{#if data.products.length === 0}
		<div class="border-y py-24 text-center">
			<p class="font-serif text-2xl tracking-tight">
				{#if data.unknownCategory}
					That category doesn't exist
				{:else if hasFilters(query)}
					Nothing matches your filters
				{:else}
					No products available yet
				{/if}
			</p>
			<p class="mt-3 text-muted-foreground">
				{hasFilters(query) ? 'Try a different search or category.' : 'Please check back soon.'}
			</p>
			{#if hasFilters(query)}
				<a
					href={href({ category: '', q: '', sort: 'newest' })}
					class="mt-8 inline-block text-sm underline underline-offset-4"
				>
					Clear filters
				</a>
			{/if}
		</div>
	{:else}
		<div
			class={layout === 'grid'
				? 'grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-3'
				: 'flex flex-col gap-8'}
		>
			{#each data.products as book (book.id)}
				<BookCard {book} {layout} />
			{/each}
		</div>
	{/if}

	<CataloguePagination
		page={data.page}
		totalPages={data.totalPages}
		hrefFor={(n) => href({ page: n })}
	/>
</section>
