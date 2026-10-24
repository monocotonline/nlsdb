<script lang="ts">
	import { GridViewIcon, ListViewIcon } from '@hugeicons/core-free-icons';
	import FilterOptionList from '#lib/components/shop/filter-option-list.svelte';
	import FilterSegmented from '#lib/components/shop/filter-segmented.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import { SORT_LABELS, type CatalogueQuery, type SortKey } from '#lib/catalogue.js';

	type Option = { slug: string; name: string; count: number };

	let {
		open = $bindable(false),
		query,
		categories,
		allCount,
		total,
		layout = $bindable('grid'),
		onchange,
		onlayout
	}: {
		open?: boolean;
		query: CatalogueQuery;
		categories: Option[];
		allCount: number;
		/** Results for the current filters, shown on the footer button. */
		total: number;
		layout?: 'grid' | 'list';
		onchange: (changes: Partial<CatalogueQuery>) => void;
		onlayout: (layout: 'grid' | 'list') => void;
	} = $props();

	// Categories with nothing in them aren't useful to shoppers, unless one is already selected.
	const options = $derived(categories.filter((c) => c.count > 0 || c.slug === query.category));
	const dirty = $derived(Boolean(query.category) || query.sort !== 'newest');

	const categoryOptions = $derived([
		{ value: '', label: 'All categories', count: allCount },
		...options.map((o) => ({ value: o.slug, label: o.name, count: o.count }))
	]);
	const sortOptions = Object.entries(SORT_LABELS).map(([value, label]) => ({ value, label }));
	const viewOptions = [
		{ value: 'grid', label: 'Grid', icon: GridViewIcon },
		{ value: 'list', label: 'List', icon: ListViewIcon }
	];

	const heading = 'mb-2 px-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase';
</script>

<!-- Phones only. Choices apply straight away (they are just URL changes), so the results behind
     the sheet update as you tap, and the footer button says how many there are. -->
<Sheet.Root bind:open>
	<Sheet.Content side="bottom" class="max-h-[88dvh] rounded-t-2xl p-0">
		<div class="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-border"></div>

		<Sheet.Header class="flex-row items-center justify-between gap-2 border-b px-4 py-3 pr-14">
			<Sheet.Title class="text-lg font-semibold">Filters</Sheet.Title>
			<Sheet.Description class="sr-only">
				Choose a category, how to sort and how to view the products.
			</Sheet.Description>
			{#if dirty}
				<Button
					type="button"
					variant="ghost"
					size="sm"
					class="-mr-2 text-muted-foreground"
					onclick={() => onchange({ category: '', sort: 'newest' })}
				>
					Clear all
				</Button>
			{/if}
		</Sheet.Header>

		<div class="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-4 py-5">
			<section>
				<h3 class={heading}>Category</h3>
				<FilterOptionList
					label="Category"
					options={categoryOptions}
					value={query.category}
					onselect={(category) => onchange({ category })}
				/>
			</section>

			<section>
				<h3 class={heading}>Sort by</h3>
				<FilterOptionList
					label="Sort by"
					options={sortOptions}
					value={query.sort}
					onselect={(sort) => onchange({ sort: sort as SortKey })}
				/>
			</section>

			<section>
				<h3 class={heading}>View</h3>
				<FilterSegmented
					label="View"
					options={viewOptions}
					value={layout}
					onselect={(next) => onlayout(next as 'grid' | 'list')}
				/>
			</section>
		</div>

		<Sheet.Footer
			class="border-t bg-background px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
		>
			<Button type="button" size="lg" class="w-full" onclick={() => (open = false)}>
				{total === 0 ? 'Close' : `Show ${total} ${total === 1 ? 'result' : 'results'}`}
			</Button>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
