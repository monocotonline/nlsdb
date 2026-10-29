<script lang="ts">
	import '@fontsource-variable/inter/index.css';
	import '@fontsource/source-serif-4/400.css';
	import '@fontsource/source-serif-4/400-italic.css';
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
