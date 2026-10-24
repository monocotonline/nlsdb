<script lang="ts">
	import { auth } from '#lib/auth.svelte.js';
	import { cn } from '#lib/utils.js';

	const tabs = [
		['login', 'Log in'],
		['register', 'Create account']
	] as const;
</script>

<div class="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1" role="tablist">
	{#each tabs as [mode, label] (mode)}
		<button
			type="button"
			role="tab"
			aria-selected={auth.mode === mode}
			onclick={() => (auth.mode = mode)}
			class={cn(
				'rounded-md py-2 text-sm font-medium transition-all',
				auth.mode === mode
					? 'bg-background text-foreground shadow-sm'
					: 'text-muted-foreground hover:text-foreground'
			)}
		>
			{label}
		</button>
	{/each}
</div>
