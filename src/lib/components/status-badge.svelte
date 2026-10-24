<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
	import type { OrderStatus } from '#lib/types.js';

	let { status }: { status: OrderStatus } = $props();

	const styles: Record<OrderStatus, string> = {
		success: 'bg-success/10 text-success',
		pending: 'bg-warning/20 text-amber-800 dark:text-amber-300',
		failed: 'bg-destructive/10 text-destructive',
		cancelled: 'bg-muted text-muted-foreground'
	};
	const labels: Record<OrderStatus, string> = {
		success: 'Paid',
		pending: 'Pending',
		failed: 'Failed',
		cancelled: 'Cancelled'
	};
</script>

<Badge variant="secondary" class={styles[status]}>{labels[status]}</Badge>
