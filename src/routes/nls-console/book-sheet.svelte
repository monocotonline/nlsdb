<script lang="ts">
	import { Tick02Icon } from '@hugeicons/core-free-icons';
	import { MediaQuery } from 'svelte/reactivity';
	import { enhance } from '$app/forms';
	import BookFormFields from '#lib/components/admin/book-form-fields.svelte';
	import Icon from '#lib/components/icon.svelte';
	import type { ImageItem } from '#lib/components/image-manager.svelte';
	import { Alert, AlertDescription } from '#lib/components/ui/alert/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import type { ProductType } from '#lib/product-types.js';
	import type { Book, Category } from '#lib/types.js';

	let {
		open = $bindable(false),
		book,
		categories,
		defaultType = '',
		defaultCategory = ''
	}: {
		open?: boolean;
		book: Book | null;
		categories: Category[];
		/** Type chosen for a new product (the one currently being viewed in the list). */
		defaultType?: ProductType | '';
		/** Category chosen for a new product (the one currently being viewed in the list). */
		defaultCategory?: string;
	} = $props();

	// A right-hand drawer on larger screens, a bottom sheet on phones.
	const wide = new MediaQuery('min-width: 640px');

	// The sheet is re-created each time it opens, so reading `book` once is intended.
	// svelte-ignore state_referenced_locally
	let type = $state<ProductType | ''>(book?.type ?? defaultType);
	// svelte-ignore state_referenced_locally
	let category = $state(book?.category?.id ?? defaultCategory);
	// svelte-ignore state_referenced_locally
	let description = $state(book?.description ?? '');
	// Existing images keep their stored filename as id; new uploads are added by the manager.
	// svelte-ignore state_referenced_locally
	let images = $state<ImageItem[]>(
		(book?.images ?? []).map((image) => ({ id: image.name, url: image.thumb }))
	);

	let saving = $state(false);
	let error = $state('');
</script>

<Sheet.Root bind:open>
	<Sheet.Content
		side={wide.current ? 'right' : 'bottom'}
		class="p-0 max-sm:max-h-[92dvh] max-sm:rounded-t-2xl sm:min-w-2xl"
	>
		<form
			method="POST"
			action={book ? '?/update' : '?/create'}
			enctype="multipart/form-data"
			class="flex min-h-0 flex-1 flex-col"
			use:enhance={({ formData }) => {
				saving = true;
				error = '';
				let next = 0;
				formData.set(
					'order',
					JSON.stringify(images.map((image) => (image.file ? `new:${next++}` : image.id)))
				);
				for (const image of images) if (image.file) formData.append('newImages', image.file);
				return async ({ result, update }) => {
					saving = false;
					if (result.type === 'failure') {
						error = (result.data?.message as string | undefined) ?? 'Something went wrong';
						return;
					}
					await update({ reset: false });
					if (result.type === 'success') open = false;
				};
			}}
		>
			{#if book}<input type="hidden" name="id" value={book.id} />{/if}

			<!-- Grab handle, phones only -->
			<div class="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-border sm:hidden"></div>

			<Sheet.Header class="gap-1 border-b px-4 py-4 pr-14 sm:px-6 sm:py-5">
				<Sheet.Title class="text-lg font-semibold">
					{book ? 'Edit product' : 'Add a product'}
				</Sheet.Title>
				<Sheet.Description class="text-muted-foreground">
					{book
						? 'Update the details customers see in the shop.'
						: 'This will appear in the shop straight away.'}
				</Sheet.Description>
			</Sheet.Header>

			<div
				class="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-5 sm:space-y-6 sm:px-6 sm:py-6"
			>
				{#if error}
					<Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
				{/if}
				<BookFormFields {book} {categories} bind:type bind:category bind:description bind:images />
			</div>

			<Sheet.Footer
				class="grid grid-cols-2 gap-3 border-t bg-background px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:flex sm:flex-row sm:justify-end sm:px-6 sm:py-4"
			>
				<Button
					type="button"
					variant="outline"
					size="lg"
					class="sm:h-10 sm:text-sm"
					onclick={() => (open = false)}
				>
					Cancel
				</Button>
				<Button type="submit" size="lg" class="sm:h-10 sm:text-sm" disabled={saving}>
					{#if saving}
						Saving…
					{:else}
						<Icon icon={Tick02Icon} /> {book ? 'Save changes' : 'Add product'}
					{/if}
				</Button>
			</Sheet.Footer>
		</form>
	</Sheet.Content>
</Sheet.Root>
