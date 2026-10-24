<script lang="ts">
	import { Add01Icon, MinusSignIcon } from '@hugeicons/core-free-icons';
	import { enhance } from '$app/forms';
	import BookCover from '#lib/components/book-cover.svelte';
	import Icon from '#lib/components/icon.svelte';
	import { formatNaira } from '#lib/format.js';
	import type { HydratedLine } from '#lib/server/cart.js';

	let { line }: { line: HydratedLine } = $props();

	const step =
		'flex size-10 items-center justify-center transition-colors hover:bg-muted disabled:opacity-40';
</script>

<li
	class="grid grid-cols-[6rem_1fr] gap-x-5 gap-y-4 py-8 sm:grid-cols-[8.5rem_1fr_auto] sm:gap-x-8"
>
	<a href="/products/{line.book.id}" class="block self-start">
		<BookCover
			src={line.book.coverUrl}
			title={line.book.title}
			class="aspect-[4/5] [&_img]:object-contain [&_img]:p-[10%]"
		/>
	</a>

	<div class="flex min-w-0 flex-col">
		{#if line.book.category}
			<p class="mb-2 truncate eyebrow">{line.book.category.name}</p>
		{/if}
		<a href="/products/{line.book.id}" class="decoration-1 underline-offset-[5px] hover:underline">
			<h2 class="font-serif text-xl leading-snug tracking-tight text-balance sm:text-2xl">
				{line.book.title}
			</h2>
		</a>
		{#if line.book.author}
			<p class="mt-1.5 truncate text-sm text-muted-foreground">{line.book.author}</p>
		{/if}
		<p class="mt-1 text-sm text-muted-foreground tabular-nums">
			{formatNaira(line.book.price)} each
		</p>

		<div class="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-6">
			<form method="POST" action="?/update" use:enhance>
				<input type="hidden" name="id" value={line.book.id} />
				<div class="inline-flex items-center border">
					<button
						type="submit"
						name="qty"
						value={line.qty - 1}
						class={step}
						aria-label="Decrease quantity"
						disabled={line.qty <= 1}
					>
						<Icon icon={MinusSignIcon} size={15} />
					</button>
					<span class="w-9 text-center text-sm tabular-nums">{line.qty}</span>
					<button
						type="submit"
						name="qty"
						value={line.qty + 1}
						class={step}
						aria-label="Increase quantity"
						disabled={line.qty >= 99}
					>
						<Icon icon={Add01Icon} size={15} />
					</button>
				</div>
			</form>

			<form method="POST" action="?/remove" use:enhance>
				<input type="hidden" name="id" value={line.book.id} />
				<button
					type="submit"
					class="text-[13px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
					aria-label="Remove {line.book.title}"
				>
					Remove
				</button>
			</form>
		</div>
	</div>

	<p class="col-span-2 font-serif text-xl tabular-nums sm:col-span-1 sm:text-right sm:text-2xl">
		{formatNaira(line.subtotal)}
	</p>
</li>
