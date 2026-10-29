<script lang="ts">
	import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
	import { page } from '$app/state';
	import Icon from '#lib/components/icon.svelte';
	import { catalogueHref, parseCatalogueQuery } from '#lib/catalogue.js';
	import { cn } from '#lib/utils.js';

	// The layout counted everything once; this only shows it.
	const nav = $derived(page.data.productNav);
	const query = $derived(parseCatalogueQuery(new URLSearchParams(page.url.search)));
	// Only the products list itself is filtered; elsewhere nothing here is "current".
	const onList = $derived(page.url.pathname === '/admin');

	// Categories are open while looking at books; the chevron opens or closes them from anywhere.
	// svelte-ignore state_referenced_locally
	let booksOpen = $state(query.type === 'book');
	$effect(() => {
		if (onList && query.type === 'book') booksOpen = true;
	});

	const link = (active: boolean) =>
		cn(
			'flex items-center justify-between gap-3 py-1.5 pr-3 text-[13px] transition-colors',
			active ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'
		);
	const count = 'text-xs tabular-nums text-muted-foreground';
	const href = (changes: Parameters<typeof catalogueHref>[1]) =>
		`/admin${catalogueHref({ ...query, q: '', sort: 'newest', page: 1 }, changes)}`;
</script>

{#if nav}
	<ul class="mt-1 mb-2 ml-[1.35rem] space-y-0.5 border-l pl-3" aria-label="Product types">
		<li>
			<a
				href={href({ type: '', category: '' })}
				class={link(onList && !query.type && !query.category)}
			>
				All products <span class={count}>{nav.allCount}</span>
			</a>
		</li>
		{#each nav.types as type (type.value)}
			{@const active = onList && query.type === type.value}
			<li>
				<div class="relative">
					<a
						href={href({ type: type.value, category: '' })}
						class={link(active && !query.category)}
						aria-current={active && !query.category ? 'true' : undefined}
					>
						{type.label} <span class={count}>{type.count}</span>
					</a>
					{#if type.value === 'book' && nav.categories.length + nav.uncategorised > 0}
						<button
							type="button"
							onclick={() => (booksOpen = !booksOpen)}
							aria-expanded={booksOpen}
							aria-label={booksOpen ? 'Hide categories' : 'Show categories'}
							class="absolute top-1/2 right-9 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							<Icon
								icon={ArrowDown01Icon}
								size={14}
								class={cn('transition-transform', booksOpen && 'rotate-180')}
							/>
						</button>
					{/if}
				</div>
				<!-- Books are split into categories, shown while viewing books. -->
				{#if type.value === 'book' && booksOpen}
					<ul class="mt-0.5 mb-1 ml-3 space-y-0.5 border-l pl-3">
						{#each nav.categories as category (category.id)}
							<li>
								<a
									href={href({ type: 'book', category: category.slug })}
									class={link(query.category === category.slug)}
								>
									<span class="truncate">{category.name}</span>
									<span class={count}>{category.count}</span>
								</a>
							</li>
						{/each}
						{#if nav.uncategorised > 0}
							<li>
								<a
									href={href({ type: 'book', category: 'none' })}
									class={link(query.category === 'none')}
								>
									Uncategorised <span class={count}>{nav.uncategorised}</span>
								</a>
							</li>
						{/if}
					</ul>
				{/if}
			</li>
		{/each}
	</ul>
{/if}
