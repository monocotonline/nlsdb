<script lang="ts" module>
	export type ImageItem = {
		/** Existing images use their stored filename; new ones a generated id. */
		id: string;
		url: string;
		file?: File;
	};
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Add01Icon, Delete02Icon, Image02Icon, StarIcon } from '@hugeicons/core-free-icons';
	import Icon from '#lib/components/icon.svelte';
	import { cn } from '#lib/utils.js';

	let {
		items = $bindable([]),
		max = 8,
		maxBytes = 5 * 1024 * 1024
	}: { items?: ImageItem[]; max?: number; maxBytes?: number } = $props();

	let input = $state<HTMLInputElement>();
	let error = $state('');
	let dragFrom = $state<number | null>(null);
	let dragOver = $state<number | null>(null);
	let dropping = $state(false);

	const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

	function addFiles(list: FileList | File[]) {
		error = '';
		const next = [...items];
		for (const file of Array.from(list)) {
			if (next.length >= max) {
				error = `You can add up to ${max} images.`;
				break;
			}
			if (!ACCEPTED.includes(file.type)) {
				error = 'Only JPEG, PNG or WebP images are allowed.';
				continue;
			}
			if (file.size > maxBytes) {
				error = `“${file.name}” is larger than ${Math.round(maxBytes / 1024 / 1024)} MB.`;
				continue;
			}
			next.push({ id: `new-${crypto.randomUUID()}`, url: URL.createObjectURL(file), file });
		}
		items = next;
	}

	function remove(index: number) {
		const [gone] = items.splice(index, 1);
		if (gone?.file) URL.revokeObjectURL(gone.url);
		error = '';
	}

	function makeCover(index: number) {
		const [picked] = items.splice(index, 1);
		items.unshift(picked);
	}

	function move(from: number, to: number) {
		if (from === to) return;
		const [picked] = items.splice(from, 1);
		items.splice(to, 0, picked);
	}

	const hasFiles = (e: DragEvent) => e.dataTransfer?.types.includes('Files') ?? false;

	function onContainerDragOver(e: DragEvent) {
		if (hasFiles(e)) {
			e.preventDefault();
			dropping = true;
		}
	}

	function onContainerDrop(e: DragEvent) {
		dropping = false;
		if (hasFiles(e)) {
			e.preventDefault();
			addFiles(e.dataTransfer!.files);
		}
	}

	onDestroy(() => {
		for (const item of items) if (item.file) URL.revokeObjectURL(item.url);
	});
</script>

<div class="grid gap-3">
	<input
		bind:this={input}
		type="file"
		accept={ACCEPTED.join(',')}
		multiple
		class="hidden"
		tabindex="-1"
		onchange={(e) => {
			if (e.currentTarget.files) addFiles(e.currentTarget.files);
			e.currentTarget.value = '';
		}}
	/>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		ondragover={onContainerDragOver}
		ondragleave={() => (dropping = false)}
		ondrop={onContainerDrop}
		class={cn('rounded-xl transition-colors', dropping && 'bg-accent/60 ring-2 ring-primary/40')}
	>
		{#if items.length === 0}
			<button
				type="button"
				onclick={() => input?.click()}
				class="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-10 text-center transition-colors hover:border-primary/50 hover:bg-accent/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
			>
				<span class="flex size-11 items-center justify-center rounded-full bg-muted">
					<Icon icon={Image02Icon} size={22} class="text-muted-foreground" />
				</span>
				<span class="text-sm font-medium">Drop images here, or click to browse</span>
				<span class="text-xs text-muted-foreground">
					JPEG, PNG or WebP · up to {Math.round(maxBytes / 1024 / 1024)} MB each · max {max}
				</span>
			</button>
		{:else}
			<ul class="grid grid-cols-3 gap-3">
				{#each items as item, i (item.id)}
					<li
						draggable="true"
						ondragstart={(e) => {
							dragFrom = i;
							e.dataTransfer!.effectAllowed = 'move';
							e.dataTransfer!.setData('text/plain', String(i));
						}}
						ondragover={(e) => {
							if (dragFrom === null) return;
							e.preventDefault();
							dragOver = i;
						}}
						ondrop={(e) => {
							if (dragFrom === null) return;
							e.preventDefault();
							e.stopPropagation();
							move(dragFrom, i);
							dragFrom = dragOver = null;
						}}
						ondragend={() => (dragFrom = dragOver = null)}
						class={cn(
							'group relative aspect-[3/4] cursor-grab overflow-hidden rounded-lg border bg-muted transition-all active:cursor-grabbing',
							dragFrom === i && 'opacity-40',
							dragOver === i && dragFrom !== i && 'ring-2 ring-primary'
						)}
					>
						<img src={item.url} alt="" class="size-full object-cover" draggable="false" />

						{#if i === 0}
							<span
								class="absolute top-1.5 left-1.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-sm"
							>
								Cover
							</span>
						{/if}

						<div
							class="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-1.5 pt-6 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100"
						>
							{#if i > 0}
								<button
									type="button"
									onclick={() => makeCover(i)}
									aria-label="Make cover"
									title="Make cover"
									class="flex size-7 items-center justify-center rounded-md bg-white/90 text-neutral-900 hover:bg-white"
								>
									<Icon icon={StarIcon} size={15} />
								</button>
							{:else}
								<span></span>
							{/if}
							<button
								type="button"
								onclick={() => remove(i)}
								aria-label="Remove image"
								title="Remove"
								class="flex size-7 items-center justify-center rounded-md bg-white/90 text-red-600 hover:bg-white"
							>
								<Icon icon={Delete02Icon} size={15} />
							</button>
						</div>
					</li>
				{/each}

				{#if items.length < max}
					<li>
						<button
							type="button"
							onclick={() => input?.click()}
							class="flex aspect-[3/4] w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed text-muted-foreground transition-colors hover:border-primary/50 hover:bg-accent/40 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
						>
							<Icon icon={Add01Icon} size={20} />
							<span class="text-xs font-medium">Add</span>
						</button>
					</li>
				{/if}
			</ul>
			<p class="text-xs text-muted-foreground">
				Drag to reorder. The first image is the cover shown in the shop.
			</p>
		{/if}
	</div>

	{#if error}
		<p class="text-sm text-destructive">{error}</p>
	{/if}
</div>
