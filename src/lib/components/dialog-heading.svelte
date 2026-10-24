<script lang="ts">
	import type { IconSvgElement } from '@hugeicons/svelte';
	import Icon from '#lib/components/icon.svelte';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import { cn } from '#lib/utils.js';

	let {
		icon,
		title,
		description,
		tone = 'primary'
	}: {
		icon: IconSvgElement;
		title: string;
		description: string;
		tone?: 'primary' | 'destructive';
	} = $props();
</script>

<div class="flex flex-col items-center gap-3 pt-2 text-center">
	<span
		class={cn(
			'flex size-12 items-center justify-center rounded-xl shadow-sm',
			tone === 'primary'
				? 'bg-primary text-primary-foreground'
				: 'bg-destructive/10 text-destructive shadow-none'
		)}
	>
		<Icon {icon} size={24} />
	</span>
	<div class="space-y-1.5">
		<Dialog.Title class="text-xl font-semibold">{title}</Dialog.Title>
		<Dialog.Description class="text-sm text-muted-foreground">{description}</Dialog.Description>
	</div>
</div>
