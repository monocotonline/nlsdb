import { describe, expect, it } from 'vitest';
import {
	FULFILMENT_LABELS,
	FULFILMENT_STEPS,
	fulfilmentProgress,
	toFulfilment
} from './fulfilment.js';

describe('toFulfilment', () => {
	it('keeps valid values', () => {
		for (const step of FULFILMENT_STEPS) expect(toFulfilment(step)).toBe(step);
	});

	it('treats missing or unknown values (older orders) as processing', () => {
		expect(toFulfilment('')).toBe('processing');
		expect(toFulfilment(undefined)).toBe('processing');
		expect(toFulfilment('lost')).toBe('processing');
	});
});

describe('fulfilmentProgress', () => {
	it('counts the completed steps', () => {
		expect(fulfilmentProgress('processing')).toBe(1);
		expect(fulfilmentProgress('shipped')).toBe(2);
		expect(fulfilmentProgress('delivered')).toBe(3);
	});
});

describe('FULFILMENT_LABELS', () => {
	it('has a label for every step', () => {
		for (const step of FULFILMENT_STEPS) expect(FULFILMENT_LABELS[step]).toBeTruthy();
	});
});
