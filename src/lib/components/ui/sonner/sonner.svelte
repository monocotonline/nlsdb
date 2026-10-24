<script lang="ts">
	import { Toaster as Sonner, type ToasterProps } from 'svelte-sonner';

	let { ...restProps }: ToasterProps = $props();
</script>

<!--
	Large, high-contrast and slow to leave: messages stay for 8 seconds and have a close button, so
	nobody has to rush to read them. Colours come from the site's own tokens, so they follow
	light and dark mode.
-->
<Sonner
	position="top-center"
	duration={8000}
	closeButton
	visibleToasts={3}
	style="--width: min(30rem, calc(100vw - 2rem)); --normal-bg: var(--popover); --normal-text: var(--popover-foreground); --normal-border: var(--border); --success-bg: var(--popover); --success-text: var(--popover-foreground); --success-border: var(--success); --error-bg: var(--popover); --error-text: var(--popover-foreground); --error-border: var(--destructive);"
	{...restProps}
/>

<style>
	:global([data-sonner-toast]) {
		padding: 1.1rem 1.25rem !important;
		font-size: 1.05rem !important;
		line-height: 1.4 !important;
		border-width: 2px !important;
		gap: 0.85rem !important;
	}
	:global([data-sonner-toast] [data-icon]) {
		width: 1.6rem !important;
		height: 1.6rem !important;
	}
	:global([data-sonner-toast] [data-icon] svg) {
		width: 1.6rem !important;
		height: 1.6rem !important;
	}
	:global([data-sonner-toast][data-type='success'] [data-icon]) {
		color: var(--success);
	}
	:global([data-sonner-toast][data-type='error'] [data-icon]) {
		color: var(--destructive);
	}
</style>
