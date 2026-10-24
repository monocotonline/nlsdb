<script lang="ts">
	import { Label } from '#lib/components/ui/label/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import type { Category } from '#lib/types.js';

	let {
		value = $bindable(''),
		categories,
		name = 'category'
	}: { value?: string; categories: Category[]; name?: string } = $props();

	// The select needs a non-empty value for "no category"; the form sends '' instead.
	const NONE = 'none';
	const selected = $derived(value || NONE);
	const label = $derived(categories.find((c) => c.id === value)?.name ?? 'No category');
</script>

<div class="grid gap-2">
	<Label>Category <span class="font-normal text-muted-foreground">(optional)</span></Label>
	<Select.Root
		type="single"
		value={selected}
		onValueChange={(next) => (value = next === NONE ? '' : next)}
	>
		<Select.Trigger class="w-full">
			<span class={value ? '' : 'text-muted-foreground'}>{label}</span>
		</Select.Trigger>
		<Select.Content>
			<Select.Item value={NONE} label="No category">No category</Select.Item>
			{#each categories as category (category.id)}
				<Select.Item value={category.id} label={category.name}>{category.name}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
	<input type="hidden" {name} {value} />
	<p class="text-xs text-muted-foreground">
		{#if categories.length === 0}
			You haven't created any categories yet.
		{:else}
			Helps customers find it, for example by subject.
		{/if}
		<a href="/admin/categories" class="font-medium text-foreground underline underline-offset-4">
			Manage categories
		</a>
	</p>
</div>
