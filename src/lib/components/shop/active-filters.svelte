<script lang="ts">
	import { Cancel01Icon } from '@hugeicons/core-free-icons';
	import Icon from '#lib/components/icon.svelte';

	let {
		category,
		q,
		clearCategoryHref,
		clearSearchHref,
		clearAllHref
	}: {
		category: string | null;
		q: string;
		clearCategoryHref: string;
		clearSearchHref: string;
		clearAllHref: string;
	} = $props();

	const tag = 'inline-flex items-center gap-2 border py-1 pr-1.5 pl-3 text-[13px]';
	const remove =
		'flex size-5 items-center justify-center text-muted-foreground hover:text-foreground';
</script>

{#if category || q}
	<div class="mt-6 flex flex-wrap items-center gap-2.5">
		<span class="mr-1 eyebrow">Filtered by</span>
		{#if category}
			<span class={tag}>
				{category}
				<a href={clearCategoryHref} class={remove} aria-label="Remove category filter">
					<Icon icon={Cancel01Icon} size={12} strokeWidth={2.5} />
				</a>
			</span>
		{/if}
		{#if q}
			<span class={tag}>
				“{q}”
				<a href={clearSearchHref} class={remove} aria-label="Remove search">
					<Icon icon={Cancel01Icon} size={12} strokeWidth={2.5} />
				</a>
			</span>
		{/if}
		<a
			href={clearAllHref}
			class="ml-2 text-[13px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
		>
			Clear all
		</a>
	</div>
{/if}
