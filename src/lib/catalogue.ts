/** The shop's filters live in the URL (?category=…&q=…&sort=…&page=…), so any view can be shared. */

import { isProductType, type ProductType } from './product-types.js';

export const PAGE_SIZE = 24;

/** URL value -> PocketBase sort expression. The first key is the default. */
export const SORTS = {
	newest: '-created',
	'price-asc': 'price',
	'price-desc': '-price',
	title: 'title'
} as const;

export type SortKey = keyof typeof SORTS;

export const SORT_LABELS: Record<SortKey, string> = {
	newest: 'Newest',
	'price-asc': 'Price: low to high',
	'price-desc': 'Price: high to low',
	title: 'Name: A to Z'
};

export type CatalogueQuery = {
	/** Category slug, or '' for all. */
	category: string;
	/** Product type, or '' for all. Used by the admin list. */
	type: ProductType | '';
	/** Search text. */
	q: string;
	sort: SortKey;
	page: number;
};

export const DEFAULT_QUERY: CatalogueQuery = {
	category: '',
	type: '',
	q: '',
	sort: 'newest',
	page: 1
};

const isSort = (value: string | null): value is SortKey =>
	value !== null && Object.hasOwn(SORTS, value);

/** Reads filters from a URL, ignoring anything invalid rather than failing. */
export function parseCatalogueQuery(params: URLSearchParams): CatalogueQuery {
	const sort = params.get('sort');
	const page = Number.parseInt(params.get('page') ?? '', 10);
	return {
		category: (params.get('category') ?? '').trim().toLowerCase().slice(0, 120),
		type: isProductType(params.get('type')) ? (params.get('type') as ProductType) : '',
		q: (params.get('q') ?? '').replace(/\s+/g, ' ').trim().slice(0, 100),
		sort: isSort(sort) ? sort : DEFAULT_QUERY.sort,
		page: Number.isFinite(page) && page > 1 ? Math.min(page, 10_000) : 1
	};
}

/**
 * Builds a `?…` query string for a filter state, leaving out defaults so shared links stay short.
 * Changing any filter other than the page sends you back to page 1.
 */
export function catalogueHref(
	current: CatalogueQuery,
	changes: Partial<CatalogueQuery> = {},
	hash = ''
): string {
	// Changing a filter starts again from page 1; changing only the page, or nothing, keeps it.
	const filterChanged = Object.keys(changes).some((key) => key !== 'page');
	const next: CatalogueQuery = {
		...current,
		...changes,
		page: 'page' in changes ? (changes.page ?? 1) : filterChanged ? 1 : current.page
	};
	const params = new URLSearchParams();
	if (next.category) params.set('category', next.category);
	if (next.type) params.set('type', next.type);
	if (next.q) params.set('q', next.q);
	if (next.sort !== DEFAULT_QUERY.sort) params.set('sort', next.sort);
	if (next.page > 1) params.set('page', String(next.page));
	const query = params.toString();
	return `${query ? `?${query}` : '?'}${hash}`;
}

export const hasFilters = (query: CatalogueQuery) =>
	Boolean(query.category || query.type || query.q || query.sort !== DEFAULT_QUERY.sort);
