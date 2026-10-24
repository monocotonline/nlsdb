<script lang="ts">
	import FulfilmentTracker from '#lib/components/orders/fulfilment-tracker.svelte';
	import PageHeader from '#lib/components/page-header.svelte';
	import * as Table from '#lib/components/ui/table/index.js';
	import { formatDate, formatNaira } from '#lib/format.js';
	import { cn } from '#lib/utils.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const order = $derived(data.order);

	const copy = $derived(
		{
			success: {
				title: 'Thank you.',
				note: 'Your payment went through. Your order will be sent to the address below.',
				tone: 'text-success'
			},
			pending: {
				title: 'Payment pending.',
				note: "We haven't received confirmation yet.",
				tone: 'text-warning'
			},
			failed: {
				title: 'Payment failed.',
				note: 'You have not been charged for this order.',
				tone: 'text-destructive'
			},
			cancelled: {
				title: 'Order cancelled.',
				note: 'This order was cancelled and you have not been charged.',
				tone: 'text-muted-foreground'
			}
		}[order.status]
	);

	const label = 'eyebrow mb-3';
</script>

<svelte:head><title>Receipt {order.reference} · NLS Bookshop</title></svelte:head>

<PageHeader eyebrow="Order {order.reference}" title={copy.title} description={copy.note}>
	{#snippet actions()}
		<span class={cn('eyebrow', copy.tone)}>
			{{ success: 'Paid', pending: 'Pending', failed: 'Failed', cancelled: 'Cancelled' }[
				order.status
			]}
		</span>
	{/snippet}
</PageHeader>

<!-- Left-aligned on the page's own edge, and narrower than the full width so lines stay readable. -->
<div class="max-w-3xl space-y-14">
	{#if order.status === 'pending'}
		<p class="text-sm">
			<a href="/orders/{order.reference}" class="underline underline-offset-4">Check again</a>
		</p>
	{:else if order.status === 'failed' || order.status === 'cancelled'}
		<p class="text-sm">
			<a href="/cart" class="underline underline-offset-4">Return to your cart to try again</a>
		</p>
	{/if}

	{#if order.status === 'success'}
		<FulfilmentTracker fulfilment={order.fulfilment} />
	{/if}

	<section>
		<h2 class={label}>Receipt · {formatDate(order.created)}</h2>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="px-0">Item</Table.Head>
					<Table.Head class="text-center">Qty</Table.Head>
					<Table.Head class="px-0 text-right">Amount</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each order.items as item (item.id)}
					<Table.Row>
						<Table.Cell class="px-0 whitespace-normal">
							<span class="font-serif text-base">{item.title}</span>
							{#if item.author}
								<span class="block text-muted-foreground">{item.author}</span>
							{/if}
						</Table.Cell>
						<Table.Cell class="text-center tabular-nums">{item.quantity}</Table.Cell>
						<Table.Cell class="px-0 text-right tabular-nums">
							{formatNaira(item.unitPrice * item.quantity)}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
			<Table.Footer>
				<Table.Row>
					<Table.Cell colspan={2} class="px-0 py-5">Total</Table.Cell>
					<Table.Cell class="px-0 py-5 text-right font-serif text-2xl tabular-nums">
						{formatNaira(order.total)}
					</Table.Cell>
				</Table.Row>
			</Table.Footer>
		</Table.Root>
	</section>

	<section class="grid gap-10 border-t pt-10 text-sm sm:grid-cols-2">
		<div>
			<h2 class={label}>Customer</h2>
			<p>{order.customerName}</p>
			<p class="text-muted-foreground">{order.email}</p>
			<p class="text-muted-foreground">{order.phone}</p>
		</div>
		<div>
			<h2 class={label}>Deliver to</h2>
			<p>{order.address}</p>
			<p class="text-muted-foreground">{order.city}, {order.state}</p>
		</div>
	</section>

	<div class="flex flex-wrap gap-x-8 gap-y-3 border-t pt-8 text-sm print:hidden">
		<button
			type="button"
			class="underline underline-offset-4 hover:no-underline"
			onclick={() => window.print()}
		>
			Print receipt
		</button>
		<a href="/#products" class="underline underline-offset-4 hover:no-underline"
			>Continue shopping</a
		>
		<a
			href="/support?order={order.reference}"
			class="underline underline-offset-4 hover:no-underline"
		>
			Need help with this order?
		</a>
	</div>
</div>
