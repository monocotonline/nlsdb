/**
 * The kinds of thing the shop sells. A type is required on every product. Categories (subjects
 * such as Civil Litigation) only apply to the types marked `hasCategories`.
 *
 * To add a type later: add it here and to the `type` field's values in a PocketBase migration.
 */
export const PRODUCT_TYPES = [
	{ value: 'book', label: 'Book', plural: 'Books', hasCategories: true },
	{ value: 'apparel', label: 'Apparel', plural: 'Apparel', hasCategories: false },
	{ value: 'paraphernalia', label: 'Paraphernalia', plural: 'Paraphernalia', hasCategories: false }
] as const;

export type ProductType = (typeof PRODUCT_TYPES)[number]['value'];

export const isProductType = (value: unknown): value is ProductType =>
	PRODUCT_TYPES.some((t) => t.value === value);

/** Records from before types existed have none, and those were all books. */
export const toProductType = (value: unknown): ProductType =>
	isProductType(value) ? value : 'book';

export const typeInfo = (type: ProductType) => PRODUCT_TYPES.find((t) => t.value === type)!;

/** Whether the category field makes sense for this type. */
export const usesCategories = (type: ProductType) => typeInfo(type).hasCategories;
