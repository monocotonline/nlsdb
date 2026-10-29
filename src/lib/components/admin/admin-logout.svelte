<script lang="ts">
	import { ADMIN_PATH } from '#lib/admin-path.js';
	import { Logout01Icon } from '@hugeicons/core-free-icons';
	import Icon from '#lib/components/icon.svelte';
	import { Button } from '#lib/components/ui/button/index.js';

	/** `icon` is a compact square button (top bar on phones); `full` is a labelled, full-width one. */
	let { mode = 'full' }: { mode?: 'icon' | 'full' } = $props();
</script>

<form method="POST" action="{ADMIN_PATH}/login?/logout">
	{#if mode === 'icon'}
		<Button type="submit" variant="outline" size="icon" aria-label="Log out">
			<Icon icon={Logout01Icon} size={18} />
		</Button>
	{:else}
		<Button type="submit" variant="outline" class="w-full">
			<Icon icon={Logout01Icon} size={18} /> Log out
		</Button>
	{/if}
</form>
