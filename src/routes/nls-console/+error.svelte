<script lang="ts">
	import { ADMIN_PATH } from '#lib/admin-path.js';
	import { page } from '$app/state';
	import ErrorView from '#lib/components/error-view.svelte';
</script>

<ErrorView
	status={page.status}
	message={page.error?.message}
	path={page.url.pathname}
	homeHref={ADMIN_PATH}
	homeLabel="Back to admin"
/>
