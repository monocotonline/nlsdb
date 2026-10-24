<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '#lib/utils.js';

	let {
		title,
		eyebrow,
		description,
		rule = true,
		actions,
		class: className
	}: {
		title: string;
		eyebrow?: string;
		description?: string;
		/** A thin line under the header, tying it to the content below. */
		rule?: boolean;
		/** Buttons or links sitting on the right (on phones, under the title). */
		actions?: Snippet;
		class?: string;
	} = $props();
</script>

<!-- The same header on every inner page, so titles line up from page to page. -->
<header
	class={cn(
		'flex flex-wrap items-end justify-between gap-x-10 gap-y-6 pt-12 pb-10 sm:pt-16 sm:pb-12',
		rule && 'mb-10 border-b sm:mb-12',
		className
	)}
>
	<div class="min-w-0">
		{#if eyebrow}<p class="mb-4 eyebrow">{eyebrow}</p>{/if}
		<h1 class="display text-[clamp(2.25rem,5.2vw,4.25rem)]">{title}</h1>
		{#if description}
			<p class="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-muted-foreground">
				{description}
			</p>
		{/if}
	</div>
	{#if actions}<div class="flex flex-wrap items-center gap-3">{@render actions()}</div>{/if}
</header>
