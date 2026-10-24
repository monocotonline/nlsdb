<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '#lib/utils.js';

	let {
		title = 'Summary',
		children,
		class: className
	}: { title?: string; children: Snippet; class?: string } = $props();
</script>

<!-- The order summary column on the cart and checkout pages. Stays in view beside long lists. -->
<aside class={cn('border bg-card p-7 sm:p-8 lg:sticky lg:top-28', className)}>
	<h2 class="mb-6 eyebrow">{title}</h2>
	{@render children()}
</aside>
