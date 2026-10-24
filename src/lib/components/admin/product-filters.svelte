<script lang="ts">
	import { Search01Icon } from '@hugeicons/core-free-icons';
	import { goto } from '$app/navigation';
	import Icon from '#lib/components/icon.svelte';
	import { Input } from '#lib/components/ui/input/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import { catalogueHref, hasFilters, type CatalogueQuery } from '#lib/catalogue.js';
	import { PRODUCT_TYPES, isProductType, usesCategories } from '#lib/product-types.js';

	let {
		query,
		types,
		categories,
		allCount,
		uncategorised
	}: {
		query: CatalogueQuery;
		types: { value: string; label: string; count: number }[];
		categories: { slug: string; name: string; count: number }[];
		allCount: number;
		/** Products with no category yet. */
		uncategorised: number;
	} = $props();

	// The select needs a non-empty value for "all"; the URL uses '' for it.
	const ALL = 'all';
	const NONE = 'none';

	const current = $derived(query.category || ALL);
	// Categories belong to books, so the picker is hidden while viewing another type.
	const showCategories = $derived(!query.type || usesCategories(query.type));
	const typeLabel = $derived(
		PRODUCT_TYPES.find((t) => t.value === query.type)?.plural ?? 'All types'
	);
	const label = $derived(
		query.category === NONE
			? 'Uncategorised'
			: (categories.find((c) => c.slug === query.category)?.name ?? 'All products')
	);

	let text = $state('');
	let input = $state<HTMLInputElement | null>(null);
	let timer: ReturnType<typeof setTimeout>;

	// Keep the box in step with the URL, but never overwrite what is being typed.
	$effect(() => {
		const fromUrl = query.q;
		if (document.activeElement !== input) text = fromUrl;
	});

	// Filters live in the URL, so changing one is just a navigation.
	function go(changes: Partial<CatalogueQuery>) {
		goto(catalogueHref(query, changes), { replace: true, reset: false });
	}

	function onInput() {
		clearTimeout(timer);
		timer = setTimeout(() => go({ q: text }), 300);
	}
</script>

<div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
	<div class="relative sm:w-72">
		<Icon
			icon={Search01Icon}
			class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
		/>
		<Input
			bind:ref={input}
			bind:value={text}
			oninput={onInput}
			type="search"
			placeholder="Search products"
			aria-label="Search products"
			autocomplete="off"
			class="bg-card pl-9"
		/>
	</div>

	<!-- On md and up the sidebar's Products menu does the same job. -->
	<Select.Root
		type="single"
		value={query.type || ALL}
		onValueChange={(value) => go({ type: isProductType(value) ? value : '', category: '' })}
	>
		<Select.Trigger class="bg-card sm:w-48 md:hidden" aria-label="Filter by type">
			<span class="truncate">{typeLabel}</span>
		</Select.Trigger>
		<Select.Content>
			<Select.Item value={ALL} label="All types">All types</Select.Item>
			{#each types as type (type.value)}
				<Select.Item value={type.value} label={type.label}>
					<span class="flex w-full items-center justify-between gap-4">
						{type.label}
						<span class="text-xs text-muted-foreground tabular-nums">{type.count}</span>
					</span>
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>

	{#if showCategories}
		<Select.Root
			type="single"
			value={current}
			onValueChange={(value) => go({ category: value === ALL ? '' : value })}
		>
			<Select.Trigger class="bg-card sm:w-64 md:hidden" aria-label="Filter by category">
				<span class="truncate">{label}</span>
			</Select.Trigger>
			<Select.Content>
				<Select.Item value={ALL} label="All products">
					<span class="flex w-full items-center justify-between gap-4">
						All products
						<span class="text-xs text-muted-foreground tabular-nums">{allCount}</span>
					</span>
				</Select.Item>
				{#each categories as category (category.slug)}
					<Select.Item value={category.slug} label={category.name}>
						<span class="flex w-full items-center justify-between gap-4">
							{category.name}
							<span class="text-xs text-muted-foreground tabular-nums">{category.count}</span>
						</span>
					</Select.Item>
				{/each}
				{#if uncategorised > 0 || query.category === NONE}
					<Select.Item value={NONE} label="Uncategorised">
						<span class="flex w-full items-center justify-between gap-4">
							Uncategorised
							<span class="text-xs text-muted-foreground tabular-nums">{uncategorised}</span>
						</span>
					</Select.Item>
				{/if}
			</Select.Content>
		</Select.Root>
	{/if}

	{#if hasFilters(query)}
		<a
			href={catalogueHref(query, { category: '', type: '', q: '', sort: 'newest' })}
			class="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
		>
			Clear filters
		</a>
	{/if}
</div>
