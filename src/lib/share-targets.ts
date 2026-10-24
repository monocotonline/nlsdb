import {
	Facebook01Icon,
	Mail01Icon,
	NewTwitterIcon,
	TelegramIcon,
	WhatsappIcon
} from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/svelte';

export type ShareContent = {
	url: string;
	/** Short headline, e.g. the book title. */
	title: string;
	/** One line of context that goes with the link. */
	text: string;
};

export type ShareTarget = {
	id: string;
	label: string;
	icon: IconSvgElement;
	/** Brand colours for the icon tile. */
	tone: string;
	href: (content: ShareContent) => string;
};

const enc = encodeURIComponent;

/** Where a link can be shared to. "Copy link" is separate because it isn't a URL. */
export const shareTargets: ShareTarget[] = [
	{
		id: 'whatsapp',
		label: 'WhatsApp',
		icon: WhatsappIcon,
		tone: 'bg-[#25D366]/10 text-[#128C7E] dark:bg-[#25D366]/15 dark:text-[#25D366]',
		href: ({ url, text }) => `https://wa.me/?text=${enc(`${text} ${url}`)}`
	},
	{
		id: 'telegram',
		label: 'Telegram',
		icon: TelegramIcon,
		tone: 'bg-[#229ED9]/10 text-[#1b87b9] dark:bg-[#229ED9]/15 dark:text-[#4cc0f0]',
		href: ({ url, text }) => `https://t.me/share/url?url=${enc(url)}&text=${enc(text)}`
	},
	{
		id: 'x',
		label: 'X',
		icon: NewTwitterIcon,
		tone: 'bg-foreground/10 text-foreground',
		href: ({ url, text }) => `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`
	},
	{
		id: 'facebook',
		label: 'Facebook',
		icon: Facebook01Icon,
		tone: 'bg-[#1877F2]/10 text-[#1877F2] dark:bg-[#1877F2]/20 dark:text-[#6aa5ff]',
		href: ({ url }) => `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`
	},
	{
		id: 'email',
		label: 'Email',
		icon: Mail01Icon,
		tone: 'bg-accent text-accent-foreground',
		href: ({ url, title, text }) => `mailto:?subject=${enc(title)}&body=${enc(`${text}\n\n${url}`)}`
	}
];
