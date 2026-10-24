<script lang="ts">
	import { goto } from '$app/navigation';
	import CategoryList from '#lib/components/shop/category-list.svelte';
	import FilterButton from '#lib/components/shop/filter-button.svelte';
	import FilterSheet from '#lib/components/shop/filter-sheet.svelte';
	import LayoutToggle from '#lib/components/shop/layout-toggle.svelte';
	import SearchBox from '#lib/components/shop/search-box.svelte';
	import SortLinks from '#lib/components/shop/sort-links.svelte';
	import { catalogueHref, type CatalogueQuery } from '#lib/catalogue.js';
	import { saveLayout, type Layout } from '#lib/layout-preference.js';

	let {
		query,
		categories,
		allCount,
		total,
		layout = $bindable('grid')
	}: {
		query: CatalogueQuery;
		categories: { slug: string; name: string; count: number }[];
		allCount: number;
		total: number;
		layout?: Layout;
	} = $props();

	let sheetOpen = $state(false);

	// Filters live in the URL, so changing one is just a navigation. Replacing the history entry
	// keeps the back button from filling up with every keystroke or selection.
	function go(changes: Partial<CatalogueQuery>) {
		goto(catalogueHref(query, changes), { replace: true, reset: false });
	}

	function setLayout(next: Layout) {
		layout = next;
		saveLayout(next);
	}

	// Links keep the other filters and jump back to the product list.
	const href = (changes: Partial<CatalogueQuery>) => catalogueHref(query, changes, '#products');

	// What the Filters button counts: the choices made in the sheet (search has its own box).
	const activeFilters = $derived((query.category ? 1 : 0) + (query.sort !== 'newest' ? 1 : 0));
</script>

<!-- Phones: a search line and a Filters button; everything else lives in the bottom sheet. -->
<div class="flex items-end gap-5 sm:hidden">
	<SearchBox
		value={query.q}
		category={query.category}
		sort={query.sort}
		onsearch={(q) => go({ q })}
		class="flex-1"
	/>
	<FilterButton count={activeFilters} onclick={() => (sheetOpen = true)} />
</div>

<!-- From sm up: categories on the left; search, sort and layout on the right. -->
<div class="hidden flex-wrap items-center justify-between gap-x-12 gap-y-5 border-y py-5 sm:flex">
	<CategoryList
		{categories}
		{allCount}
		current={query.category}
		hrefFor={(category) => href({ category })}
	/>
	<div class="flex items-center gap-9">
		<SearchBox
			value={query.q}
			category={query.category}
			sort={query.sort}
			onsearch={(q) => go({ q })}
			class="w-44"
		/>
		<SortLinks current={query.sort} hrefFor={(sort) => href({ sort })} />
		<LayoutToggle bind:layout />
	</div>
</div>

<FilterSheet
	bind:open={sheetOpen}
	{query}
	{categories}
	{allCount}
	{total}
	bind:layout
	onchange={go}
	onlayout={setLayout}
/>
