<script lang="ts">
	import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
	import Icon from '#lib/components/icon.svelte';
	import TicketStatus from '#lib/components/support/ticket-status.svelte';
	import { formatDate } from '#lib/format.js';
	import { cn } from '#lib/utils.js';
	import type { Ticket } from '#lib/types.js';

	let { ticket }: { ticket: Ticket } = $props();

	// Conversations waiting on an admin stand out; they are what the inbox is for.
	const needsReply = $derived(ticket.status === 'open' && ticket.awaiting === 'admin');
</script>

<a
	href="/admin/support/{ticket.id}"
	class={cn(
		'group flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/40 sm:p-5',
		needsReply && 'border-primary/40'
	)}
>
	<div class="min-w-0 flex-1">
		<div class="flex flex-wrap items-center gap-x-3 gap-y-1">
			<p class="truncate font-semibold">{ticket.subject || 'No subject'}</p>
			<TicketStatus {ticket} audience="admin" />
		</div>
		<p class="mt-1 truncate text-sm text-muted-foreground">
			{ticket.name} · {ticket.email}
		</p>
		<p class="mt-0.5 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
			<span>{formatDate(ticket.updated)}</span>
			{#if ticket.orderReference}<span class="font-mono">{ticket.orderReference}</span>{/if}
		</p>
	</div>
	<Icon
		icon={ArrowRight01Icon}
		size={18}
		class="text-muted-foreground transition-transform group-hover:translate-x-0.5"
	/>
</a>
