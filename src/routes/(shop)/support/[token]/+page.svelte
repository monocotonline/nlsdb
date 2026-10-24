<script lang="ts">
	import { onMount } from 'svelte';
	import { refreshAll } from '$app/navigation';
	import { page } from '$app/state';
	import PageHeader from '#lib/components/page-header.svelte';
	import MessageThread from '#lib/components/support/message-thread.svelte';
	import ReplyForm from '#lib/components/support/reply-form.svelte';
	import TicketStatus from '#lib/components/support/ticket-status.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const ticket = $derived(data.ticket);
	let copied = $state(false);

	// New replies appear without reloading: check every 15 seconds while the tab is visible.
	onMount(() => {
		const timer = setInterval(() => {
			if (!document.hidden) refreshAll();
		}, 15_000);
		return () => clearInterval(timer);
	});

	async function copyLink() {
		try {
			await navigator.clipboard.writeText(page.url.origin + page.url.pathname);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			// clipboard unavailable (needs https); the address bar still has the link
		}
	}
</script>

<svelte:head>
	<title>{ticket.subject || 'Support conversation'} · NLS Bookshop</title>
	<!-- This is a private link, so keep it out of search results. -->
	<meta name="robots" content="noindex" />
</svelte:head>

<PageHeader eyebrow="Support conversation" title={ticket.subject || 'Your message'}>
	{#snippet actions()}
		<TicketStatus {ticket} audience="customer" />
	{/snippet}
</PageHeader>

<div class="max-w-3xl">
	{#if data.sent}
		<p class="mb-10 border-y py-4 text-sm">
			Thanks, your message has been sent. We'll reply right here, so keep this page or its link.
		</p>
	{/if}

	{#if ticket.orderReference}
		<p class="mb-8 text-sm text-muted-foreground">
			About order
			<a href="/orders/{ticket.orderReference}" class="font-mono text-foreground hover:underline">
				{ticket.orderReference}
			</a>
		</p>
	{/if}

	<MessageThread messages={data.messages} viewer="customer" />

	<div class="mt-12 border-t pt-8">
		<ReplyForm
			label={ticket.status === 'resolved' ? 'Reopen with a reply' : 'Send reply'}
			placeholder={ticket.status === 'resolved'
				? 'Still need help? Write here to reopen this conversation…'
				: 'Write a reply…'}
			error={form?.message}
		/>
	</div>

	<div class="mt-14 flex flex-wrap items-center justify-between gap-4 border-t pt-6 text-sm">
		<p class="max-w-md text-muted-foreground">
			This conversation is private. Anyone with this link can read it, so save it somewhere safe.
		</p>
		<button
			type="button"
			class="underline underline-offset-4 hover:no-underline"
			onclick={copyLink}
		>
			{copied ? 'Copied' : 'Copy link'}
		</button>
	</div>
</div>
