<script lang="ts">
	import type { IconSvgElement } from '@hugeicons/svelte';
	import { ViewIcon, ViewOffSlashIcon } from '@hugeicons/core-free-icons';
	import Icon from '#lib/components/icon.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Label } from '#lib/components/ui/label/index.js';

	let {
		label,
		name,
		type = 'text',
		value = $bindable(''),
		error,
		hint,
		icon,
		prefix,
		autocomplete,
		placeholder,
		required = false,
		minlength,
		min,
		step
	}: {
		label: string;
		name: string;
		type?: 'text' | 'email' | 'password' | 'tel' | 'number';
		value?: string | number;
		error?: string;
		hint?: string;
		icon?: IconSvgElement;
		prefix?: string;
		autocomplete?:
			| 'off'
			| 'name'
			| 'email'
			| 'tel'
			| 'street-address'
			| 'address-level1'
			| 'address-level2'
			| 'current-password'
			| 'new-password';
		placeholder?: string;
		required?: boolean;
		minlength?: number;
		min?: number;
		step?: number;
	} = $props();

	// Password fields get a show/hide toggle.
	let revealed = $state(false);
	const isPassword = $derived(type === 'password');
</script>

<div class="grid gap-2">
	<Label for={name}>{label}</Label>
	<div class="relative">
		{#if prefix}
			<span
				class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground"
				>{prefix}</span
			>
		{/if}
		{#if icon}
			<Icon
				{icon}
				size={18}
				class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
			/>
		{/if}
		<Input
			class={[icon ? 'pl-10' : prefix ? 'pl-8' : '', isPassword && 'pr-11']}
			id={name}
			{name}
			type={isPassword && revealed ? 'text' : type}
			{autocomplete}
			{placeholder}
			{required}
			{minlength}
			{min}
			{step}
			bind:value
			aria-invalid={error ? true : undefined}
		/>
		{#if isPassword}
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				class="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
				aria-label={revealed ? 'Hide password' : 'Show password'}
				aria-pressed={revealed}
				onclick={() => (revealed = !revealed)}
			>
				<Icon icon={revealed ? ViewOffSlashIcon : ViewIcon} size={18} />
			</Button>
		{/if}
	</div>
	{#if error}
		<p class="text-sm text-destructive">{error}</p>
	{:else if hint}
		<p class="text-sm text-muted-foreground">{hint}</p>
	{/if}
</div>
