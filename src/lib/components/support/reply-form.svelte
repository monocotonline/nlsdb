<script lang="ts">
	import { SentIcon } from '@hugeicons/core-free-icons';
	import { enhance } from '$app/forms';
	import Icon from '#lib/components/icon.svelte';
	import { Alert, AlertDescription } from '#lib/components/ui/alert/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Textarea } from '#lib/components/ui/textarea/index.js';

	let {
		action = '?/reply',
		label = 'Reply',
		placeholder = 'Write a message…',
		error
	}: { action?: string; label?: string; placeholder?: string; error?: string } = $props();

	let sending = $state(false);
	let text = $state('');
	let form = $state<HTMLFormElement>();

	// Ctrl/Cmd + Enter sends, like most chat boxes.
	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
			event.preventDefault();
			form?.requestSubmit();
		}
	}
</script>

<form
	bind:this={form}
	method="POST"
	{action}
	class="space-y-3"
	use:enhance={() => {
		sending = true;
		return async ({ result, update }) => {
			sending = false;
			if (result.type === 'success') text = '';
			await update({ reset: false });
		};
	}}
>
	{#if error}
		<Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
	{/if}
	<Textarea
		name="message"
		bind:value={text}
		rows={4}
		{placeholder}
		aria-label={label}
		onkeydown={onKeydown}
		class="resize-y"
	/>
	<div class="flex items-center justify-between gap-3">
		<p class="hidden text-xs text-muted-foreground sm:block">Press Ctrl + Enter to send</p>
		<Button
			type="submit"
			disabled={sending || text.trim().length === 0}
			class="ml-auto max-sm:w-full"
		>
			<Icon icon={SentIcon} size={17} />
			{sending ? 'Sending…' : label}
		</Button>
	</div>
</form>
