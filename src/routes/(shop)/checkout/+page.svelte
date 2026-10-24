<script lang="ts">
	import { enhance } from '$app/forms';
	import { openAuth } from '#lib/auth.svelte.js';
	import SummaryBox from '#lib/components/cart/summary-box.svelte';
	import Field from '#lib/components/field.svelte';
	import PageHeader from '#lib/components/page-header.svelte';
	import { Alert, AlertDescription } from '#lib/components/ui/alert/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Checkbox } from '#lib/components/ui/checkbox/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import { formatNaira } from '#lib/format.js';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	let submitting = $state(false);

	const errors = $derived((form?.errors ?? {}) as Record<string, string | undefined>);
	// After a failed submit show what was typed; otherwise prefill from the account (if any).
	const values = $derived(
		(form?.values ??
			(data.customer
				? {
						customerName: data.customer.name,
						email: data.customer.email,
						phone: data.customer.phone,
						address: data.customer.address,
						city: data.customer.city,
						state: data.customer.state
					}
				: {})) as Record<string, string | undefined>
	);

	const textButton = 'underline underline-offset-4 hover:no-underline';
</script>

<svelte:head><title>Checkout · NLS Bookshop</title></svelte:head>

<PageHeader
	eyebrow="Checkout"
	title="Delivery & payment"
	description={data.customer
		? `Signed in as ${data.customer.email}.`
		: 'Checking out as a guest. No account needed.'}
>
	{#snippet actions()}
		{#if !data.customer}
			<p class="text-sm text-muted-foreground">
				Have an account?
				<button
					type="button"
					class={textButton + ' text-foreground'}
					onclick={() => openAuth('login')}
				>
					Log in
				</button>
			</p>
		{/if}
	{/snippet}
</PageHeader>

<div class="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-20">
	<form
		method="POST"
		class="space-y-12"
		use:enhance={() => {
			submitting = true;
			return async ({ update }) => {
				await update({ reset: false });
				submitting = false;
			};
		}}
	>
		{#if form?.message}
			<Alert variant="destructive"><AlertDescription>{form.message}</AlertDescription></Alert>
		{/if}

		<section>
			<h2 class="mb-1 eyebrow">01 · Contact</h2>
			<p class="mb-7 text-sm text-muted-foreground">We'll email your receipt here.</p>
			<div class="grid gap-6 sm:grid-cols-2">
				<div class="sm:col-span-2">
					<Field
						label="Full name"
						name="customerName"
						autocomplete="name"
						value={values.customerName ?? ''}
						error={errors.customerName}
						required
					/>
				</div>
				<Field
					label="Email"
					name="email"
					type="email"
					autocomplete="email"
					value={values.email ?? ''}
					error={errors.email}
					required
				/>
				<Field
					label="Phone number"
					name="phone"
					type="tel"
					autocomplete="tel"
					value={values.phone ?? ''}
					error={errors.phone}
					required
				/>
			</div>
		</section>

		<section class="border-t pt-12">
			<h2 class="mb-1 eyebrow">02 · Delivery address</h2>
			<p class="mb-7 text-sm text-muted-foreground">Where should we send your order?</p>
			<div class="grid gap-6 sm:grid-cols-2">
				<div class="sm:col-span-2">
					<Field
						label="Street address"
						name="address"
						autocomplete="street-address"
						value={values.address ?? ''}
						error={errors.address}
						required
					/>
				</div>
				<Field
					label="City"
					name="city"
					autocomplete="address-level2"
					value={values.city ?? ''}
					error={errors.city}
					required
				/>
				<Field
					label="State"
					name="state"
					autocomplete="address-level1"
					value={values.state ?? ''}
					error={errors.state}
					required
				/>
			</div>
		</section>

		{#if data.customer}
			<div class="flex items-center gap-3 border-t pt-8">
				<Checkbox id="saveDetails" name="saveDetails" checked />
				<Label for="saveDetails" class="font-normal">Save these details to my account</Label>
			</div>
		{/if}

		<Button type="submit" size="lg" class="h-12 px-10 max-sm:w-full" disabled={submitting}>
			{submitting ? 'Redirecting to payment…' : `Pay ${formatNaira(data.total)}`}
		</Button>
	</form>

	<SummaryBox title="Your order">
		<ul class="space-y-4 text-sm">
			{#each data.lines as line (line.book.id)}
				<li class="flex justify-between gap-4">
					<span class="min-w-0">
						<span class="block truncate font-serif text-base">{line.book.title}</span>
						<span class="text-muted-foreground">Qty {line.qty}</span>
					</span>
					<span class="tabular-nums">{formatNaira(line.subtotal)}</span>
				</li>
			{/each}
		</ul>
		<div class="mt-6 flex items-baseline justify-between gap-4 border-t pt-6">
			<span class="text-sm">Total</span>
			<span class="font-serif text-3xl tracking-tight tabular-nums">{formatNaira(data.total)}</span>
		</div>
	</SummaryBox>
</div>
