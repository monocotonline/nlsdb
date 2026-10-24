<script lang="ts">
	/** Page title, description and the Open Graph / Twitter tags that make shared links look good. */
	let {
		title,
		description,
		url,
		image,
		type = 'website',
		price
	}: {
		title: string;
		description: string;
		url: string;
		/** Absolute URL; social apps cannot load relative image paths. */
		image?: string | null;
		type?: 'website' | 'product';
		/** Naira, whole units. Adds product price tags when set. */
		price?: number;
	} = $props();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />

	<meta property="og:site_name" content="NLS Bookshop" />
	<meta property="og:type" content={type === 'product' ? 'product' : 'website'} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	{#if image}<meta property="og:image" content={image} />{/if}
	{#if price !== undefined}
		<meta property="product:price:amount" content={String(price)} />
		<meta property="product:price:currency" content="NGN" />
	{/if}

	<meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if image}<meta name="twitter:image" content={image} />{/if}
</svelte:head>
