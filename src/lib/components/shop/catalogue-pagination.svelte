<script lang="ts">
	import { cn } from '#lib/utils.js';

	let {
		page,
		totalPages,
		hrefFor
	}: { page: number; totalPages: number; hrefFor: (page: number) => string } = $props();

	// 1 … 4 5 6 … 20: always the first, last and the pages around the current one.
	const pages = $derived.by(() => {
		const wanted = new Set([1, totalPages, page - 1, page, page + 1]);
		const sorted = [...wanted].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
		const out: (number | 'gap')[] = [];
		for (const n of sorted) {
			const last = out[out.length - 1];
			if (typeof last === 'number' && n - last > 1) out.push('gap');
			out.push(n);
		}
		return out;
	});

	const edge = 'text-[13px] transition-colors';
</script>

{#if totalPages > 1}
	<nav
		aria-label="Pages"
		class="mt-20 flex items-center justify-between gap-6 border-t pt-6 sm:mt-24"
	>
		{#if page > 1}
			<a href={hrefFor(page - 1)} class={cn(edge, 'underline-offset-4 hover:underline')}
				>← Previous</a
			>
		{:else}
			<span class={cn(edge, 'text-muted-foreground/50')}>← Previous</span>
		{/if}

		<!-- Phones: just where you are. From sm up: the page numbers. -->
		<p class="text-[13px] text-muted-foreground tabular-nums sm:hidden">
			Page {page} of {totalPages}
		</p>
		<ul class="hidden items-center gap-6 text-[13px] tabular-nums sm:flex">
			{#each pages as item, i (i)}
				{#if item === 'gap'}
					<li class="text-muted-foreground" aria-hidden="true">…</li>
				{:else}
					<li>
						<a
							href={hrefFor(item)}
							aria-label="Page {item}"
							aria-current={item === page ? 'page' : undefined}
							class="border-b border-transparent pb-0.5 text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:border-foreground aria-[current=page]:text-foreground"
						>
							{item}
						</a>
					</li>
				{/if}
			{/each}
		</ul>

		{#if page < totalPages}
			<a href={hrefFor(page + 1)} class={cn(edge, 'underline-offset-4 hover:underline')}>Next →</a>
		{:else}
			<span class={cn(edge, 'text-muted-foreground/50')}>Next →</span>
		{/if}
	</nav>
{/if}
