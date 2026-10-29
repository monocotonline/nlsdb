import { ADMIN_PATH } from '#lib/admin-path.js';
import {
	BookOpen01Icon,
	CreditCardIcon,
	CustomerSupportIcon,
	Folder01Icon,
	ShieldUserIcon
} from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/svelte';

export type AdminNavItem = {
	href: string;
	label: string;
	icon: IconSvgElement;
	/** Shows a count on the item, taken from the layout's `badges` data. */
	badge?: 'support';
	/** Items that expand into a list of links in the desktop sidebar. */
	submenu?: 'products';
	/** Whether this item is the current section for the given pathname. */
	match: (pathname: string) => boolean;
};

/** The admin sections. Shared by the desktop header and the mobile bottom bar. */
export const adminNav: AdminNavItem[] = [
	{
		href: ADMIN_PATH,
		label: 'Products',
		icon: BookOpen01Icon,
		submenu: 'products',
		match: (p) => p === ADMIN_PATH || p.startsWith(`${ADMIN_PATH}/books`)
	},
	{
		href: `${ADMIN_PATH}/categories`,
		label: 'Categories',
		icon: Folder01Icon,
		match: (p) => p.startsWith(`${ADMIN_PATH}/categories`)
	},
	{
		href: `${ADMIN_PATH}/transactions`,
		label: 'Transactions',
		icon: CreditCardIcon,
		match: (p) => p.startsWith(`${ADMIN_PATH}/transactions`)
	},
	{
		href: `${ADMIN_PATH}/support`,
		label: 'Support',
		icon: CustomerSupportIcon,
		badge: 'support',
		match: (p) => p.startsWith(`${ADMIN_PATH}/support`)
	},
	{
		href: `${ADMIN_PATH}/admins`,
		label: 'Admins',
		icon: ShieldUserIcon,
		match: (p) => p.startsWith(`${ADMIN_PATH}/admins`)
	}
];
