<script lang="ts">
	import { Add01Icon, MinusSignIcon } from '@hugeicons/core-free-icons';
	import { page } from '$app/state';
	import Icon from '#lib/components/icon.svelte';
	import ImageCarousel from '#lib/components/image-carousel.svelte';
	import ImageLightbox from '#lib/components/image-lightbox.svelte';
	import Seo from '#lib/components/seo.svelte';
	import ShareButton from '#lib/components/share/share-button.svelte';
	import BookCard from '#lib/components/shop/book-card.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { formatNaira } from '#lib/format.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const book = $derived(data.book);
	const related = $derived(data.related);

	let qty = $state(1);
	let active = $state(0);
	let viewer = $state(false);

	// "Title by Author", or just the title for items without an author (clothing, merchandise).
	const byline = $derived(book.author ? `${book.title} by ${book.author}` : book.title);

	const shareContent = $derived({
		url: page.url.origin + page.url.pathname,
		title: book.title,
		text: `${byline} · ${formatNaira(book.price)}`
	});
	const summary = $derived(
		book.descriptionText
			? book.descriptionText.length > 155
				? `${book.descriptionText.slice(0, 154)}…`
				: book.descriptionText
			: `${byline}. Available from the Nigerian Law School shop.`
	);
	// Social apps need an absolute image URL.
	const shareImage = $derived(
		book.images[0] ? new URL(book.images[0].url, page.url.origin).href : null
	);

	const crumb = 'underline-offset-4 transition-colors hover:text-foreground hover:underline';
</script>

<Seo
	title="{book.title} · NLS Bookshop"
	description={summary}
	url={shareContent.url}
	image={shareImage}
	type="product"
	price={book.price}
/>

<div class="pt-8 sm:pt-12">
	<nav aria-label="Breadcrumb" class="flex flex-wrap items-center gap-x-3 gap-y-1 eyebrow">
		<a href="/#products" class={crumb}>Shop</a>
		{#if book.category}
			<span aria-hidden="true">/</span>
			<a href="/?category={book.category.slug}#products" class={crumb}>{book.category.name}</a>
		{/if}
	</nav>

	<div
		class="mt-8 grid gap-12 sm:mt-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20 xl:gap-28"
	>
		<!-- Gallery -->
		<div>
			<ImageCarousel
				images={book.images.map((i) => i.url)}
				title={book.title}
				bind:index={active}
				onselect={book.images.length ? () => (viewer = true) : undefined}
				inset="p-[11%]"
				class="aspect-[4/5] w-full"
			/>
			{#if book.images.length > 1}
				<ul class="mt-4 grid grid-cols-5 gap-3 sm:grid-cols-6">
					{#each book.images as image, i (image.name)}
						<li>
							<button
								type="button"
								onclick={() => (active = i)}
								aria-label="Show image {i + 1}"
								aria-current={active === i}
								class="block aspect-square w-full bg-muted p-1.5 opacity-55 outline-offset-2 transition-opacity hover:opacity-100 aria-[current=true]:opacity-100 aria-[current=true]:outline aria-[current=true]:outline-1 aria-[current=true]:outline-foreground"
							>
								<img
									src={image.thumb}
									alt=""
									class="size-full object-contain cover-img"
									draggable="false"
								/>
							</button>
						</li>
					{/each}
				</ul>
				<p class="mt-4 eyebrow">{active + 1} / {book.images.length} · Click to enlarge</p>
			{/if}
		</div>

		<!-- Details: stays in view beside the gallery on large screens -->
		<div class="lg:sticky lg:top-28 lg:self-start">
			{#if book.category}
				<a
					href="/?category={book.category.slug}#products"
					class="mb-5 inline-block eyebrow underline-offset-4 hover:text-foreground hover:underline"
				>
					{book.category.name}
				</a>
			{/if}
			<h1 class="display text-[clamp(2.1rem,4.4vw,3.5rem)]">{book.title}</h1>
			{#if book.author}
				<p class="mt-4 text-lg text-muted-foreground">{book.author}</p>
			{/if}

			<p class="mt-8 font-serif text-3xl tracking-tight tabular-nums">{formatNaira(book.price)}</p>

			<form method="POST" action="?/add" class="mt-8 flex flex-wrap items-stretch gap-3">
				<div class="flex items-center border">
					<button
						type="button"
						class="flex size-12 items-center justify-center transition-colors hover:bg-muted disabled:opacity-40"
						aria-label="Decrease quantity"
						disabled={qty <= 1}
						onclick={() => (qty = Math.max(1, qty - 1))}
					>
						<Icon icon={MinusSignIcon} size={16} />
					</button>
					<input type="hidden" name="qty" value={qty} />
					<span class="w-10 text-center tabular-nums" aria-live="polite">{qty}</span>
					<button
						type="button"
						class="flex size-12 items-center justify-center transition-colors hover:bg-muted disabled:opacity-40"
						aria-label="Increase quantity"
						disabled={qty >= 99}
						onclick={() => (qty = Math.min(99, qty + 1))}
					>
						<Icon icon={Add01Icon} size={16} />
					</button>
				</div>
				<Button type="submit" size="lg" class="h-12 flex-1 px-8 sm:flex-none">Add to cart</Button>
				<ShareButton content={shareContent} class="h-12 max-sm:w-full" />
			</form>

			<ul
				class="mt-8 list-disc space-y-2 border-t pt-6 pl-5 text-sm text-muted-foreground marker:text-foreground/50"
			>
				<li>Delivered to the address you give at checkout.</li>
				<li>No account needed. Check out as a guest.</li>
			</ul>

			{#if book.description}
				<div class="mt-10 border-t pt-8">
					<h2 class="mb-4 eyebrow">About</h2>
					<!-- Sanitised on the server (see description.ts), so rendering it as HTML is safe. -->
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<div class="rich-text text-muted-foreground">{@html book.description}</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Related products: real purchases first, then the same category and author, then the newest. -->
	{#if related.items.length > 0}
		<section class="mt-24 border-t pt-14 sm:mt-32 sm:pt-20" aria-labelledby="related">
			<div class="mb-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-4 sm:mb-14">
				<div class="max-w-2xl">
					<p class="mb-4 eyebrow">{related.heading.eyebrow}</p>
					<h2 id="related" class="display text-[clamp(1.9rem,3.6vw,3rem)]">
						{related.heading.title}
					</h2>
					{#if related.heading.note}
						<p class="mt-4 text-muted-foreground">{related.heading.note}</p>
					{/if}
				</div>
				{#if book.category && (related.heading.reason === 'category' || related.heading.reason === 'popular')}
					<a
						href="/?category={book.category.slug}#products"
						class="text-sm underline underline-offset-4"
					>
						View all in {book.category.name}
					</a>
				{/if}
			</div>
			<div class="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 lg:grid-cols-4">
				{#each related.items as item (item.id)}
					<BookCard book={item} layout="grid" />
				{/each}
			</div>
		</section>
	{/if}
</div>

<ImageLightbox
	bind:open={viewer}
	bind:index={active}
	images={book.images.map((i) => i.url)}
	thumbs={book.images.map((i) => i.thumb)}
	title={book.title}
/>
