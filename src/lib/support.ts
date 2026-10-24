/** Shared (browser and server) rules for support messages. */

export const LIMITS = { name: 120, subject: 150, order: 64, message: 5000, minMessage: 5 } as const;

export type TicketInput = {
	name: string;
	email: string;
	subject: string;
	orderReference: string;
	message: string;
};

export type TicketErrors = Partial<Record<keyof TicketInput, string>>;

const clean = (value: unknown) => String(value ?? '').trim();

export function readTicketInput(form: FormData): TicketInput {
	return {
		name: clean(form.get('name')),
		email: clean(form.get('email')),
		subject: clean(form.get('subject')),
		orderReference: clean(form.get('orderReference')).toUpperCase(),
		message: clean(form.get('message'))
	};
}

export function validateTicket(input: TicketInput): TicketErrors {
	const errors: TicketErrors = {};
	if (!input.name) errors.name = 'Enter your name';
	else if (input.name.length > LIMITS.name) errors.name = 'That name is too long';
	if (!input.email) errors.email = 'Enter your email';
	else if (!/^\S+@\S+\.\S+$/.test(input.email)) errors.email = 'Enter a valid email';
	if (input.subject.length > LIMITS.subject) errors.subject = 'Keep the subject shorter';
	if (input.orderReference.length > LIMITS.order)
		errors.orderReference = 'That reference is too long';
	errors.message = validateMessage(input.message);
	if (!errors.message) delete errors.message;
	return errors;
}

/** For replies as well as the first message. Returns an error message, or undefined if fine. */
export function validateMessage(body: string): string | undefined {
	const text = body.trim();
	if (text.length < LIMITS.minMessage) return 'Write a little more so we can help';
	if (text.length > LIMITS.message) return `Keep it under ${LIMITS.message} characters`;
	return undefined;
}
