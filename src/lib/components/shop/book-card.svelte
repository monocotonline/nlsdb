<script lang="ts">
	import { Tick02Icon } from '@hugeicons/core-free-icons';
	import { enhance } from '$app/forms';
	import Icon from '#lib/components/icon.svelte';
	import ImageCarousel from '#lib/components/image-carousel.svelte';
	import { formatNaira } from '#lib/format.js';
	import { cn } from '#lib/utils.js';
	import type { Book } from '#lib/types.js';

	let { book, layout = 'grid' }: { book: Book; layout?: 'grid' | 'list' } = $props();

	let added = $state(false);
</script>

<article
	class={cn(
		'group/card flex',
		layout === 'grid' ? 'flex-col' : 'flex-row gap-6 border-b pb-8 sm:gap-10'
	)}
>
	<ImageCarousel
		images={book.images.map((i) => i.thumb)}
		title={book.title}
		href="/products/{book.id}"
		inset="p-[12%]"
		class={cn('shrink-0', layout === 'grid' ? 'aspect-[4/5] w-full' : 'aspect-[4/5] w-32 sm:w-52')}
	/>

	<div class={cn('flex min-w-0 flex-1 flex-col', layout === 'grid' ? 'pt-5' : 'pt-1')}>
		{#if book.category}
			<p class="mb-2.5 truncate eyebrow">{book.category.name}</p>
		{/if}
		<a href="/products/{book.id}" class="decoration-1 underline-offset-[5px] hover:underline">
			<h3 class="font-serif text-xl leading-snug tracking-tight text-balance sm:text-[1.3rem]">
				{book.title}
			</h3>
		</a>
		{#if book.author}
			<p class="mt-1.5 truncate text-sm text-muted-foreground">{book.author}</p>
		{/if}
		{#if layout === 'list' && book.descriptionText}
			<p
				class="mt-3 line-clamp-2 hidden max-w-xl text-sm leading-relaxed text-muted-foreground sm:block"
			>
				{book.descriptionText}
			</p>
		{/if}

		<div class="mt-auto flex items-baseline justify-between gap-4 pt-4">
			<p class="text-sm tabular-nums">{formatNaira(book.price)}</p>
			<form
				method="POST"
				action="/?/add"
				use:enhance={() =>
					async ({ update }) => {
						await update({ reset: false });
						added = true;
						setTimeout(() => (added = false), 1800);
					}}
			>
				<input type="hidden" name="id" value={book.id} />
				<button
					type="submit"
					class="inline-flex items-center gap-1.5 text-[13px] decoration-1 underline-offset-4 hover:underline"
				>
					{#if added}
						<Icon icon={Tick02Icon} size={14} strokeWidth={2.5} /> Added
					{:else}
						Add to cart
					{/if}
				</button>
			</form>
		</div>
	</div>
</article>
