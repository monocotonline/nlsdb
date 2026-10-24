<script lang="ts">
	let { name, email }: { name: string; email: string } = $props();

	const initials = $derived(
		name
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase())
			.join('')
	);
</script>

<div class="flex items-center gap-3 px-1">
	<span
		class="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground"
	>
		{initials}
	</span>
	<div class="min-w-0">
		<p class="truncate text-sm font-medium">{name}</p>
		<p class="truncate text-xs text-muted-foreground">{email}</p>
	</div>
</div>
