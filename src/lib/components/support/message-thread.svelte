<script lang="ts">
	import { formatDate } from '#lib/format.js';
	import { cn } from '#lib/utils.js';
	import type { TicketMessage } from '#lib/types.js';

	let {
		messages,
		viewer
	}: {
		messages: TicketMessage[];
		/** Whose screen this is. Their own messages sit on the right. */
		viewer: 'customer' | 'admin';
	} = $props();
</script>

<ol class="space-y-5" aria-label="Conversation">
	{#each messages as message (message.id)}
		{@const mine = message.sender === viewer}
		<li class={cn('flex flex-col gap-1.5', mine ? 'items-end' : 'items-start')}>
			<div class={cn('flex items-baseline gap-2 px-1 text-xs', mine && 'flex-row-reverse')}>
				<span class="font-medium text-foreground">
					{mine
						? 'You'
						: message.sender === 'admin'
							? `${message.authorName || 'Support'} (Support)`
							: message.authorName}
				</span>
				<span class="text-muted-foreground">{formatDate(message.created)}</span>
			</div>
			<div
				class={cn(
					'max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap sm:max-w-[75%]',
					mine
						? 'rounded-br-md bg-primary text-primary-foreground'
						: 'rounded-bl-md bg-muted text-foreground'
				)}
			>
				{message.body}
			</div>
		</li>
	{/each}
</ol>
