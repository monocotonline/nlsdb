<script lang="ts">
	import type { IconSvgElement } from '@hugeicons/svelte';
	import { cn } from '#lib/utils.js';

	let {
		icon,
		size = 18,
		strokeWidth = 1.75,
		class: className
	}: {
		icon: IconSvgElement;
		size?: number;
		strokeWidth?: number;
		class?: string;
	} = $props();

	// The icon library only fills in its shapes after the page's JavaScript has loaded, which
	// leaves blank space (and on a slow connection, a long wait). The icon data is just a list of
	// SVG shapes, so draw them directly; they are then part of the server-rendered HTML.
	const kebab = (name: string) => name.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

	const shapes = $derived(
		icon.map(([tag, attrs]) => {
			const out: Record<string, string | number> = {};
			for (const [name, value] of Object.entries(attrs)) {
				if (name !== 'key') out[kebab(name)] = value as string | number;
			}
			if ('stroke' in out) out['stroke-width'] = strokeWidth;
			return { tag, attrs: out };
		})
	);
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	width={size}
	height={size}
	fill="none"
	class={cn('shrink-0', className)}
	aria-hidden="true"
	focusable="false"
>
	{#each shapes as shape, i (i)}
		<svelte:element this={shape.tag} {...shape.attrs} />
	{/each}
</svg>
