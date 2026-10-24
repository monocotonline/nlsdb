<script lang="ts">
	import { SORT_LABELS, type SortKey } from '#lib/catalogue.js';

	let { current, hrefFor }: { current: SortKey; hrefFor: (sort: SortKey) => string } = $props();

	// Short labels for the inline list; the full wording is used in the phone sheet.
	const short: Record<SortKey, string> = {
		newest: 'Newest',
		'price-asc': 'Price, low',
		'price-desc': 'Price, high',
		title: 'Name'
	};
</script>

<p class="flex items-center gap-5 text-[13px]" aria-label="Sort products">
	{#each Object.keys(SORT_LABELS) as key (key)}
		{@const sort = key as SortKey}
		<a
			href={hrefFor(sort)}
			aria-current={current === sort ? 'true' : undefined}
			class="text-muted-foreground transition-colors hover:text-foreground aria-[current=true]:text-foreground aria-[current=true]:underline aria-[current=true]:underline-offset-4"
		>
			{short[sort]}
		</a>
	{/each}
</p>
