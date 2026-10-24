<script lang="ts">
	import { BookOpen01Icon } from '@hugeicons/core-free-icons';
	import Icon from '#lib/components/icon.svelte';
</script>

<a href="/admin" class="flex items-center gap-2.5">
	<span
		class="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground"
	>
		<Icon icon={BookOpen01Icon} size={20} />
	</span>
	<span class="text-sm font-semibold">NLS Admin</span>
</a>
