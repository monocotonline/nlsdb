<script lang="ts">
	import { catalogueHref } from '#lib/catalogue.js';
	import { formatNaira } from '#lib/format.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const query = $derived(data.query);
	const shown = $derived(data.products.slice(0, 12));
	const href = (changes: Parameters<typeof catalogueHref>[1]) => catalogueHref(query, changes);
	const sorts = [
		['newest', 'Newest'],
		['price-asc', 'Price: low to high'],
		['price-desc', 'Price: high to low'],
		['title', 'Name: A to Z']
	] as const;
</script>

<svelte:head><title>C · Quiet · NLS Bookshop</title></svelte:head>

<div class="c">
	<header class="top">
		<nav class="side">
			<a href="/design/c" aria-current="page">Shop</a>
			<a href="/support">Support</a>
		</nav>
		<a href="/design/c" class="mark">NLS Bookshop</a>
		<nav class="side end">
			<a href="/account">Account</a>
			<a href="/cart">Bag{data.cartCount ? ` · ${data.cartCount}` : ''}</a>
		</nav>
	</header>

	<main class="wrap">
		<section class="intro">
			<h1>Books and essentials<br />for the Nigerian Law School.</h1>
			<p>Carefully chosen, delivered to your door.</p>
		</section>

		<section class="filters" aria-label="Filter products">
			<ul class="pills">
				<li><a href={href({ category: '' })} class:on={!query.category}>All</a></li>
				{#each data.categories.filter((c) => c.count > 0) as c (c.slug)}
					<li>
						<a href={href({ category: c.slug })} class:on={query.category === c.slug}>{c.name}</a>
					</li>
				{/each}
			</ul>
			<div class="tools">
				<form action="/design/c" method="GET" role="search">
					<input
						name="q"
						value={query.q}
						placeholder="Search products"
						aria-label="Search products"
					/>
					{#if query.category}<input type="hidden" name="category" value={query.category} />{/if}
				</form>
				<p class="sorts">
					{#each sorts as [value, label] (value)}
						<a href={href({ sort: value })} class:on={query.sort === value}>{label}</a>
					{/each}
				</p>
			</div>
		</section>

		{#if shown.length === 0}
			<p class="empty">Nothing matches your search. <a href="/design/c">Clear filters</a></p>
		{:else}
			<ul class="grid">
				{#each shown as p (p.id)}
					<li>
						<a href="/products/{p.id}" class="card">
							<figure class="tone">
								{#if p.images[0]}
									<img src={p.images[0].thumb} alt="" loading="lazy" />
								{:else}
									<span class="ph">{p.title}</span>
								{/if}
							</figure>
							<div class="meta">
								<div class="line">
									<h3>{p.title}</h3>
									<span class="price">{formatNaira(p.price)}</span>
								</div>
								<p class="sub">
									{[p.author, p.category?.name].filter(Boolean).join(' · ')}
								</p>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</main>

	<footer class="foot">
		<span>© Nigerian Law School</span>
		<span>Physical items, delivered to your address.</span>
	</footer>
</div>

<style>
	.c {
		--bg: #f6f5f2;
		--surface: #ffffff;
		--tone: #efede8;
		--ink: #1a1917;
		--muted: #7a766e;
		--line: #e6e3dc;
		min-height: 100vh;
		background: var(--bg);
		color: var(--ink);
		font-family: 'Inter Variable', system-ui, sans-serif;
		padding-bottom: 96px;
	}
	:global(.dark) .c {
		--bg: #121211;
		--surface: #1a1a18;
		--tone: #222220;
		--ink: #f0eee9;
		--muted: #928e85;
		--line: #2b2a27;
	}
	a {
		color: inherit;
		text-decoration: none;
	}

	.top {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		height: 72px;
		padding: 0 clamp(20px, 4vw, 48px);
	}
	.mark {
		font-size: 15px;
		font-weight: 600;
		letter-spacing: -0.02em;
	}
	.side {
		display: flex;
		gap: clamp(14px, 2.4vw, 28px);
		font-size: 14px;
	}
	.side.end {
		justify-content: flex-end;
	}
	.side a {
		color: var(--muted);
	}
	.side a[aria-current] {
		color: var(--ink);
	}

	.wrap {
		max-width: 1240px;
		margin: 0 auto;
		padding: 0 clamp(20px, 4vw, 48px);
	}
	.intro {
		text-align: center;
		padding: clamp(48px, 9vw, 112px) 0 clamp(36px, 5vw, 56px);
	}
	h1 {
		margin: 0 auto;
		font-size: clamp(2rem, 4.8vw, 3.6rem);
		font-weight: 500;
		line-height: 1.08;
		letter-spacing: -0.04em;
		text-wrap: balance;
	}
	.intro p {
		margin: 20px 0 0;
		font-size: 1.0625rem;
		color: var(--muted);
	}

	.filters {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 22px;
		margin-bottom: clamp(32px, 4vw, 52px);
	}
	.pills {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.pills a {
		display: block;
		padding: 9px 16px;
		border: 1px solid var(--line);
		border-radius: 999px;
		font-size: 13.5px;
		color: var(--muted);
	}
	.pills a.on {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--bg);
	}
	.tools {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 14px 28px;
		font-size: 13.5px;
	}
	.tools input {
		width: 220px;
		padding: 9px 16px;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: 999px;
		color: var(--ink);
		font: inherit;
		outline: none;
	}
	.tools input:focus {
		border-color: var(--muted);
	}
	.tools input::placeholder {
		color: var(--muted);
	}
	.sorts {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 4px 18px;
		margin: 0;
	}
	.sorts a {
		color: var(--muted);
	}
	.sorts a.on {
		color: var(--ink);
		font-weight: 500;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: clamp(28px, 3.4vw, 44px) clamp(16px, 2.4vw, 28px);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.card {
		display: block;
	}
	.tone {
		margin: 0;
		height: clamp(300px, 30vw, 400px);
		display: grid;
		place-items: center;
		background: var(--tone);
		border-radius: 22px;
		padding: 40px;
		overflow: hidden;
	}
	.tone img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		/* Calm the colour so a shelf of covers reads as one collection. */
		filter: saturate(0.3) contrast(0.98);
		border-radius: 3px;
		box-shadow: 0 18px 30px -18px rgb(0 0 0 / 0.4);
	}
	.ph {
		max-width: 16ch;
		font-size: 1.1rem;
		font-weight: 500;
		line-height: 1.25;
		letter-spacing: -0.02em;
		text-align: center;
		color: var(--muted);
		text-wrap: balance;
	}
	.meta {
		padding: 16px 6px 0;
	}
	.line {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
	}
	h3 {
		margin: 0;
		font-size: 15px;
		font-weight: 500;
		line-height: 1.35;
		letter-spacing: -0.015em;
		text-wrap: balance;
	}
	.price {
		flex: none;
		font-size: 15px;
		font-variant-numeric: tabular-nums;
	}
	.sub {
		margin: 4px 0 0;
		font-size: 13.5px;
		color: var(--muted);
	}
	.card:hover h3 {
		text-decoration: underline;
		text-underline-offset: 4px;
		text-decoration-thickness: 1px;
	}
	.empty {
		padding: 72px 0;
		text-align: center;
		color: var(--muted);
	}
	.foot {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 8px;
		max-width: 1240px;
		margin: clamp(64px, 9vw, 120px) auto 0;
		padding: 24px clamp(20px, 4vw, 48px) 0;
		border-top: 1px solid var(--line);
		font-size: 13px;
		color: var(--muted);
	}

	@media (max-width: 960px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (max-width: 560px) {
		.top {
			height: 60px;
		}
		.side {
			font-size: 13px;
			gap: 12px;
		}
		.tone {
			height: 240px;
			padding: 24px;
			border-radius: 18px;
		}
		.pills {
			flex-wrap: nowrap;
			justify-content: flex-start;
			overflow-x: auto;
			width: calc(100% + 40px);
			margin-inline: -20px;
			padding-inline: 20px;
			scrollbar-width: none;
		}
		.pills a {
			white-space: nowrap;
		}
		.tools input {
			width: 100%;
		}
		.tools,
		.tools form {
			width: 100%;
		}
	}
</style>
