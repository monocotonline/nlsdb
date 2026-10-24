<script lang="ts">
	import { onMount } from 'svelte';
	import { loadLayout, saveLayout, type Layout } from '#lib/layout-preference.js';
	import { cn } from '#lib/utils.js';

	let { layout = $bindable('grid'), class: className }: { layout?: Layout; class?: string } =
		$props();

	// Restore the saved choice once the page is in the browser.
	onMount(() => {
		layout = loadLayout();
	});

	function set(next: Layout) {
		layout = next;
		saveLayout(next);
	}

	const options: { value: Layout; label: string }[] = [
		{ value: 'grid', label: 'Grid' },
		{ value: 'list', label: 'List' }
	];
</script>

<div class={cn('flex items-center gap-4 text-[13px]', className)} role="group" aria-label="Layout">
	{#each options as option (option.value)}
		<button
			type="button"
			aria-pressed={layout === option.value}
			onclick={() => set(option.value)}
			class="text-muted-foreground transition-colors hover:text-foreground aria-pressed:text-foreground aria-pressed:underline aria-pressed:underline-offset-4"
		>
			{option.label}
		</button>
	{/each}
</div>
