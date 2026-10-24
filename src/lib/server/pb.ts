import PocketBase, { type RecordModel } from 'pocketbase';
import { PB_URL as PB_URL_ENV, PB_SUPERUSER_EMAIL, PB_SUPERUSER_PASSWORD } from '$app/env/private';
import { toFulfilment } from '#lib/fulfilment.js';
import { toProductType } from '#lib/product-types.js';
import { descriptionToHtml, stripTags } from './description';
import type { Book, Customer, Order, OrderItem } from '#lib/types.js';

export const PB_URL = PB_URL_ENV;

export function createPb() {
	const pb = new PocketBase(PB_URL);
	pb.autoCancellation(false);
	return pb;
}

let superuser: PocketBase | null = null;

/** Privileged client, used only for writing orders on behalf of anonymous customers. */
export async function getSuperuserPb() {
	if (!PB_SUPERUSER_EMAIL || !PB_SUPERUSER_PASSWORD) {
		throw new Error('PB_SUPERUSER_EMAIL and PB_SUPERUSER_PASSWORD must be set in .env');
	}
	superuser ??= createPb();
	if (!superuser.authStore.isValid) {
		await superuser
			.collection('_superusers')
			.authWithPassword(PB_SUPERUSER_EMAIL, PB_SUPERUSER_PASSWORD);
	}
	return superuser;
}

export function toBook(pb: PocketBase, r: RecordModel): Book {
	// Images are served through the app (see routes/media) rather than straight from PocketBase,
	// so they load wherever the site is opened: phone, tunnel or production.
	const images = ((r.images as string[] | undefined) ?? []).map((name) => ({
		name,
		url: `/media/${r.id}/${encodeURIComponent(name)}`,
		thumb: `/media/${r.id}/${encodeURIComponent(name)}?thumb=400x0`
	}));
	return {
		id: r.id,
		title: r.title,
		author: r.author,
		type: toProductType(r.type),
		description: descriptionToHtml(r.description ?? ''),
		descriptionText: stripTags(r.description ?? ''),
		category: r.expand?.category
			? { id: r.expand.category.id, name: r.expand.category.name, slug: r.expand.category.slug }
			: null,
		price: r.price,
		coverUrl: images[0]?.thumb ?? null,
		images
	};
}

export function toCustomer(r: RecordModel): Customer {
	return {
		id: r.id,
		email: r.email,
		name: r.name,
		phone: r.phone ?? '',
		address: r.address ?? '',
		city: r.city ?? '',
		state: r.state ?? ''
	};
}

export function toOrder(r: RecordModel, items: RecordModel[] = []): Order {
	return {
		id: r.id,
		reference: r.reference,
		customerName: r.customerName,
		email: r.email,
		phone: r.phone,
		address: r.address,
		city: r.city,
		state: r.state,
		total: r.total,
		status: r.status,
		gateway: r.gateway,
		paidAt: r.paidAt,
		fulfilment: toFulfilment(r.fulfilment),
		created: r.created,
		items: items.map((i): OrderItem => ({
			id: i.id,
			title: i.title,
			author: i.author,
			unitPrice: i.unitPrice,
			quantity: i.quantity
		}))
	};
}
