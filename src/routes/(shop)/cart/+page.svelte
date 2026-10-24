<script lang="ts">
	import CartLine from '#lib/components/cart/cart-line.svelte';
	import SummaryBox from '#lib/components/cart/summary-box.svelte';
	import PageHeader from '#lib/components/page-header.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { formatNaira } from '#lib/format.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head><title>Cart · NLS Bookshop</title></svelte:head>

<PageHeader
	eyebrow="Cart"
	title={data.lines.length === 0 ? 'Your cart is empty.' : 'Your cart'}
	description={data.lines.length === 0
		? 'Nothing here yet. Browse the shop to find what you need for the Bar Finals.'
		: `${data.count} ${data.count === 1 ? 'item' : 'items'}`}
>
	{#snippet actions()}
		<a href="/#products" class="text-sm underline underline-offset-4">Continue shopping</a>
	{/snippet}
</PageHeader>

{#if data.removed > 0}
	<p class="mb-10 border-y py-4 text-sm text-muted-foreground">
		{data.removed === 1 ? 'An item' : `${data.removed} items`} in your cart
		{data.removed === 1 ? 'is' : 'are'} no longer available and
		{data.removed === 1 ? 'was' : 'were'} removed.
	</p>
{/if}

{#if data.lines.length > 0}
	<div class="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-20">
		<ul class="divide-y border-b">
			{#each data.lines as line (line.book.id)}
				<CartLine {line} />
			{/each}
		</ul>

		<SummaryBox>
			<dl class="space-y-4 text-sm">
				<div class="flex justify-between gap-4">
					<dt class="text-muted-foreground">
						Subtotal ({data.count}
						{data.count === 1 ? 'item' : 'items'})
					</dt>
					<dd class="tabular-nums">{formatNaira(data.total)}</dd>
				</div>
				<div class="flex justify-between gap-4">
					<dt class="text-muted-foreground">Delivery</dt>
					<dd class="text-muted-foreground">Arranged after order</dd>
				</div>
			</dl>
			<div class="mt-6 flex items-baseline justify-between gap-4 border-t pt-6">
				<span class="text-sm">Total</span>
				<span class="font-serif text-3xl tracking-tight tabular-nums"
					>{formatNaira(data.total)}</span
				>
			</div>
			<Button href="/checkout" size="lg" class="mt-8 h-12 w-full">Proceed to checkout</Button>
			<p class="mt-4 text-center text-xs text-muted-foreground">
				No account needed. You'll enter your delivery details next.
			</p>
		</SummaryBox>
	</div>
{/if}
