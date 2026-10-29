<script lang="ts">
	import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
	import Icon from '#lib/components/icon.svelte';
	import * as Menu from '#lib/components/ui/dropdown-menu/index.js';

	type Item = { slug: string; name: string; count: number };

	let {
		categories,
		current,
		allCount,
		hrefFor
	}: {
		categories: Item[];
		/** Slug of the selected category, or '' for all. */
		current: string;
		allCount: number;
		hrefFor: (slug: string) => string;
	} = $props();

	// Categories with nothing in them aren't useful to shoppers, unless one is already selected.
	const items = $derived(categories.filter((c) => c.count > 0 || c.slug === current));
	const all: Item = $derived({ slug: '', name: 'All', count: allCount });
	const selected = $derived(items.find((c) => c.slug === current) ?? all);
</script>

{#snippet entry(item: Item)}
	{@const active = item.slug === current}
	<Menu.Item>
		{#snippet child({ props })}
			<a
				{...props}
				href={hrefFor(item.slug)}
				aria-current={active ? 'page' : undefined}
				class="{props.class} justify-between gap-6 py-2 text-muted-foreground aria-[current=page]:bg-accent aria-[current=page]:font-medium aria-[current=page]:text-accent-foreground"
			>
				<span>{item.name}</span>
				<span class="text-xs tabular-nums opacity-75">{item.count}</span>
			</a>
		{/snippet}
	</Menu.Item>
{/snippet}

<Menu.Root>
	<Menu.Trigger>
		{#snippet child({ props })}
			<button
				{...props}
				type="button"
				aria-label="Category: {selected.name}"
				class="group inline-flex h-10 items-center gap-2.5 rounded-lg border bg-background px-3.5 text-sm whitespace-nowrap transition-colors hover:bg-muted data-[state=open]:bg-muted"
			>
				<span class="text-muted-foreground">Category</span>
				<span class="font-medium">{selected.name}</span>
				<span class="text-xs text-muted-foreground tabular-nums">{selected.count}</span>
				<Icon
					icon={ArrowDown01Icon}
					size={14}
					class="text-muted-foreground transition-transform group-data-[state=open]:rotate-180"
				/>
			</button>
		{/snippet}
	</Menu.Trigger>
	<Menu.Content align="start" class="min-w-72 p-1.5">
		{@render entry(all)}
		{#if items.length > 0}<Menu.Separator />{/if}
		{#each items as item (item.slug)}
			{@render entry(item)}
		{/each}
	</Menu.Content>
</Menu.Root>
