<script lang="ts">
	import { page } from '$app/state';
	import ErrorView from '#lib/components/error-view.svelte';
</script>

<ErrorView
	status={page.status}
	message={page.error?.message}
	path={page.url.pathname}
	homeHref="/admin"
	homeLabel="Back to admin"
/>
