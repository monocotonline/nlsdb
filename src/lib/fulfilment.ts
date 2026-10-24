/** Where the goods are, once an order is paid. Payment status is separate (see Order.status). */
export const FULFILMENT_STEPS = ['processing', 'shipped', 'delivered'] as const;

export type Fulfilment = (typeof FULFILMENT_STEPS)[number];

export const FULFILMENT_LABELS: Record<Fulfilment, string> = {
	processing: 'Processing',
	shipped: 'Shipped',
	delivered: 'Delivered'
};

/** Orders from before this existed have no value, and a new paid order starts as processing. */
export const toFulfilment = (value: unknown): Fulfilment =>
	FULFILMENT_STEPS.includes(value as Fulfilment) ? (value as Fulfilment) : 'processing';

/** How many steps are complete, for a progress display (processing counts as the first step). */
export const fulfilmentProgress = (value: Fulfilment) => FULFILMENT_STEPS.indexOf(value) + 1;
