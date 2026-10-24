<script lang="ts">
	import { Copy01Icon, Share08Icon, Tick02Icon } from '@hugeicons/core-free-icons';
	import DialogHeading from '#lib/components/dialog-heading.svelte';
	import Icon from '#lib/components/icon.svelte';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import { cn } from '#lib/utils.js';
	import { shareTargets, type ShareContent } from '#lib/share-targets.js';

	let { open = $bindable(false), content }: { open?: boolean; content: ShareContent } = $props();

	let copied = $state(false);
	let copyFailed = $state(false);

	async function copy() {
		copyFailed = false;
		try {
			await navigator.clipboard.writeText(content.url);
		} catch {
			// Clipboard API needs https; fall back to selecting a temporary field.
			const field = document.createElement('input');
			field.value = content.url;
			document.body.appendChild(field);
			field.select();
			const ok = document.execCommand('copy');
			field.remove();
			if (!ok) {
				copyFailed = true;
				return;
			}
		}
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	const tile =
		'flex flex-col items-center gap-2 rounded-xl p-3 text-xs font-medium transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none';
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="gap-6">
		<DialogHeading
			icon={Share08Icon}
			title="Share this product"
			description="Send it to a friend, a coursemate or your group chat."
		/>

		<div class="grid grid-cols-3 gap-1">
			{#each shareTargets as target (target.id)}
				<a
					href={target.href(content)}
					target={target.id === 'email' ? undefined : '_blank'}
					rel="noopener noreferrer"
					class={tile}
					onclick={() => (open = false)}
				>
					<span class={cn('flex size-12 items-center justify-center rounded-full', target.tone)}>
						<Icon icon={target.icon} size={22} />
					</span>
					{target.label}
				</a>
			{/each}
			<button type="button" class={tile} onclick={copy}>
				<span
					class={cn(
						'flex size-12 items-center justify-center rounded-full transition-colors',
						copied ? 'bg-success/10 text-success' : 'bg-muted text-foreground'
					)}
				>
					<Icon icon={copied ? Tick02Icon : Copy01Icon} size={22} />
				</span>
				{copied ? 'Copied!' : 'Copy link'}
			</button>
		</div>

		<div class="rounded-lg border bg-muted/40 px-3 py-2.5">
			<p class="truncate text-sm text-muted-foreground select-all">{content.url}</p>
		</div>
		{#if copyFailed}
			<p class="-mt-3 text-center text-sm text-destructive">
				Couldn't copy automatically. Select the link above and copy it.
			</p>
		{/if}
	</Dialog.Content>
</Dialog.Root>
