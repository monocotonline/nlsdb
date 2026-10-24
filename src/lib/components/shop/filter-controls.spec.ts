import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import FilterOptionList from './filter-option-list.svelte';
import FilterSegmented from './filter-segmented.svelte';

const noop = () => {};
const rows = (html: string) =>
	[...html.matchAll(/<button[^>]*role="radio"[^>]*>[\s\S]*?<\/button>/g)].map((m) => m[0]);

describe('FilterOptionList', () => {
	const options = [
		{ value: '', label: 'All categories', count: 107 },
		{ value: 'clothing', label: 'Clothing', count: 3 },
		{ value: 'books', label: 'Books', count: 100 }
	];

	it('renders one row per option, in order, with counts', () => {
		const { body } = render(FilterOptionList, {
			props: { options, value: '', label: 'Category', onselect: noop }
		});
		const found = rows(body);
		expect(found).toHaveLength(3);
		expect(found[0]).toContain('All categories');
		expect(found[1]).toContain('Clothing');
		expect(found[2]).toContain('Books');
		expect(found[0]).toContain('107');
		expect(found[1]).toContain('>3<');
	});

	it('marks exactly the chosen row as selected and ticks only that one', () => {
		const { body } = render(FilterOptionList, {
			props: { options, value: 'clothing', label: 'Category', onselect: noop }
		});
		const found = rows(body);
		const checked = found.filter((row) => row.includes('aria-checked="true"'));
		expect(checked).toHaveLength(1);
		expect(checked[0]).toContain('Clothing');
		expect(found.filter((row) => row.includes('<svg'))).toHaveLength(1);
	});

	it('is exposed as a labelled radio group', () => {
		const { body } = render(FilterOptionList, {
			props: { options, value: '', label: 'Sort by', onselect: noop }
		});
		expect(body).toContain('role="radiogroup"');
		expect(body).toContain('aria-label="Sort by"');
	});

	it('shows no count when options have none', () => {
		const { body } = render(FilterOptionList, {
			props: {
				options: [{ value: 'a', label: 'Newest' }],
				value: 'a',
				label: 'Sort',
				onselect: noop
			}
		});
		expect(body).not.toContain('tabular-nums');
	});
});

describe('FilterSegmented', () => {
	it('shows each option once and selects the matching one', () => {
		const { body } = render(FilterSegmented, {
			props: {
				options: [
					{ value: 'grid', label: 'Grid' },
					{ value: 'list', label: 'List' }
				],
				value: 'list',
				label: 'View',
				onselect: noop
			}
		});
		const found = rows(body);
		expect(found).toHaveLength(2);
		expect(found[1]).toContain('aria-checked="true"');
		expect(found[0]).toContain('aria-checked="false"');
	});
});
