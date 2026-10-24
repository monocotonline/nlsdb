<script lang="ts">
	import { Share08Icon } from '@hugeicons/core-free-icons';
	import { onMount } from 'svelte';
	import Icon from '#lib/components/icon.svelte';
	import ShareDialog from '#lib/components/share/share-dialog.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import type { ShareContent } from '#lib/share-targets.js';

	let { content, class: className }: { content: ShareContent; class?: string } = $props();

	let open = $state(false);
	let native = $state(false);

	onMount(() => {
		native = typeof navigator.share === 'function';
	});

	// Phones (and some desktops) have a built-in share sheet with every installed app, so use it.
	// Everywhere else, or if the person cancels it, fall back to our own dialog.
	async function share() {
		if (native) {
			try {
				await navigator.share(content);
				return;
			} catch (e) {
				if ((e as DOMException).name === 'AbortError') return; // closed the sheet on purpose
			}
		}
		open = true;
	}
</script>

<Button type="button" variant="outline" size="lg" class={className} onclick={share}>
	<Icon icon={Share08Icon} /> Share
</Button>

<ShareDialog bind:open {content} />
