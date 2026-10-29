<script lang="ts">
	import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons';
	import AdminBrand from '#lib/components/admin/admin-brand.svelte';
	import AdminLogout from '#lib/components/admin/admin-logout.svelte';
	import AdminSidebarNav from '#lib/components/admin/admin-sidebar-nav.svelte';
	import AdminUser from '#lib/components/admin/admin-user.svelte';
	import Icon from '#lib/components/icon.svelte';

	let { name, email }: { name: string; email: string } = $props();
</script>

<!-- Desktop sidebar. The page shell is exactly viewport height, so this never scrolls with the
     page; only its own middle section scrolls if there are ever more links than fit. -->
<aside class="hidden w-64 shrink-0 flex-col border-r bg-background md:flex">
	<div class="flex h-16 shrink-0 items-center border-b px-5">
		<AdminBrand />
	</div>

	<div class="min-h-0 flex-1 overflow-y-auto overscroll-contain">
		<AdminSidebarNav />
	</div>

	<div class="shrink-0 space-y-3 border-t p-3">
		<a
			href="/"
			target="_blank"
			rel="noopener"
			class="flex items-center justify-between px-3 py-2 text-xs tracking-[0.1em] text-muted-foreground uppercase transition-colors hover:text-foreground"
		>
			View shop
			<Icon icon={ArrowUpRight01Icon} size={16} />
		</a>
		<AdminUser {name} {email} />
		<AdminLogout />
	</div>
</aside>
