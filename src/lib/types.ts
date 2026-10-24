import type { Fulfilment } from './fulfilment.js';
import type { ProductType } from './product-types.js';

export type BookImage = {
	/** Stored filename; also the stable id of the image. */
	name: string;
	url: string;
	thumb: string;
};

export type Category = { id: string; name: string; slug: string };

export type Book = {
	id: string;
	title: string;
	author: string;
	/** The kind of product. Categories only apply to books. */
	type: ProductType;
	/** Safe HTML for display (also the editor's starting content). */
	description: string;
	/** Plain-text version for snippets. */
	descriptionText: string;
	category: Category | null;
	price: number;
	/** Thumbnail of the first image, or null when the book has no images. */
	coverUrl: string | null;
	images: BookImage[];
};

export type Customer = {
	id: string;
	email: string;
	name: string;
	phone: string;
	address: string;
	city: string;
	state: string;
};

export type OrderStatus = 'pending' | 'success' | 'failed' | 'cancelled';

export type OrderItem = {
	id: string;
	title: string;
	author: string;
	unitPrice: number;
	quantity: number;
};

export type Order = {
	id: string;
	reference: string;
	customerName: string;
	email: string;
	phone: string;
	address: string;
	city: string;
	state: string;
	total: number;
	status: OrderStatus;
	gateway: string;
	paidAt: string;
	/** What has happened to the goods; only meaningful once the order is paid. */
	fulfilment: Fulfilment;
	created: string;
	items: OrderItem[];
};

export type TicketStatus = 'open' | 'resolved';

export type Ticket = {
	id: string;
	/** The private link key; whoever has it can read and reply to the conversation. */
	token: string;
	name: string;
	email: string;
	subject: string;
	orderReference: string;
	status: TicketStatus;
	/** Whose turn it is to reply. */
	awaiting: 'admin' | 'customer';
	created: string;
	updated: string;
};

export type TicketMessage = {
	id: string;
	sender: 'customer' | 'admin';
	authorName: string;
	body: string;
	created: string;
};
