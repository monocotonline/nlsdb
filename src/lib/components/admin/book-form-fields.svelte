<script lang="ts">
	import CategorySelect from '#lib/components/admin/category-select.svelte';
	import TypeSelect from '#lib/components/admin/type-select.svelte';
	import Field from '#lib/components/field.svelte';
	import ImageManager, { type ImageItem } from '#lib/components/image-manager.svelte';
	import RichTextEditor from '#lib/components/rich-text-editor.svelte';
	import { usesCategories, type ProductType } from '#lib/product-types.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import type { Book, Category } from '#lib/types.js';

	let {
		book,
		categories,
		type = $bindable(''),
		category = $bindable(''),
		description = $bindable(''),
		images = $bindable([])
	}: {
		book: Book | null;
		categories: Category[];
		type?: ProductType | '';
		category?: string;
		description?: string;
		images?: ImageItem[];
	} = $props();
</script>

<TypeSelect bind:value={type} />
<!-- Categories only make sense once a type that uses them is chosen, and are never required. -->
{#if type && usesCategories(type)}
	<CategorySelect {categories} bind:value={category} />
{/if}
<Field label="Title" name="title" value={book?.title ?? ''} required />
<Field
	label="Author or brand (optional)"
	name="author"
	value={book?.author ?? ''}
	placeholder="Leave blank for items like clothing"
/>
<Field
	label="Price"
	name="price"
	type="number"
	prefix="₦"
	min={0}
	step={1}
	value={book?.price ?? ''}
	required
/>

<div class="grid gap-2">
	<Label>Description</Label>
	<RichTextEditor bind:value={description} placeholder="What is this product about?" />
</div>

<div class="grid gap-2">
	<Label>Images <span class="font-normal text-muted-foreground">(optional)</span></Label>
	<ImageManager bind:items={images} />
</div>
