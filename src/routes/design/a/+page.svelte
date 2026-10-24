<script lang="ts">
	import '@fontsource/source-serif-4/400.css';
	import '@fontsource/source-serif-4/400-italic.css';
	import { catalogueHref } from '#lib/catalogue.js';
	import { formatNaira } from '#lib/format.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const query = $derived(data.query);
	const shown = $derived(data.products.slice(0, 12));
	const href = (changes: Parameters<typeof catalogueHref>[1]) => catalogueHref(query, changes);
	const sorts = [
		['newest', 'Newest'],
		['price-asc', 'Price, low'],
		['price-desc', 'Price, high']
	] as const;
</script>

<svelte:head><title>A · Editorial · NLS Bookshop</title></svelte:head>

<div class="a">
	<div class="wrap">
		<header class="top">
			<a href="/design/a" class="mark">NLS Bookshop</a>
			<nav>
				<a href="/design/a" aria-current="page">Shop</a>
				<a href="/support">Support</a>
				<a href="/account">Account</a>
				<a href="/cart">Cart{data.cartCount ? ` (${data.cartCount})` : ''}</a>
			</nav>
		</header>

		<section class="intro">
			<p class="eyebrow">Nigerian Law School</p>
			<div class="intro-row">
				<h1>Books &amp; essentials<br />for the Bar.</h1>
				<p class="lede">
					Course texts, practice manuals and Law School apparel, delivered to your door. Order as a
					guest or with an account.
				</p>
			</div>
		</section>

		<section class="bar" aria-label="Filter products">
			<ul class="cats">
				<li>
					<a href={href({ category: '' })} class:on={!query.category}>All <i>{data.allCount}</i></a>
				</li>
				{#each data.categories.filter((c) => c.count > 0) as c (c.slug)}
					<li>
						<a href={href({ category: c.slug })} class:on={query.category === c.slug}>
							{c.name} <i>{c.count}</i>
						</a>
					</li>
				{/each}
			</ul>
			<div class="tools">
				<form action="/design/a" method="GET" role="search">
					<input name="q" value={query.q} placeholder="Search" aria-label="Search products" />
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
			<p class="empty">Nothing matches. <a href="/design/a">Clear filters</a></p>
		{:else}
			<ul class="grid">
				{#each shown as p (p.id)}
					<li>
						<a href="/products/{p.id}" class="card">
							<figure class="panel">
								{#if p.images[0]}
									<img src={p.images[0].thumb} alt="" loading="lazy" />
								{:else}
									<span class="ph">{p.title}</span>
								{/if}
							</figure>
							<div class="meta">
								{#if p.category}<p class="cat">{p.category.name}</p>{/if}
								<h3>{p.title}</h3>
								{#if p.author}<p class="by">{p.author}</p>{/if}
								<p class="price">{formatNaira(p.price)}</p>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		{/if}

		<footer class="foot">
			<span>© Nigerian Law School</span>
			<span>Physical items, delivered to your address.</span>
		</footer>
	</div>
</div>

<style>
	.a {
		--paper: #f6f3ec;
		--panel: #ece7dc;
		--ink: #161512;
		--muted: #77716a;
		--rule: #d8d2c5;
		min-height: 100vh;
		background: var(--paper);
		color: var(--ink);
		font-family: 'Inter Variable', system-ui, sans-serif;
		padding-bottom: 96px;
	}
	:global(.dark) .a {
		--paper: #0f0f0e;
		--panel: #181816;
		--ink: #ece8df;
		--muted: #8d887d;
		--rule: #2a2925;
	}
	a {
		color: inherit;
		text-decoration: none;
	}
	.wrap {
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 clamp(20px, 4vw, 56px);
	}

	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 76px;
		border-bottom: 1px solid var(--rule);
	}
	.mark {
		font-family: 'Source Serif 4', Georgia, serif;
		font-size: 22px;
		letter-spacing: -0.01em;
	}
	.top nav {
		display: flex;
		gap: clamp(16px, 3vw, 34px);
		font-size: 12px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	.top nav a {
		color: var(--muted);
		padding-bottom: 3px;
		border-bottom: 1px solid transparent;
	}
	.top nav a[aria-current] {
		color: var(--ink);
		border-color: var(--ink);
	}

	.intro {
		padding: clamp(56px, 10vw, 128px) 0 clamp(40px, 6vw, 80px);
	}
	.eyebrow {
		margin: 0 0 clamp(20px, 3vw, 36px);
		font-size: 12px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.intro-row {
		display: flex;
		flex-wrap: wrap;
		gap: 32px;
		align-items: flex-end;
		justify-content: space-between;
	}
	h1 {
		margin: 0;
		font-family: 'Source Serif 4', Georgia, serif;
		font-weight: 400;
		font-size: clamp(2.75rem, 7.2vw, 6rem);
		line-height: 1.02;
		letter-spacing: -0.035em;
	}
	.lede {
		margin: 0;
		max-width: 34ch;
		font-size: 1.0625rem;
		line-height: 1.65;
		color: var(--muted);
	}

	.bar {
		display: flex;
		flex-wrap: wrap;
		gap: 16px 40px;
		align-items: center;
		justify-content: space-between;
		padding: 18px 0;
		border-top: 1px solid var(--rule);
		border-bottom: 1px solid var(--rule);
	}
	.cats {
		display: flex;
		gap: 6px 28px;
		flex-wrap: wrap;
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 14px;
	}
	.cats a {
		color: var(--muted);
		padding-bottom: 3px;
		border-bottom: 1px solid transparent;
	}
	.cats a i {
		font-style: normal;
		font-size: 11px;
		margin-left: 2px;
		opacity: 0.7;
	}
	.cats a.on {
		color: var(--ink);
		border-color: var(--ink);
	}
	.tools {
		display: flex;
		align-items: center;
		gap: 28px;
		font-size: 13px;
	}
	.tools input {
		width: 150px;
		background: transparent;
		border: 0;
		border-bottom: 1px solid var(--rule);
		padding: 4px 0;
		color: var(--ink);
		font: inherit;
		outline: none;
	}
	.tools input:focus {
		border-color: var(--ink);
	}
	.tools input::placeholder {
		color: var(--muted);
	}
	.sorts {
		display: flex;
		gap: 16px;
		margin: 0;
	}
	.sorts a {
		color: var(--muted);
	}
	.sorts a.on {
		color: var(--ink);
		text-decoration: underline;
		text-underline-offset: 4px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: clamp(48px, 6vw, 80px) clamp(20px, 3vw, 40px);
		margin: clamp(40px, 6vw, 72px) 0 0;
		padding: 0;
		list-style: none;
	}
	.panel {
		margin: 0;
		aspect-ratio: 4 / 5;
		display: grid;
		place-items: center;
		background: var(--panel);
		padding: 11%;
		overflow: hidden;
	}
	.panel img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		/* One quiet tone for every cover, whatever colours it arrives in. */
		filter: grayscale(1) contrast(1.03);
		box-shadow: 0 22px 34px -22px rgb(0 0 0 / 0.5);
	}
	.ph {
		font-family: 'Source Serif 4', Georgia, serif;
		font-size: 1.35rem;
		line-height: 1.2;
		text-align: center;
		color: var(--muted);
		text-wrap: balance;
	}
	.meta {
		padding-top: 18px;
	}
	.cat {
		margin: 0 0 8px;
		font-size: 11px;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		color: var(--muted);
	}
	h3 {
		margin: 0;
		font-family: 'Source Serif 4', Georgia, serif;
		font-weight: 400;
		font-size: 1.3rem;
		line-height: 1.25;
		letter-spacing: -0.01em;
		text-wrap: balance;
	}
	.card:hover h3 {
		text-decoration: underline;
		text-underline-offset: 5px;
		text-decoration-thickness: 1px;
	}
	.by {
		margin: 6px 0 0;
		font-size: 14px;
		color: var(--muted);
	}
	.price {
		margin: 14px 0 0;
		font-size: 14px;
		font-variant-numeric: tabular-nums;
	}
	.empty {
		padding: 80px 0;
		color: var(--muted);
	}
	.foot {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 8px;
		margin-top: clamp(72px, 10vw, 140px);
		padding-top: 24px;
		border-top: 1px solid var(--rule);
		font-size: 13px;
		color: var(--muted);
	}

	@media (max-width: 900px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (max-width: 560px) {
		.top {
			height: 64px;
		}
		.top nav {
			gap: 14px;
			font-size: 11px;
		}
		.tools {
			width: 100%;
			justify-content: space-between;
		}
		.cats {
			flex-wrap: nowrap;
			overflow-x: auto;
			width: 100%;
			scrollbar-width: none;
		}
		.cats a {
			white-space: nowrap;
		}
	}
</style>
