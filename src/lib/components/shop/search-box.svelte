<script lang="ts">
	import { cn } from '#lib/utils.js';

	let {
		value,
		category = '',
		sort = 'newest',
		onsearch,
		class: className
	}: {
		/** The search text currently in the URL. */
		value: string;
		/** Carried as hidden fields so the plain (no-JavaScript) form keeps the other filters. */
		category?: string;
		sort?: string;
		onsearch: (q: string) => void;
		class?: string;
	} = $props();

	let text = $state('');
	let input = $state<HTMLInputElement | null>(null);
	let timer: ReturnType<typeof setTimeout>;

	// Keep the box in step with the URL (for example after "Clear all"), but never overwrite
	// what someone is in the middle of typing.
	$effect(() => {
		const fromUrl = value;
		if (document.activeElement !== input) text = fromUrl;
	});

	function onInput() {
		clearTimeout(timer);
		timer = setTimeout(() => onsearch(text), 300);
	}

	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		clearTimeout(timer);
		onsearch(text);
	}
</script>

<!-- A real GET form, so search also works without JavaScript. Just a line to type on. -->
<form action="/#products" method="GET" role="search" onsubmit={onSubmit} class={cn(className)}>
	<input
		bind:this={input}
		bind:value={text}
		oninput={onInput}
		name="q"
		type="search"
		placeholder="Search"
		aria-label="Search products"
		autocomplete="off"
		class="h-10 w-full rounded-none border-0 border-b border-input bg-transparent px-0 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground [&::-webkit-search-cancel-button]:hidden"
	/>
	{#if category}<input type="hidden" name="category" value={category} />{/if}
	{#if sort !== 'newest'}<input type="hidden" name="sort" value={sort} />{/if}
</form>
