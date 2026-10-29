<script lang="ts">
	import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
	import { page } from '$app/state';
	import SidebarProducts from '#lib/components/admin/admin-sidebar-products.svelte';
	import NavBadge from '#lib/components/admin/nav-badge.svelte';
	import Icon from '#lib/components/icon.svelte';
	import { cn } from '#lib/utils.js';
	import { adminNav } from '#lib/admin-nav.js';

	let productsOpen = $state(true);
</script>

<nav aria-label="Admin sections" class="flex flex-col gap-1 p-3">
	{#each adminNav as item (item.href)}
		{@const active = item.match(page.url.pathname)}
		<div class="relative">
			<a
				href={item.href}
				aria-current={active ? 'page' : undefined}
				class={cn(
					'flex items-center gap-3 px-3 py-2.5 text-xs tracking-[0.1em] uppercase transition-colors',
					item.submenu && 'pr-11',
					active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
				)}
			>
				<Icon icon={item.icon} size={18} strokeWidth={active ? 1.9 : 1.5} />
				<span class="flex-1">
					<span class={cn('border-b border-transparent pb-0.5', active && 'border-foreground')}>
						{item.label}
					</span>
				</span>
				{#if item.badge}<NavBadge count={page.data.badges?.[item.badge] ?? 0} />{/if}
			</a>
			{#if item.submenu === 'products' && active}
				<button
					type="button"
					onclick={() => (productsOpen = !productsOpen)}
					aria-expanded={productsOpen}
					aria-label={productsOpen ? 'Hide product filters' : 'Show product filters'}
					class="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/10"
				>
					<Icon
						icon={ArrowDown01Icon}
						size={16}
						class={cn('transition-transform', productsOpen && 'rotate-180')}
					/>
				</button>
			{/if}
		</div>
		{#if item.submenu === 'products' && active && productsOpen}<SidebarProducts />{/if}
	{/each}
</nav>
