<script lang="ts">
	import '@fontsource-variable/inter/index.css';
	import '@fontsource/source-serif-4/400.css';
	import '@fontsource/source-serif-4/400-italic.css';
	import './layout.css';
	import { page } from '$app/state';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	// The server sets this for the first page load; this keeps it right when navigating.
	$effect(() => {
		const admin = page.url.pathname === '/admin' || page.url.pathname.startsWith('/admin/');
		document.documentElement.classList.toggle('editorial', !admin);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
