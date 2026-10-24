<script lang="ts">
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
</script>

<nav aria-label="Categories">
	<ul class="flex flex-wrap gap-x-7 gap-y-2 text-sm">
		{#each [{ slug: '', name: 'All', count: allCount }, ...items] as item (item.slug)}
			{@const active = item.slug === current}
			<li>
				<a
					href={hrefFor(item.slug)}
					aria-current={active ? 'page' : undefined}
					class="border-b border-transparent pb-0.5 text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:border-foreground aria-[current=page]:text-foreground"
				>
					{item.name}
					<span class="ml-0.5 text-[11px] tabular-nums opacity-70">{item.count}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>
