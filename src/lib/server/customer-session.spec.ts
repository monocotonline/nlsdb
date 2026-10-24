import { describe, expect, it } from 'vitest';
import { safeRedirect } from './customer-session.js';

describe('safeRedirect', () => {
	it('allows same-site relative paths', () => {
		expect(safeRedirect('/checkout')).toBe('/checkout');
		expect(safeRedirect('/account?x=1')).toBe('/account?x=1');
	});

	it('rejects absolute and protocol-relative URLs', () => {
		expect(safeRedirect('https://evil.com')).toBe('/account');
		expect(safeRedirect('//evil.com')).toBe('/account');
		expect(safeRedirect('/\\evil.com')).toBe('/account');
	});

	it('falls back when missing', () => {
		expect(safeRedirect(null)).toBe('/account');
		expect(safeRedirect('', '/')).toBe('/');
	});
});
