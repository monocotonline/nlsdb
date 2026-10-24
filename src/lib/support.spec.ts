import { describe, expect, it } from 'vitest';
import { LIMITS, readTicketInput, validateMessage, validateTicket } from './support.js';

const valid = {
	name: 'Ada Obi',
	email: 'ada@example.com',
	subject: 'Late delivery',
	orderReference: 'NLS-ABC',
	message: 'My order has not arrived yet.'
};

describe('validateTicket', () => {
	it('accepts a complete message', () => {
		expect(validateTicket(valid)).toEqual({});
	});

	it('only needs a name, email and message', () => {
		expect(validateTicket({ ...valid, subject: '', orderReference: '' })).toEqual({});
	});

	it('flags each missing or bad field', () => {
		const errors = validateTicket({ ...valid, name: '', email: 'nope', message: 'hi' });
		expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name']);
	});

	it('enforces length limits', () => {
		expect(validateTicket({ ...valid, name: 'x'.repeat(LIMITS.name + 1) }).name).toBeDefined();
		expect(
			validateTicket({ ...valid, subject: 'x'.repeat(LIMITS.subject + 1) }).subject
		).toBeDefined();
		expect(
			validateTicket({ ...valid, message: 'x'.repeat(LIMITS.message + 1) }).message
		).toBeDefined();
	});
});

describe('validateMessage', () => {
	it('rejects empty and tiny messages, accepts normal ones', () => {
		expect(validateMessage('   ')).toBeDefined();
		expect(validateMessage('ok')).toBeDefined();
		expect(validateMessage('Thanks, that works.')).toBeUndefined();
	});
});

describe('readTicketInput', () => {
	it('trims values and upper-cases the order reference', () => {
		const form = new FormData();
		form.set('name', '  Ada  ');
		form.set('orderReference', ' nls-abc ');
		const input = readTicketInput(form);
		expect(input.name).toBe('Ada');
		expect(input.orderReference).toBe('NLS-ABC');
		expect(input.message).toBe('');
	});
});
