<script lang="ts">
	import PageHeader from '#lib/components/page-header.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<PageHeader
	eyebrow="Development only"
	title="Mock payment"
	description="Stands in for the payment gateway until Paystack is set up. Choose how this payment ends."
/>

<div class="max-w-md">
	<p class="mb-3 eyebrow">Reference</p>
	<p class="mb-8 font-mono text-sm">{data.reference}</p>
	<form method="POST" class="flex flex-wrap gap-3">
		<input type="hidden" name="reference" value={data.reference} />
		<Button name="outcome" value="success" size="lg" class="h-12 px-8">Simulate success</Button>
		<Button name="outcome" value="failed" variant="outline" size="lg" class="h-12 px-8">
			Simulate failure
		</Button>
	</form>
</div>
