<script lang="ts">
	import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
	import Icon from '#lib/components/icon.svelte';
	import { Button } from '#lib/components/ui/button/index.js';

	let {
		page,
		totalPages,
		hrefFor
	}: { page: number; totalPages: number; hrefFor: (page: number) => string } = $props();
</script>

{#if totalPages > 1}
	<div class="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm">
		<Button
			href={hrefFor(page - 1)}
			variant="outline"
			class="justify-self-start"
			disabled={page <= 1}
		>
			<Icon icon={ArrowLeft01Icon} /> Newer
		</Button>
		<span class="text-muted-foreground">Page {page} of {totalPages}</span>
		<Button
			href={hrefFor(page + 1)}
			variant="outline"
			class="justify-self-end"
			disabled={page >= totalPages}
		>
			Older <Icon icon={ArrowRight01Icon} />
		</Button>
	</div>
{/if}
