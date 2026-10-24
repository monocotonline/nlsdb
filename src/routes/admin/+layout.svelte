<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import AdminBottomNav from '#lib/components/admin/admin-bottom-nav.svelte';
	import AdminHeader from '#lib/components/admin/admin-header.svelte';
	import AdminSidebar from '#lib/components/admin/admin-sidebar.svelte';
	import { Toaster } from '#lib/components/ui/sonner/index.js';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	// <main> scrolls instead of the window, so the browser's usual scroll-to-top on navigation
	// has to be done here.
	let scroller = $state<HTMLElement>();
	afterNavigate(() => scroller?.scrollTo({ top: 0 }));
</script>

<svelte:head>
	<title>Admin · NLS Bookshop</title>
	{#if data.admin}
		<!-- The admin is an app shell, so stop the page itself bouncing or pulling on touch screens. -->
		<style>
			html,
			body {
				overscroll-behavior: none;
			}
		</style>
	{/if}
</svelte:head>

<!-- Feedback for actions anywhere in the admin (see order-actions.svelte). -->
<Toaster />

{#if data.admin}
	<!--
		App shell: exactly one screen tall. The sidebar and header are fixed in place and only
		<main> scrolls, so nothing shakes or follows you down the page.
	-->
	<div class="flex h-dvh overflow-hidden bg-muted/40">
		<AdminSidebar name={data.admin.name} email={data.admin.email} />

		<div class="flex min-w-0 flex-1 flex-col">
			<AdminHeader />
			<main bind:this={scroller} class="min-h-0 flex-1 overflow-y-auto overscroll-contain">
				<!-- Bottom padding on phones keeps content clear of the fixed bottom bar. -->
				<div
					class="mx-auto max-w-6xl px-4 py-6 pb-[calc(6rem+env(safe-area-inset-bottom))] md:px-8 md:py-8 md:pb-8"
				>
					{@render children()}
				</div>
			</main>
		</div>

		<AdminBottomNav />
	</div>
{:else}
	<div class="min-h-screen bg-muted/40">
		{@render children()}
	</div>
{/if}
