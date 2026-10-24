<script lang="ts">
	import {
		Cancel01Icon,
		Link01Icon,
		MoreHorizontalIcon,
		Tick02Icon
	} from '@hugeicons/core-free-icons';
	import { tick } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { enhance, type SubmitFunction } from '$app/forms';
	import { page } from '$app/state';
	import Icon from '#lib/components/icon.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Menu from '#lib/components/ui/dropdown-menu/index.js';
	import { FULFILMENT_LABELS, FULFILMENT_STEPS, type Fulfilment } from '#lib/fulfilment.js';
	import type { Order } from '#lib/types.js';

	let { order }: { order: Order } = $props();

	// Every action ends with a plain-language message, whether it worked or not.
	const reply =
		(done: () => string): SubmitFunction =>
		() =>
		async ({ result, update }) => {
			if (result.type === 'success') toast.success(done());
			else if (result.type === 'failure') {
				toast.error((result.data?.message as string | undefined) ?? 'Something went wrong.');
			} else toast.error('Something went wrong. Please try again.');
			await update({ reset: false });
		};
	const deliveryDone = () =>
		`Done. Order ${order.reference} is now marked as ${FULFILMENT_LABELS[next].toLowerCase()}.`;
	const cancelDone = () => `Done. Order ${order.reference} has been cancelled.`;

	let deliveryForm = $state<HTMLFormElement>();
	let cancelForm = $state<HTMLFormElement>();
	let next = $state<Fulfilment>('processing');
	let copied = $state(false);

	// Only paid orders have goods to deliver, and only unpaid ones can still be chased or cancelled.
	const hasActions = $derived(order.status === 'success' || order.status === 'pending');

	async function setDelivery(step: Fulfilment) {
		next = step;
		await tick();
		deliveryForm?.requestSubmit();
	}

	// Opens a fresh payment for this order, so the customer can finish what they started.
	async function copyLink() {
		try {
			await navigator.clipboard.writeText(`${page.url.origin}/pay/resume/${order.id}`);
			copied = true;
			setTimeout(() => (copied = false), 2000);
			toast.success('Payment link copied. Paste it into a message to the customer.');
		} catch {
			toast.error('Could not copy the link. Please try again.');
		}
	}

	function askCancel() {
		if (confirm(`Cancel order ${order.reference}? The customer will not be able to pay it.`)) {
			cancelForm?.requestSubmit();
		}
	}
</script>

{#if hasActions}
	<form
		bind:this={deliveryForm}
		method="POST"
		action="?/fulfilment"
		use:enhance={reply(deliveryDone)}
		class="hidden"
	>
		<input type="hidden" name="id" value={order.id} />
		<input type="hidden" name="fulfilment" value={next} />
	</form>
	<form
		bind:this={cancelForm}
		method="POST"
		action="?/cancel"
		use:enhance={reply(cancelDone)}
		class="hidden"
	>
		<input type="hidden" name="id" value={order.id} />
	</form>

	<Menu.Root>
		<Menu.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="ghost"
					size="icon-sm"
					aria-label="Actions for order {order.reference}"
				>
					<Icon icon={MoreHorizontalIcon} />
				</Button>
			{/snippet}
		</Menu.Trigger>
		<Menu.Content align="end">
			{#if order.status === 'success'}
				<Menu.Label>Delivery status</Menu.Label>
				{#each FULFILMENT_STEPS as step (step)}
					<Menu.Item onSelect={() => setDelivery(step)} disabled={order.fulfilment === step}>
						<span class="flex size-4 items-center justify-center">
							{#if order.fulfilment === step}<Icon icon={Tick02Icon} size={16} />{/if}
						</span>
						Mark as {FULFILMENT_LABELS[step].toLowerCase()}
					</Menu.Item>
				{/each}
			{:else}
				<Menu.Item closeOnSelect={false} onSelect={copyLink}>
					<Icon icon={copied ? Tick02Icon : Link01Icon} />
					{copied ? 'Link copied' : 'Copy payment link'}
				</Menu.Item>
				<Menu.Separator />
				<Menu.Item variant="destructive" onSelect={askCancel}>
					<Icon icon={Cancel01Icon} /> Cancel order
				</Menu.Item>
			{/if}
		</Menu.Content>
	</Menu.Root>
{/if}
