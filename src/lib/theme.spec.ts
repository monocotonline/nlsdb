import { describe, expect, it } from 'vitest';
import { resolveTheme } from './theme.js';

describe('resolveTheme', () => {
	it('follows the device when the preference is system', () => {
		expect(resolveTheme('system', true)).toBe('dark');
		expect(resolveTheme('system', false)).toBe('light');
	});

	it('ignores the device when a theme was chosen explicitly', () => {
		expect(resolveTheme('light', true)).toBe('light');
		expect(resolveTheme('dark', false)).toBe('dark');
	});
});
