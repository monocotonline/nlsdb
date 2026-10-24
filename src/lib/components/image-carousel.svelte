<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
	import Icon from '#lib/components/icon.svelte';
	import { cn } from '#lib/utils.js';

	let {
		images,
		title,
		index = $bindable(0),
		href,
		onselect,
		fit = 'contain',
		inset = 'p-5',
		class: className
	}: {
		images: string[];
		title: string;
		index?: number;
		/** Makes the image area a link (catalogue cards). */
		href?: string;
		/** Makes the image area a button (opens a viewer). */
		onselect?: () => void;
		fit?: 'contain' | 'cover';
		/** Padding around a contained image, e.g. 'p-[11%]'. */
		inset?: string;
		class?: string;
	} = $props();

	// Only load an image once it has been shown, so a page of cards stays light.
	const seen = new SvelteSet<number>([0]);
	$effect(() => {
		seen.add(index);
		// Preload the neighbours so the next click is instant.
		if (images.length > 1) {
			seen.add((index + 1) % images.length);
			seen.add((index - 1 + images.length) % images.length);
		}
	});

	const go = (to: number) => (index = (to + images.length) % images.length);

	let startX = 0;
	function onPointerDown(e: PointerEvent) {
		startX = e.clientX;
	}
	function onPointerUp(e: PointerEvent) {
		const dx = e.clientX - startX;
		if (Math.abs(dx) > 40 && images.length > 1) go(index + (dx < 0 ? 1 : -1));
	}

	function onKeydown(e: KeyboardEvent) {
		if (images.length < 2) return;
		if (e.key === 'ArrowLeft') go(index - 1);
		if (e.key === 'ArrowRight') go(index + 1);
	}

	const arrow =
		'absolute top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center border bg-background text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none opacity-0 group-hover/carousel:opacity-100 group-focus-within/carousel:opacity-100 [@media(hover:none)]:opacity-100';
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	class={cn('group/carousel relative overflow-hidden bg-muted', className)}
	onpointerdown={onPointerDown}
	onpointerup={onPointerUp}
	onkeydown={onKeydown}
	role="group"
	aria-roledescription="carousel"
	aria-label="{title} images"
>
	{#if images.length === 0}
		<!-- No image: a quiet typographic stand-in rather than an icon. -->
		<div class="flex size-full items-center justify-center p-8 text-center">
			<span class="line-clamp-4 font-serif text-xl leading-snug text-balance text-muted-foreground">
				{title}
			</span>
		</div>
	{:else}
		{#each images as src, i (src)}
			{#if seen.has(i)}
				<img
					{src}
					alt={i === index ? `${title}, image ${i + 1} of ${images.length}` : ''}
					aria-hidden={i !== index}
					draggable="false"
					class={cn(
						'absolute inset-0 size-full cover-img',
						fit === 'contain' ? cn('object-contain drop-shadow-md', inset) : 'object-cover',
						i === index ? 'opacity-100' : 'opacity-0'
					)}
				/>
			{/if}
		{/each}
	{/if}

	{#if href}
		<a {href} class="absolute inset-0 z-0" aria-label={title}></a>
	{:else if onselect}
		<button
			type="button"
			onclick={onselect}
			class="absolute inset-0 z-0 cursor-zoom-in"
			aria-label="View {title} larger"
		></button>
	{/if}

	{#if images.length > 1}
		<button
			type="button"
			class={cn(arrow, 'left-2')}
			aria-label="Previous image"
			onclick={() => go(index - 1)}
		>
			<Icon icon={ArrowLeft01Icon} size={16} strokeWidth={2.25} />
		</button>
		<button
			type="button"
			class={cn(arrow, 'right-2')}
			aria-label="Next image"
			onclick={() => go(index + 1)}
		>
			<Icon icon={ArrowRight01Icon} size={16} strokeWidth={2.25} />
		</button>

		<div class="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
			{#each [...images.keys()] as i (i)}
				<span class={cn('h-px bg-foreground/30', i === index ? 'w-5 bg-foreground' : 'w-3')}></span>
			{/each}
		</div>
	{/if}
</div>
