import { dev } from '$app/env';
import { PAYSTACK_SECRET_KEY } from '$app/env/private';

export type PaymentStatus = 'success' | 'failed' | 'pending';

export interface PaymentGateway {
	name: string;
	initialize(args: {
		reference: string;
		/** Naira, whole units. */
		amount: number;
		email: string;
		callbackUrl: string;
	}): Promise<{ redirectUrl: string }>;
	verify(reference: string): Promise<{ status: PaymentStatus; amount: number }>;
}

const paystack = (secret: string): PaymentGateway => {
	const call = async (path: string, init?: RequestInit) => {
		const res = await fetch(`https://api.paystack.co${path}`, {
			...init,
			headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' }
		});
		const body = await res.json();
		if (!res.ok || !body.status) throw new Error(body.message ?? 'Paystack request failed');
		return body.data;
	};

	return {
		name: 'paystack',
		async initialize({ reference, amount, email, callbackUrl }) {
			const data = await call('/transaction/initialize', {
				method: 'POST',
				body: JSON.stringify({
					email,
					reference,
					amount: amount * 100, // kobo
					callback_url: callbackUrl
				})
			});
			return { redirectUrl: data.authorization_url };
		},
		async verify(reference) {
			const data = await call(`/transaction/verify/${encodeURIComponent(reference)}`);
			const status: PaymentStatus =
				data.status === 'success'
					? 'success'
					: data.status === 'failed' || data.status === 'reversed'
						? 'failed'
						: 'pending';
			return { status, amount: data.amount / 100 };
		}
	};
};

/** Dev-only gateway: redirects to /pay/mock where you pick the outcome. */
export const mockOutcomes = new Map<string, { status: PaymentStatus; amount: number }>();

const mock: PaymentGateway = {
	name: 'mock',
	async initialize({ reference, amount }) {
		mockOutcomes.set(reference, { status: 'pending', amount });
		return { redirectUrl: `/pay/mock?reference=${encodeURIComponent(reference)}` };
	},
	async verify(reference) {
		return mockOutcomes.get(reference) ?? { status: 'pending', amount: 0 };
	}
};

export function getGateway(): PaymentGateway {
	if (PAYSTACK_SECRET_KEY) return paystack(PAYSTACK_SECRET_KEY);
	if (dev) return mock;
	throw new Error('PAYSTACK_SECRET_KEY is not set');
}
