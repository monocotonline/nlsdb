import { describe, expect, it } from 'vitest';
import { createRateLimiter } from './rate-limit.js';

describe('createRateLimiter', () => {
	it('allows up to the limit, then blocks', () => {
		const limiter = createRateLimiter({ max: 3, windowMs: 1000 });
		expect([1, 2, 3, 4].map(() => limiter.allow('ip', 0))).toEqual([true, true, true, false]);
	});

	it('tracks each key separately', () => {
		const limiter = createRateLimiter({ max: 1, windowMs: 1000 });
		expect(limiter.allow('a', 0)).toBe(true);
		expect(limiter.allow('b', 0)).toBe(true);
		expect(limiter.allow('a', 0)).toBe(false);
	});

	it('allows again once the window has passed', () => {
		const limiter = createRateLimiter({ max: 1, windowMs: 1000 });
		expect(limiter.allow('ip', 0)).toBe(true);
		expect(limiter.allow('ip', 999)).toBe(false);
		expect(limiter.allow('ip', 1000)).toBe(true);
	});

	it('does not count blocked attempts against the person later', () => {
		const limiter = createRateLimiter({ max: 1, windowMs: 1000 });
		limiter.allow('ip', 0);
		for (let t = 100; t < 900; t += 100) limiter.allow('ip', t);
		expect(limiter.allow('ip', 1000)).toBe(true);
	});
});
