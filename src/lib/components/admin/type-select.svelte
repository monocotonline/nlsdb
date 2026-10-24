<script lang="ts">
	import { Label } from '#lib/components/ui/label/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import { PRODUCT_TYPES, isProductType, type ProductType } from '#lib/product-types.js';

	let { value = $bindable(''), name = 'type' }: { value?: ProductType | ''; name?: string } =
		$props();

	const label = $derived(PRODUCT_TYPES.find((t) => t.value === value)?.label ?? 'Choose a type');
</script>

<div class="grid gap-2">
	<Label>Product type</Label>
	<Select.Root
		type="single"
		{value}
		onValueChange={(next) => (value = isProductType(next) ? next : '')}
	>
		<Select.Trigger class="w-full">
			<span class={value ? '' : 'text-muted-foreground'}>{label}</span>
		</Select.Trigger>
		<Select.Content>
			{#each PRODUCT_TYPES as type (type.value)}
				<Select.Item value={type.value} label={type.label}>{type.label}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
	<input type="hidden" {name} {value} required />
</div>
