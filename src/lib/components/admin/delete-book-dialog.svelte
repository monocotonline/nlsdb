<script lang="ts">
	import { Delete02Icon } from '@hugeicons/core-free-icons';
	import { enhance } from '$app/forms';
	import DialogHeading from '#lib/components/dialog-heading.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import type { Book } from '#lib/types.js';

	let { open = $bindable(false), book }: { open?: boolean; book: Book | null } = $props();

	let busy = $state(false);
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="gap-6">
		<DialogHeading
			icon={Delete02Icon}
			tone="destructive"
			title="Delete this product?"
			description={book
				? `“${book.title}” will be removed from the shop. Past orders keep their record of it.`
				: ''}
		/>
		<form
			method="POST"
			action="?/delete"
			class="grid grid-cols-2 gap-3"
			use:enhance={() => {
				busy = true;
				return async ({ update }) => {
					await update({ reset: false });
					busy = false;
					open = false;
				};
			}}
		>
			<input type="hidden" name="id" value={book?.id ?? ''} />
			<Button type="button" variant="outline" size="lg" onclick={() => (open = false)}>
				Cancel
			</Button>
			<Button
				type="submit"
				variant="destructive"
				size="lg"
				class="bg-destructive text-white hover:bg-destructive/90"
				disabled={busy}
			>
				{busy ? 'Deleting…' : 'Delete'}
			</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
