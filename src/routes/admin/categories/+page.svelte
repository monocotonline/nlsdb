<script lang="ts">
	import { Add01Icon, Delete02Icon, Edit02Icon, Folder01Icon } from '@hugeicons/core-free-icons';
	import { enhance } from '$app/forms';
	import DialogHeading from '#lib/components/dialog-heading.svelte';
	import Icon from '#lib/components/icon.svelte';
	import { Alert, AlertDescription } from '#lib/components/ui/alert/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import CategoryDialog from './category-dialog.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	type Row = (typeof data.categories)[number];

	// A new key each time a dialog opens, so it always starts with fresh form state.
	let editor = $state<{ open: boolean; category: Row | null; key: number }>({
		open: false,
		category: null,
		key: 0
	});
	let removal = $state<{ open: boolean; category: Row | null; busy: boolean }>({
		open: false,
		category: null,
		busy: false
	});

	function openEditor(category: Row | null) {
		editor.category = category;
		editor.key++;
		editor.open = true;
	}

	// Shown after a bulk add when some names were skipped.
	const skippedNotice = $derived(
		form?.action === 'create' && form.success && form.skipped?.length
			? `Added ${form.created}. Skipped ${form.skipped.length} that already ${form.skipped.length === 1 ? 'exists' : 'exist'}: ${form.skipped.join(', ')}.`
			: undefined
	);
	const deleteError = $derived(form?.action === 'delete' ? form.message : undefined);
</script>

<!-- Stacked on phones (button under the text), side by side from sm up. -->
<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
	<div>
		<h1 class="text-2xl font-semibold">Categories</h1>
		<p class="text-sm text-muted-foreground">
			Group products by type, course or area of law, for example Books, Clothing or Civil
			Litigation. They appear in the product form and as filters in the shop.
		</p>
	</div>
	<Button class="w-full sm:w-auto" onclick={() => openEditor(null)}>
		<Icon icon={Add01Icon} /> Add category
	</Button>
</div>

{#if skippedNotice}
	<Alert class="mb-4"><AlertDescription>{skippedNotice}</AlertDescription></Alert>
{/if}

{#if deleteError}
	<Alert variant="destructive" class="mb-4"
		><AlertDescription>{deleteError}</AlertDescription></Alert
	>
{/if}

<Card.Root class="py-0">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="pl-6">Category</Table.Head>
				<Table.Head class="text-right">Products</Table.Head>
				<Table.Head class="w-28 pr-6"></Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.categories as category (category.id)}
				<Table.Row>
					<Table.Cell class="pl-6">
						<div class="flex items-center gap-3">
							<span
								class="flex size-8 items-center justify-center rounded-md bg-accent text-accent-foreground"
							>
								<Icon icon={Folder01Icon} size={16} />
							</span>
							<span class="font-medium">{category.name}</span>
						</div>
					</Table.Cell>
					<Table.Cell class="text-right text-muted-foreground tabular-nums">
						{category.books}
					</Table.Cell>
					<Table.Cell class="pr-6">
						<div class="flex justify-end gap-1">
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label="Rename {category.name}"
								onclick={() => openEditor(category)}
							>
								<Icon icon={Edit02Icon} />
							</Button>
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label="Delete {category.name}"
								class="text-muted-foreground hover:text-destructive"
								onclick={() => (removal = { open: true, category, busy: false })}
							>
								<Icon icon={Delete02Icon} />
							</Button>
						</div>
					</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={3} class="py-14 text-center">
						<span
							class="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-muted"
						>
							<Icon icon={Folder01Icon} size={22} class="text-muted-foreground" />
						</span>
						<p class="font-medium">No categories yet</p>
						<p class="mt-1 text-sm text-muted-foreground">
							Add your first one to start organising products.
						</p>
					</Table.Cell>
				</Table.Row>
			{/each}
			{#if data.uncategorised > 0}
				<Table.Row class="bg-muted/30 hover:bg-muted/30">
					<Table.Cell class="pl-6 text-muted-foreground">
						<Badge variant="secondary">Uncategorised</Badge>
					</Table.Cell>
					<Table.Cell class="text-right text-muted-foreground tabular-nums">
						{data.uncategorised}
					</Table.Cell>
					<Table.Cell></Table.Cell>
				</Table.Row>
			{/if}
		</Table.Body>
	</Table.Root>
</Card.Root>

{#key editor.key}
	<CategoryDialog
		bind:open={editor.open}
		category={editor.category}
		existing={data.categories.map((c) => c.name)}
	/>
{/key}

<Dialog.Root bind:open={removal.open}>
	<Dialog.Content class="gap-6">
		<DialogHeading
			icon={Delete02Icon}
			tone="destructive"
			title="Delete category?"
			description={removal.category
				? `“${removal.category.name}” will be removed.${
						removal.category.books
							? ` Its ${removal.category.books} ${removal.category.books === 1 ? 'product' : 'products'} will become uncategorised, but won't be deleted.`
							: ''
					}`
				: ''}
		/>
		<form
			method="POST"
			action="?/delete"
			class="grid grid-cols-2 gap-3"
			use:enhance={() => {
				removal.busy = true;
				return async ({ update }) => {
					await update({ reset: false });
					removal.busy = false;
					removal.open = false;
				};
			}}
		>
			<input type="hidden" name="id" value={removal.category?.id ?? ''} />
			<Button type="button" variant="outline" size="lg" onclick={() => (removal.open = false)}>
				Cancel
			</Button>
			<Button
				type="submit"
				variant="destructive"
				size="lg"
				class="bg-destructive text-white hover:bg-destructive/90"
				disabled={removal.busy}
			>
				{removal.busy ? 'Deleting…' : 'Delete'}
			</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
