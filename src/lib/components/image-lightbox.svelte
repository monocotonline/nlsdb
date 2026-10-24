<script lang="ts">
	import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
	import Icon from '#lib/components/icon.svelte';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import { cn } from '#lib/utils.js';

	let {
		open = $bindable(false),
		index = $bindable(0),
		images,
		thumbs,
		title
	}: {
		open?: boolean;
		index?: number;
		images: string[];
		thumbs: string[];
		title: string;
	} = $props();

	const go = (to: number) => (index = (to + images.length) % images.length);

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') go(index - 1);
		if (e.key === 'ArrowRight') go(index + 1);
	}

	const nav =
		'absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 shadow-lg ring-1 ring-foreground/10 transition-all hover:bg-background hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';
</script>

<svelte:window onkeydown={open ? onKeydown : undefined} />

<Dialog.Root bind:open>
	<Dialog.Content class="gap-0 overflow-hidden p-0 sm:max-w-4xl" showCloseButton>
		<Dialog.Title class="sr-only">{title}</Dialog.Title>
		<Dialog.Description class="sr-only">Image {index + 1} of {images.length}</Dialog.Description>

		<div class="relative flex h-[min(70vh,44rem)] items-center justify-center bg-muted">
			<img
				src={images[index]}
				alt="{title}, image {index + 1} of {images.length}"
				class="max-h-full max-w-full object-contain p-6 drop-shadow-xl"
			/>
			{#if images.length > 1}
				<button
					type="button"
					class={cn(nav, 'left-4')}
					aria-label="Previous image"
					onclick={() => go(index - 1)}
				>
					<Icon icon={ArrowLeft01Icon} size={20} strokeWidth={2.25} />
				</button>
				<button
					type="button"
					class={cn(nav, 'right-4')}
					aria-label="Next image"
					onclick={() => go(index + 1)}
				>
					<Icon icon={ArrowRight01Icon} size={20} strokeWidth={2.25} />
				</button>
				<span
					class="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background/90 px-3 py-1 text-xs font-medium shadow-sm ring-1 ring-foreground/10"
				>
					{index + 1} / {images.length}
				</span>
			{/if}
		</div>

		{#if images.length > 1}
			<ul class="flex gap-2 overflow-x-auto border-t bg-background p-3">
				{#each thumbs as thumb, i (thumb)}
					<li class="shrink-0">
						<button
							type="button"
							onclick={() => (index = i)}
							aria-label="Show image {i + 1}"
							aria-current={index === i}
							class="block size-16 overflow-hidden rounded-md bg-muted opacity-60 ring-1 ring-foreground/10 transition-all hover:opacity-100 aria-[current=true]:opacity-100 aria-[current=true]:ring-2 aria-[current=true]:ring-primary"
						>
							<img src={thumb} alt="" class="size-full object-contain p-1" draggable="false" />
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</Dialog.Content>
</Dialog.Root>
