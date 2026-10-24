<script lang="ts">
	import { page } from '$app/state';
	import ErrorView from '#lib/components/error-view.svelte';
</script>

<!-- Fallback for errors outside the shop and admin layouts, so it brings its own width and height. -->
<div class="shell flex min-h-screen items-center">
	<ErrorView status={page.status} message={page.error?.message} path={page.url.pathname} />
</div>
