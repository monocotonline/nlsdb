<script lang="ts">
	import { page } from '$app/state';
	import NavBadge from '#lib/components/admin/nav-badge.svelte';
	import Icon from '#lib/components/icon.svelte';
	import { cn } from '#lib/utils.js';
	import { adminNav } from '#lib/admin-nav.js';
</script>

<!-- Phones only. Fixed to the bottom and padded for the iPhone home indicator. -->
<nav
	aria-label="Admin sections"
	class="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
>
	<ul class="grid" style="grid-template-columns: repeat({adminNav.length}, minmax(0, 1fr))">
		{#each adminNav as item (item.href)}
			{@const active = item.match(page.url.pathname)}
			<li>
				<a
					href={item.href}
					aria-current={active ? 'page' : undefined}
					class={cn(
						'-mt-px flex flex-col items-center gap-1 border-t-2 px-1 pt-2 pb-2.5 text-[11px] tracking-[0.06em] uppercase transition-colors',
						active
							? 'border-foreground text-foreground'
							: 'border-transparent text-muted-foreground active:text-foreground'
					)}
				>
					<span class="relative flex h-8 w-14 items-center justify-center">
						<Icon icon={item.icon} size={22} strokeWidth={active ? 2 : 1.75} />
						{#if item.badge}
							<NavBadge
								count={page.data.badges?.[item.badge] ?? 0}
								class="absolute top-0 right-1.5 min-w-4 px-1 text-[10px] leading-4"
							/>
						{/if}
					</span>
					{item.label}
				</a>
			</li>
		{/each}
	</ul>
</nav>
