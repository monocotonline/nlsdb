<script lang="ts">
	import { Cancel01Icon, Folder01Icon } from '@hugeicons/core-free-icons';
	import { enhance } from '$app/forms';
	import DialogHeading from '#lib/components/dialog-heading.svelte';
	import Field from '#lib/components/field.svelte';
	import Icon from '#lib/components/icon.svelte';
	import { Alert, AlertDescription } from '#lib/components/ui/alert/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import { Label } from '#lib/components/ui/label/index.js';

	let {
		open = $bindable(false),
		category,
		existing = []
	}: {
		open?: boolean;
		/** When set the dialog renames this category; otherwise it adds new ones. */
		category: { id: string; name: string } | null;
		/** Names that already exist, to avoid offering duplicates. */
		existing?: string[];
	} = $props();

	let saving = $state(false);
	let error = $state('');

	// Adding several: each name becomes a chip.
	let names = $state<string[]>([]);
	let draft = $state('');
	let hint = $state('');
	let input = $state<HTMLInputElement>();

	const known = $derived(new Set(existing.map((n) => n.toLowerCase())));

	function add(raw: string) {
		hint = '';
		const parts = raw
			.split(/[\n,;]+/)
			.map((p) => p.replace(/\s+/g, ' ').trim())
			.filter(Boolean);
		for (const part of parts) {
			const key = part.toLowerCase();
			if (known.has(key)) hint = `“${part}” already exists.`;
			else if (names.some((n) => n.toLowerCase() === key))
				hint = `“${part}” is already in the list.`;
			else names.push(part.slice(0, 100));
		}
	}

	function commitDraft() {
		if (draft.trim()) add(draft);
		draft = '';
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault();
			commitDraft();
		} else if (e.key === 'Backspace' && draft === '' && names.length) {
			names.pop();
		}
	}

	function onPaste(e: ClipboardEvent) {
		const text = e.clipboardData?.getData('text') ?? '';
		if (/[\n,;]/.test(text)) {
			e.preventDefault();
			add(draft + text);
			draft = '';
		}
	}

	const pending = $derived(
		names.length + (draft.trim() && !known.has(draft.trim().toLowerCase()) ? 1 : 0)
	);
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="gap-6">
		<DialogHeading
			icon={Folder01Icon}
			title={category ? 'Rename category' : 'Add categories'}
			description={category
				? 'Products in this category keep their place.'
				: 'Type a name and press Enter to add more. Paste a list to add many at once.'}
		/>

		<form
			method="POST"
			action={category ? '?/rename' : '?/create'}
			class="grid gap-4"
			use:enhance={({ formData }) => {
				if (!category) {
					commitDraft();
					formData.delete('names');
					for (const name of names) formData.append('names', name);
				}
				saving = true;
				error = '';
				return async ({ result, update }) => {
					saving = false;
					if (result.type === 'failure') {
						error = (result.data?.message as string | undefined) ?? 'Something went wrong';
						return;
					}
					await update({ reset: false });
					if (result.type === 'success') open = false;
				};
			}}
		>
			{#if error}
				<Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
			{/if}

			{#if category}
				<input type="hidden" name="id" value={category.id} />
				<Field
					label="Name"
					name="name"
					icon={Folder01Icon}
					value={category.name}
					placeholder="e.g. Civil Litigation"
					required
				/>
			{:else}
				<div class="grid gap-2">
					<Label for="category-draft">Names</Label>
					<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
					<div
						class="flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1.5 transition-shadow focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50"
						onclick={() => input?.focus()}
					>
						{#each names as name, i (name)}
							<span
								class="flex items-center gap-1 rounded-md bg-accent py-1 pr-1 pl-2.5 text-sm font-medium text-accent-foreground"
							>
								{name}
								<button
									type="button"
									aria-label="Remove {name}"
									class="flex size-5 items-center justify-center rounded text-accent-foreground/70 hover:bg-background/70 hover:text-accent-foreground"
									onclick={() => names.splice(i, 1)}
								>
									<Icon icon={Cancel01Icon} size={13} strokeWidth={2.25} />
								</button>
							</span>
						{/each}
						<input
							id="category-draft"
							bind:this={input}
							bind:value={draft}
							onkeydown={onKeydown}
							onpaste={onPaste}
							onblur={commitDraft}
							maxlength={100}
							autocomplete="off"
							placeholder={names.length ? 'Add another…' : 'e.g. Civil Litigation'}
							class="min-w-32 flex-1 bg-transparent px-1 py-0.5 text-sm outline-none placeholder:text-muted-foreground"
						/>
					</div>
					{#if hint}
						<p class="text-sm text-destructive">{hint}</p>
					{:else}
						<p class="text-xs text-muted-foreground">
							Press Enter or comma after each name. Backspace removes the last one.
						</p>
					{/if}
				</div>
			{/if}

			<div class="mt-1 grid grid-cols-2 gap-3">
				<Button type="button" variant="outline" size="lg" onclick={() => (open = false)}>
					Cancel
				</Button>
				<Button type="submit" size="lg" disabled={saving || (!category && pending === 0)}>
					{#if saving}
						Saving…
					{:else if category}
						Save changes
					{:else}
						{pending > 1 ? `Add ${pending} categories` : 'Add category'}
					{/if}
				</Button>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
