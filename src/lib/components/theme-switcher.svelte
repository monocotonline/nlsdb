<script lang="ts">
	import { ComputerIcon, Moon02Icon, Sun03Icon } from '@hugeicons/core-free-icons';
	import { onMount } from 'svelte';
	import Icon from '#lib/components/icon.svelte';
	import {
		followSystemTheme,
		getPreference,
		setPreference,
		type ThemePreference
	} from '#lib/theme.js';
	import { cn } from '#lib/utils.js';

	let { size = 'md', class: className }: { size?: 'sm' | 'md'; class?: string } = $props();

	const options = [
		{ value: 'light', label: 'Light', icon: Sun03Icon },
		{ value: 'system', label: 'System', icon: ComputerIcon },
		{ value: 'dark', label: 'Dark', icon: Moon02Icon }
	] as const satisfies readonly { value: ThemePreference; label: string; icon: unknown }[];

	let preference = $state<ThemePreference>('system');
	let buttons = $state<HTMLButtonElement[]>([]);

	onMount(() => {
		preference = getPreference();
		return followSystemTheme();
	});

	function select(value: ThemePreference) {
		preference = value;
		setPreference(value);
	}

	// Arrow keys move between the three options, like any radio group.
	function onKeydown(event: KeyboardEvent) {
		const current = options.findIndex((o) => o.value === preference);
		const last = options.length - 1;
		const next =
			event.key === 'ArrowRight' || event.key === 'ArrowDown'
				? Math.min(current + 1, last)
				: event.key === 'ArrowLeft' || event.key === 'ArrowUp'
					? Math.max(current - 1, 0)
					: event.key === 'Home'
						? 0
						: event.key === 'End'
							? last
							: current;
		if (next === current) return;
		event.preventDefault();
		select(options[next].value);
		buttons[next]?.focus();
	}
</script>

<div
	class={cn(
		'theme-switch relative inline-flex items-center rounded-full border bg-muted/70 p-0.5',
		className
	)}
	role="radiogroup"
	aria-label="Theme"
	data-size={size}
	tabindex="-1"
	onkeydown={onKeydown}
>
	<!-- The sliding highlight. Its position comes from CSS, keyed on <html data-theme-pref>. -->
	<span
		class="theme-switch__thumb pointer-events-none absolute top-0.5 left-0.5 rounded-full bg-background shadow-sm ring-1 ring-foreground/10"
		aria-hidden="true"
	></span>

	{#each options as option, i (option.value)}
		<button
			bind:this={buttons[i]}
			type="button"
			role="radio"
			aria-checked={preference === option.value}
			aria-label={option.label}
			title={option.label}
			tabindex={preference === option.value ? 0 : -1}
			data-option={option.value}
			style="width: var(--cell); height: var(--cell);"
			class="theme-switch__option relative z-10 flex items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
			onclick={() => select(option.value)}
		>
			<Icon icon={option.icon} size={size === 'sm' ? 15 : 17} strokeWidth={1.9} />
		</button>
	{/each}
</div>
