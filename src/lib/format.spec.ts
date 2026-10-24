import { describe, expect, it } from 'vitest';
import { formatDate, formatNaira } from './format.js';

describe('formatNaira', () => {
	it('formats whole naira amounts with the ₦ symbol and grouping', () => {
		expect(formatNaira(12500)).toBe('₦12,500');
	});

	it('formats zero', () => {
		expect(formatNaira(0)).toBe('₦0');
	});
});

describe('formatDate', () => {
	it('returns a dash for an empty value', () => {
		expect(formatDate('')).toBe('—');
	});

	it('parses PocketBase style timestamps', () => {
		expect(formatDate('2026-10-17 16:23:59.822Z')).toContain('2026');
	});
});
