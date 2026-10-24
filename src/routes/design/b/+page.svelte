<script lang="ts">
	import { catalogueHref } from '#lib/catalogue.js';
	import { formatNaira } from '#lib/format.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const query = $derived(data.query);
	const shown = $derived(data.products.slice(0, 12));
	const categories = $derived(data.categories.filter((c) => c.count > 0));
	const href = (changes: Parameters<typeof catalogueHref>[1]) => catalogueHref(query, changes);
	const pad = (n: number) => String(n).padStart(3, '0');
	const sorts = [
		['newest', 'Newest'],
		['price-asc', 'Price ascending'],
		['price-desc', 'Price descending'],
		['title', 'Title A–Z']
	] as const;
</script>

<svelte:head><title>B · Index · NLS Bookshop</title></svelte:head>

<div class="b">
	<header class="top">
		<a href="/design/b" class="mark">NLS / Bookshop</a>
		<nav>
			<a href="/design/b" aria-current="page">Shop</a>
			<a href="/support">Support</a>
			<a href="/account">Account</a>
			<a href="/cart">Cart [{data.cartCount}]</a>
		</nav>
	</header>

	<section class="hero">
		<p class="mono">(01) Catalogue</p>
		<h1>Everything<br />for the Bar.</h1>
		<dl class="stats">
			<div>
				<dt class="mono">Items</dt>
				<dd>{data.allCount}</dd>
			</div>
			<div>
				<dt class="mono">Categories</dt>
				<dd>{categories.length}</dd>
			</div>
			<div>
				<dt class="mono">Showing</dt>
				<dd>{data.total}</dd>
			</div>
		</dl>
	</section>

	<div class="body">
		<aside class="filters" aria-label="Filter products">
			<form action="/design/b" method="GET" role="search" class="search">
				<input name="q" value={query.q} placeholder="SEARCH" aria-label="Search products" />
				{#if query.category}<input type="hidden" name="category" value={query.category} />{/if}
			</form>

			<h2 class="mono">Category</h2>
			<ul>
				<li>
					<a href={href({ category: '' })} class:on={!query.category}>
						<span>All</span><span class="mono n">{data.allCount}</span>
					</a>
				</li>
				{#each categories as c (c.slug)}
					<li>
						<a href={href({ category: c.slug })} class:on={query.category === c.slug}>
							<span>{c.name}</span><span class="mono n">{c.count}</span>
						</a>
					</li>
				{/each}
			</ul>

			<h2 class="mono">Sort</h2>
			<ul>
				{#each sorts as [value, label] (value)}
					<li>
						<a href={href({ sort: value })} class:on={query.sort === value}>
							<span>{label}</span>
						</a>
					</li>
				{/each}
			</ul>
		</aside>

		{#if shown.length === 0}
			<p class="empty mono">No results. <a href="/design/b">Reset</a></p>
		{:else}
			<ul class="grid">
				{#each shown as p, i (p.id)}
					<li>
						<a href="/products/{p.id}" class="cell">
							<span class="idx mono">{pad(i + 1)}</span>
							<figure>
								{#if p.images[0]}
									<img src={p.images[0].thumb} alt="" loading="lazy" />
								{:else}
									<span class="ph">{p.title}</span>
								{/if}
							</figure>
							<div class="info">
								<h3>{p.title}</h3>
								{#if p.author}<p class="mono by">{p.author}</p>{/if}
							</div>
							<div class="row">
								<span class="mono price">{formatNaira(p.price)}</span>
								<span class="mono arrow">→</span>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<footer class="foot mono">
		<span>© Nigerian Law School</span>
		<span>Physical items, delivered to your address</span>
	</footer>
</div>

<style>
	.b {
		--bg: #ffffff;
		--ink: #0a0a0a;
		--muted: #707070;
		--line: #dcdcdc;
		--accent: #0b6b3a;
		min-height: 100vh;
		background: var(--bg);
		color: var(--ink);
		font-family: 'Inter Variable', system-ui, sans-serif;
		padding-bottom: 96px;
	}
	:global(.dark) .b {
		--bg: #0b0b0b;
		--ink: #f2f2f2;
		--muted: #8a8a8a;
		--line: #2a2a2a;
		--accent: #55d68f;
	}
	a {
		color: inherit;
		text-decoration: none;
	}
	.mono {
		font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
		font-size: 11px;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 56px;
		padding: 0 clamp(16px, 3vw, 40px);
		border-bottom: 1px solid var(--line);
	}
	.mark {
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.top nav {
		display: flex;
		gap: clamp(14px, 2.5vw, 30px);
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 11px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.top nav a {
		color: var(--muted);
	}
	.top nav a[aria-current] {
		color: var(--ink);
	}

	.hero {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: end;
		gap: 24px 48px;
		padding: clamp(40px, 7vw, 96px) clamp(16px, 3vw, 40px) clamp(28px, 4vw, 48px);
		border-bottom: 1px solid var(--line);
	}
	.hero .mono {
		grid-column: 1 / -1;
		margin: 0;
		color: var(--muted);
	}
	h1 {
		margin: 0;
		font-weight: 600;
		font-size: clamp(2.6rem, 7.4vw, 6.4rem);
		line-height: 0.95;
		letter-spacing: -0.05em;
	}
	.stats {
		display: flex;
		gap: 32px;
		margin: 0;
	}
	.stats div {
		min-width: 64px;
	}
	.stats dt {
		color: var(--muted);
		margin-bottom: 4px;
	}
	.stats dd {
		margin: 0;
		font-size: 1.6rem;
		font-weight: 500;
		letter-spacing: -0.03em;
		font-variant-numeric: tabular-nums;
	}

	.body {
		display: grid;
		grid-template-columns: 248px minmax(0, 1fr);
		align-items: start;
	}
	.filters {
		position: sticky;
		top: 0;
		padding: 24px clamp(16px, 3vw, 40px) 40px;
		border-right: 1px solid var(--line);
		min-height: 60vh;
	}
	.search input {
		width: 100%;
		background: transparent;
		border: 0;
		border-bottom: 1px solid var(--ink);
		padding: 8px 0;
		color: var(--ink);
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 11px;
		letter-spacing: 0.06em;
		outline: none;
	}
	.search input::placeholder {
		color: var(--muted);
	}
	h2 {
		margin: 32px 0 10px;
		color: var(--muted);
		font-weight: 400;
	}
	.filters ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.filters li a {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		padding: 8px 0;
		font-size: 14px;
		color: var(--muted);
		border-bottom: 1px solid var(--line);
	}
	.filters li a.on {
		color: var(--ink);
		font-weight: 500;
	}
	.filters li a.on::before {
		content: '';
		width: 6px;
		height: 6px;
		margin: auto 10px auto 0;
		background: var(--accent);
		flex: none;
	}
	.filters li a.on span:first-child {
		flex: 1;
	}
	.n {
		font-variant-numeric: tabular-nums;
		color: var(--muted);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1px;
		margin: 0;
		padding: 0;
		list-style: none;
		/* The gap shows this colour, drawing the hairline grid. */
		background: var(--line);
		border-bottom: 1px solid var(--line);
	}
	.grid li {
		background: var(--bg);
	}
	.cell {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 14px 16px 0;
	}
	.idx {
		position: absolute;
		top: 14px;
		left: 16px;
		color: var(--muted);
	}
	figure {
		margin: 0;
		aspect-ratio: 3 / 4;
		display: grid;
		place-items: center;
		padding: 14% 16%;
	}
	figure img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		filter: grayscale(1) contrast(1.12);
	}
	.ph {
		font-weight: 600;
		font-size: 1.05rem;
		letter-spacing: -0.02em;
		line-height: 1.15;
		color: var(--muted);
		text-align: left;
		align-self: end;
	}
	.info {
		padding: 4px 0 16px;
	}
	h3 {
		margin: 0;
		font-size: 15px;
		font-weight: 500;
		line-height: 1.3;
		letter-spacing: -0.015em;
		text-wrap: balance;
	}
	.by {
		margin: 6px 0 0;
		color: var(--muted);
	}
	.row {
		margin-top: auto;
		display: flex;
		justify-content: space-between;
		padding: 12px 0;
		border-top: 1px solid var(--line);
	}
	.price {
		font-variant-numeric: tabular-nums;
	}
	.arrow {
		color: var(--muted);
	}
	.cell:hover .arrow {
		color: var(--accent);
	}
	.cell:hover h3 {
		text-decoration: underline;
		text-underline-offset: 4px;
		text-decoration-thickness: 1px;
	}
	.empty {
		padding: 64px clamp(16px, 3vw, 40px);
		color: var(--muted);
	}
	.foot {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 8px;
		padding: 20px clamp(16px, 3vw, 40px) 0;
		border-top: 1px solid var(--line);
		color: var(--muted);
	}

	@media (max-width: 1100px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (max-width: 820px) {
		.hero {
			grid-template-columns: 1fr;
		}
		.body {
			grid-template-columns: 1fr;
		}
		.filters {
			position: static;
			min-height: 0;
			border-right: 0;
			border-bottom: 1px solid var(--line);
			padding-bottom: 8px;
		}
		.filters ul {
			display: flex;
			gap: 20px;
			overflow-x: auto;
			scrollbar-width: none;
		}
		.filters li a {
			white-space: nowrap;
			border: 0;
			padding: 6px 0;
		}
		.filters li a.on::before {
			display: none;
		}
		.filters li a.on {
			border-bottom: 1px solid var(--ink);
		}
		h2 {
			margin-top: 20px;
		}
	}
	@media (max-width: 480px) {
		.cell {
			padding-inline: 12px;
		}
		.idx {
			left: 12px;
		}
	}
</style>
