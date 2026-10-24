<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { cn, type WithoutChildrenOrChild } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 4,
		portalProps,
		...restProps
	}: DropdownMenuPrimitive.ContentProps & {
		portalProps?: WithoutChildrenOrChild<DropdownMenuPrimitive.PortalProps>;
	} = $props();
</script>

<DropdownMenuPrimitive.Portal {...portalProps}>
	<DropdownMenuPrimitive.Content
		bind:ref
		{sideOffset}
		data-slot="dropdown-menu-content"
		class={cn(
			'z-50 min-w-48 origin-(--bits-dropdown-menu-content-transform-origin) overflow-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
			className
		)}
		{...restProps}
	/>
</DropdownMenuPrimitive.Portal>
