<script lang="ts">
	import { enhance } from '$app/forms';
	import Field from '#lib/components/field.svelte';
	import PageHeader from '#lib/components/page-header.svelte';
	import { Alert, AlertDescription } from '#lib/components/ui/alert/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import { Textarea } from '#lib/components/ui/textarea/index.js';
	import { LIMITS } from '#lib/support.js';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	let sending = $state(false);
	let tracking = $state(false);

	// After a failed send show what was typed; otherwise start from the account (if logged in).
	const values = $derived({
		name: form?.values?.name ?? data.customer?.name ?? '',
		email: form?.values?.email ?? data.customer?.email ?? '',
		subject: form?.values?.subject ?? '',
		orderReference: form?.values?.orderReference ?? data.order,
		message: form?.values?.message ?? ''
	});
	const errors = $derived((form?.errors ?? {}) as Record<string, string | undefined>);
</script>

<svelte:head><title>Support · NLS Bookshop</title></svelte:head>

<PageHeader
	eyebrow="Help"
	title="How can we help?"
	description="Send us a message and we'll reply in a private conversation. You'll get a link to come back to it, no account needed."
/>

<div class="grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-20">
	<form
		method="POST"
		action="?/create"
		class="space-y-7"
		use:enhance={() => {
			sending = true;
			return async ({ update }) => {
				await update({ reset: false });
				sending = false;
			};
		}}
	>
		<h2 class="eyebrow">Contact support</h2>

		{#if form?.message}
			<Alert variant="destructive"><AlertDescription>{form.message}</AlertDescription></Alert>
		{/if}

		<div class="grid gap-6 sm:grid-cols-2">
			<Field
				label="Your name"
				name="name"
				autocomplete="name"
				value={values.name}
				error={errors.name}
				required
			/>
			<Field
				label="Email"
				name="email"
				type="email"
				autocomplete="email"
				value={values.email}
				error={errors.email}
				required
			/>
			<Field
				label="Order number (optional)"
				name="orderReference"
				placeholder="NLS-XXXXXXXXXXXXXXXX"
				value={values.orderReference}
				error={errors.orderReference}
			/>
			<Field
				label="Subject (optional)"
				name="subject"
				placeholder="What is this about?"
				value={values.subject}
				error={errors.subject}
			/>
		</div>

		<div class="grid gap-2">
			<Label for="message">Message</Label>
			<Textarea
				id="message"
				name="message"
				rows={7}
				maxlength={LIMITS.message}
				value={values.message}
				placeholder="Describe the problem or question…"
				aria-invalid={errors.message ? true : undefined}
				required
			/>
			{#if errors.message}<p class="text-sm text-destructive">{errors.message}</p>{/if}
		</div>

		<!-- Honeypot: invisible to people, tempting to bots. -->
		<div class="absolute -left-[9999px] size-px overflow-hidden" aria-hidden="true">
			<label>Leave this empty <input name="website" tabindex="-1" autocomplete="off" /></label>
		</div>

		<Button type="submit" size="lg" class="h-12 px-10 max-sm:w-full" disabled={sending}>
			{sending ? 'Sending…' : 'Send message'}
		</Button>
	</form>

	<aside id="track" class="scroll-mt-28 border bg-card p-7 sm:p-8">
		<h2 class="mb-2 eyebrow">Find your order</h2>
		<p class="mb-7 text-sm text-muted-foreground">
			Lost your receipt? Enter the order number and the email you used at checkout.
		</p>
		<form
			method="POST"
			action="?/track"
			class="space-y-6"
			use:enhance={() => {
				tracking = true;
				return async ({ update }) => {
					await update({ reset: false });
					tracking = false;
				};
			}}
		>
			{#if form?.trackError}
				<Alert variant="destructive"><AlertDescription>{form.trackError}</AlertDescription></Alert>
			{/if}
			<Field
				label="Order number"
				name="reference"
				placeholder="NLS-XXXXXXXXXXXXXXXX"
				value={form?.trackValues?.reference ?? ''}
				required
			/>
			<Field
				label="Email"
				name="trackEmail"
				type="email"
				autocomplete="email"
				value={form?.trackValues?.email ?? ''}
				required
			/>
			<Button type="submit" variant="outline" size="lg" class="h-12 w-full" disabled={tracking}>
				{tracking ? 'Looking…' : 'Find order'}
			</Button>
		</form>
	</aside>
</div>
