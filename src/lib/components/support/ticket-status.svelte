<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
	import type { Ticket } from '#lib/types.js';

	let {
		ticket,
		audience
	}: { ticket: Pick<Ticket, 'status' | 'awaiting'>; audience: 'customer' | 'admin' } = $props();

	// Resolved wins. Otherwise say who the ball is with, from the viewer's point of view.
	const view = $derived.by(() => {
		if (ticket.status === 'resolved') {
			return { label: 'Resolved', cls: 'bg-success/10 text-success' };
		}
		const yourTurn = ticket.awaiting === audience;
		return yourTurn
			? { label: 'Needs your reply', cls: 'bg-warning/20 text-amber-800 dark:text-amber-300' }
			: { label: 'Waiting for a reply', cls: '' };
	});
</script>

<Badge variant="secondary" class={view.cls}>{view.label}</Badge>
