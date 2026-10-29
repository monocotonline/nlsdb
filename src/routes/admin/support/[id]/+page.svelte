<script lang="ts">
	import { ArrowLeft01Icon, Copy01Icon, Mail01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { refreshAll } from '$app/navigation';
	import { page } from '$app/state';
	import Icon from '#lib/components/icon.svelte';
	import MessageThread from '#lib/components/support/message-thread.svelte';
	import ReplyForm from '#lib/components/support/reply-form.svelte';
	import TicketStatus from '#lib/components/support/ticket-status.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import { formatDate } from '#lib/format.js';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const ticket = $derived(data.ticket);
	let copied = $state(false);

	// The customer's private conversation page. Replies are not emailed, so this link is how a
	// customer gets back to the conversation; it can be pasted into an email or message.
	const customerLink = $derived(`${page.url.origin}/support/${ticket.token}`);
	const mailto = $derived(
		`mailto:${ticket.email}?subject=${encodeURIComponent(`Re: ${ticket.subject || 'Your support request'}`)}` +
			`&body=${encodeURIComponent(`Hello ${ticket.name},\n\nWe've replied to your message. You can read it here:\n${customerLink}\n`)}`
	);

	// New customer messages appear without reloading.
	onMount(() => {
		const timer = setInterval(() => {
			if (!document.hidden) refreshAll();
		}, 15_000);
		return () => clearInterval(timer);
	});

	async function copyLink() {
		try {
			await navigator.clipboard.writeText(customerLink);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			// clipboard unavailable (needs https)
		}
	}
</script>

<Button href="/admin/support" variant="ghost" size="sm" class="mb-4 -ml-3">
	<Icon icon={ArrowLeft01Icon} /> All conversations
</Button>

<div class="grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
	<div class="min-w-0 space-y-4">
		<div class="flex flex-wrap items-start justify-between gap-3">
			<div class="min-w-0">
				<h1 class="display text-3xl sm:text-4xl">
					{ticket.subject || 'No subject'}
				</h1>
				<p class="mt-1 text-sm text-muted-foreground">Started {formatDate(ticket.created)}</p>
			</div>
			<TicketStatus {ticket} audience="admin" />
		</div>

		<Card.Root class="rounded-lg border bg-transparent ring-0">
			<Card.Content class="space-y-8">
				<MessageThread messages={data.messages} viewer="admin" />
				<div class="border-t pt-6">
					<ReplyForm
						label="Send reply"
						placeholder="Write a reply to the customer…"
						error={form?.message}
					/>
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<aside class="space-y-4 lg:sticky lg:top-0">
		<Card.Root size="sm" class="rounded-lg border bg-transparent ring-0">
			<Card.Header><Card.Title class="text-sm">Customer</Card.Title></Card.Header>
			<Card.Content class="space-y-3 text-sm">
				<div>
					<p class="font-medium">{ticket.name}</p>
					<a href="mailto:{ticket.email}" class="break-all text-muted-foreground hover:underline">
						{ticket.email}
					</a>
				</div>
				{#if ticket.orderReference}
					<div>
						<p class="text-xs text-muted-foreground">Order</p>
						<a
							href="/orders/{ticket.orderReference}"
							target="_blank"
							rel="noopener"
							class="font-mono text-xs hover:underline"
						>
							{ticket.orderReference}
						</a>
					</div>
				{/if}
			</Card.Content>
		</Card.Root>

		<Card.Root size="sm" class="rounded-lg border bg-transparent ring-0">
			<Card.Header><Card.Title class="text-sm">Let the customer know</Card.Title></Card.Header>
			<Card.Content class="space-y-3">
				<p class="text-sm text-muted-foreground">
					Replies aren't emailed automatically. Send the customer their conversation link so they
					can read it.
				</p>
				<div class="grid gap-2">
					<Button href={mailto} variant="outline"
						><Icon icon={Mail01Icon} size={16} /> Email the link</Button
					>
					<Button type="button" variant="outline" onclick={copyLink}>
						<Icon icon={copied ? Tick02Icon : Copy01Icon} size={16} />
						{copied ? 'Copied' : 'Copy customer link'}
					</Button>
				</div>
			</Card.Content>
		</Card.Root>

		<form
			method="POST"
			action={ticket.status === 'resolved' ? '?/reopen' : '?/resolve'}
			use:enhance
		>
			<Button
				type="submit"
				variant={ticket.status === 'resolved' ? 'outline' : 'default'}
				class="w-full"
			>
				{#if ticket.status !== 'resolved'}<Icon icon={Tick02Icon} size={16} />{/if}
				{ticket.status === 'resolved' ? 'Reopen conversation' : 'Mark as resolved'}
			</Button>
		</form>
	</aside>
</div>
