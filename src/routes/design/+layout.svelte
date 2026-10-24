<script lang="ts">
	import { page } from '$app/state';
	import ThemeSwitcher from '#lib/components/theme-switcher.svelte';

	let { children } = $props();

	const looks = [
		{ href: '/design/a', key: 'A', name: 'Editorial' },
		{ href: '/design/b', key: 'B', name: 'Index' },
		{ href: '/design/c', key: 'C', name: 'Quiet' }
	];
</script>

<svelte:head>
	<title>Design lab · NLS Bookshop</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{@render children()}

<!-- Switcher: keeps the same filters when jumping between looks. -->
<div class="lab-bar" role="navigation" aria-label="Design lab">
	{#each looks as look (look.href)}
		<a
			href="{look.href}{page.url.search}"
			class:active={page.url.pathname === look.href}
			aria-current={page.url.pathname === look.href ? 'page' : undefined}
		>
			<b>{look.key}</b>{look.name}
		</a>
	{/each}
	<span class="sep"></span>
	<ThemeSwitcher size="sm" />
	<span class="sep"></span>
	<a href="/" class="exit">Exit</a>
</div>

<style>
	.lab-bar {
		position: fixed;
		bottom: 16px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 100;
		display: flex;
		align-items: center;
		gap: 2px;
		padding: 5px;
		border-radius: 999px;
		background: #111;
		color: #eee;
		font:
			500 13px/1 Inter,
			system-ui,
			sans-serif;
		box-shadow: 0 8px 30px rgb(0 0 0 / 0.35);
		max-width: calc(100vw - 24px);
	}
	.lab-bar a {
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 9px 13px;
		border-radius: 999px;
		color: #aaa;
		text-decoration: none;
		white-space: nowrap;
	}
	.lab-bar a b {
		font-weight: 600;
		color: #fff;
	}
	.lab-bar a.active {
		background: #fff;
		color: #111;
	}
	.lab-bar a.active b {
		color: #111;
	}
	.lab-bar a.exit {
		padding-inline: 11px;
	}
	.sep {
		width: 1px;
		height: 18px;
		background: #333;
		margin: 0 6px;
	}
	@media (max-width: 520px) {
		.lab-bar a {
			padding: 9px 10px;
		}
		.lab-bar a :global(*) {
			font-size: 12px;
		}
	}
</style>
