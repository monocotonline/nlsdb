<script lang="ts">
	import { Add01Icon, LockPasswordIcon } from '@hugeicons/core-free-icons';
	import Avatar from '#lib/components/avatar.svelte';
	import Icon from '#lib/components/icon.svelte';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import AdminDialog from './admin-dialog.svelte';
	import ResetPasswordDialog from './reset-password-dialog.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// A new key each time the dialog opens, so it always starts with a fresh form.
	let dialog = $state({ open: false, key: 0 });
	function openDialog() {
		dialog.key++;
		dialog.open = true;
	}

	// Same idea for the reset-password dialog: fresh each time it opens.
	let reset = $state<{ open: boolean; admin: { id: string; name: string } | null; key: number }>({
		open: false,
		admin: null,
		key: 0
	});
	function openReset(admin: { id: string; name: string }) {
		reset.admin = admin;
		reset.key++;
		reset.open = true;
	}
</script>

<div class="mb-6 flex items-center justify-between gap-4">
	<div>
		<h1 class="display text-3xl sm:text-4xl">Admins</h1>
		<p class="text-sm text-muted-foreground">
			{data.admins.length}
			{data.admins.length === 1 ? 'person has' : 'people have'} access to this area.
		</p>
	</div>
	<Button onclick={openDialog}><Icon icon={Add01Icon} /> Register admin</Button>
</div>

<Card.Root
	class="rounded-none border-y bg-transparent py-0 ring-0 [&_th]:text-[11px] [&_th]:font-medium [&_th]:tracking-[0.14em] [&_th]:text-muted-foreground [&_th]:uppercase"
>
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="pl-6">Admin</Table.Head>
				<Table.Head class="max-sm:hidden">Email</Table.Head>
				<Table.Head class="text-right">Status</Table.Head>
				<Table.Head class="w-14 pr-6"></Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.admins as admin (admin.id)}
				<Table.Row>
					<Table.Cell class="pl-6">
						<div class="flex items-center gap-3">
							<Avatar name={admin.name} />
							<div class="min-w-0">
								<p class="font-medium">{admin.name}</p>
								<!-- On phones the email moves under the name instead of its own column. -->
								<p class="truncate text-sm text-muted-foreground sm:hidden">{admin.email}</p>
							</div>
						</div>
					</Table.Cell>
					<Table.Cell class="text-muted-foreground max-sm:hidden">{admin.email}</Table.Cell>
					<Table.Cell class="text-right">
						{#if admin.id === data.admin?.id}
							<Badge variant="secondary" class="bg-success/10 text-success">You</Badge>
						{:else}
							<Badge variant="secondary">Admin</Badge>
						{/if}
					</Table.Cell>
					<Table.Cell class="pr-6">
						<div class="flex justify-end">
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label="Reset password for {admin.name}"
								title="Reset password"
								class="text-muted-foreground hover:text-foreground"
								onclick={() => openReset(admin)}
							>
								<Icon icon={LockPasswordIcon} />
							</Button>
						</div>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</Card.Root>

{#key dialog.key}
	<AdminDialog bind:open={dialog.open} />
{/key}

{#key reset.key}
	<ResetPasswordDialog bind:open={reset.open} admin={reset.admin} />
{/key}
