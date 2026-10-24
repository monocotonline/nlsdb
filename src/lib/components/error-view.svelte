<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '#lib/components/ui/button/index.js';

	let {
		status,
		message,
		path,
		homeHref = '/#products',
		homeLabel = 'Browse the shop'
	}: {
		status: number;
		message?: string;
		path: string;
		homeHref?: string;
		homeLabel?: string;
	} = $props();

	const copy = $derived.by(() => {
		if (status === 404) {
			if (path.startsWith('/products/')) {
				return {
					title: "We couldn't find that product",
					text: 'It may have been removed, or the link might be wrong.'
				};
			}
			if (path.startsWith('/orders/')) {
				return {
					title: "We couldn't find that order",
					text: 'Check the reference and try again.'
				};
			}
			return {
				title: 'Page not found',
				text: "The page you're looking for doesn't exist or has moved."
			};
		}
		return {
			title: 'Something went wrong',
			text: message || 'Please try again in a moment.'
		};
	});

	const retry = $derived(status >= 500);

	function back() {
		if (history.length > 1) history.back();
		else goto(homeHref);
	}
</script>

<svelte:head><title>{copy.title} · NLS Bookshop</title></svelte:head>

<div class="pt-16 pb-8 sm:pt-28">
	<p class="mb-6 eyebrow">Error {status}</p>
	<h1 class="max-w-[18ch] display text-[clamp(2.5rem,6.2vw,5rem)]">{copy.title}</h1>
	<p class="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">{copy.text}</p>

	<div class="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
		{#if retry}
			<Button size="lg" class="h-12 px-8" onclick={() => location.reload()}>Try again</Button>
		{:else}
			<Button href={homeHref} size="lg" class="h-12 px-8">{homeLabel}</Button>
		{/if}
		<button
			type="button"
			class="text-sm underline underline-offset-4 hover:no-underline"
			onclick={back}
		>
			Go back
		</button>
	</div>
</div>
