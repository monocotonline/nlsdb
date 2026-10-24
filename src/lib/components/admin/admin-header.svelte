<script lang="ts">
	import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
	import { page } from '$app/state';
	import AdminBrand from '#lib/components/admin/admin-brand.svelte';
	import AdminLogout from '#lib/components/admin/admin-logout.svelte';
	import Icon from '#lib/components/icon.svelte';
	import ThemeSwitcher from '#lib/components/theme-switcher.svelte';
	import { adminNav } from '#lib/admin-nav.js';

	const section = $derived(adminNav.find((item) => item.match(page.url.pathname))?.label ?? '');
</script>

<!-- Always visible: the content below scrolls, this does not. -->
<header class="z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-background px-4 md:px-8">
	<!-- Phones have no sidebar, so the brand lives here. -->
	<div class="md:hidden"><AdminBrand /></div>

	<nav aria-label="Breadcrumb" class="hidden items-center gap-2 text-sm md:flex">
		<a href="/admin" class="text-muted-foreground transition-colors hover:text-foreground">Admin</a>
		{#if section}
			<Icon icon={ArrowRight01Icon} size={14} class="text-muted-foreground" />
			<span class="font-medium">{section}</span>
		{/if}
	</nav>

	<div class="ml-auto flex items-center gap-1">
		<ThemeSwitcher size="sm" />
		<div class="md:hidden"><AdminLogout mode="icon" /></div>
	</div>
</header>
