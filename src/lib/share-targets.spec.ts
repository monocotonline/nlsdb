import { describe, expect, it } from 'vitest';
import { shareTargets, type ShareContent } from './share-targets.js';

const content: ShareContent = {
	url: 'https://shop.example/products/abc?x=1&y=2',
	title: 'Civil Litigation & Practice',
	text: 'Civil Litigation & Practice by A. Author · ₦9,500'
};
const link = (id: string) => shareTargets.find((t) => t.id === id)!.href(content);

describe('shareTargets', () => {
	it('encodes the link and text so special characters survive', () => {
		const whatsapp = link('whatsapp');
		expect(whatsapp.startsWith('https://wa.me/?text=')).toBe(true);
		expect(whatsapp).toContain(encodeURIComponent(content.url));
		expect(whatsapp).not.toContain(' ');
		expect(link('x')).toContain(`url=${encodeURIComponent(content.url)}`);
		expect(link('facebook')).toContain(`u=${encodeURIComponent(content.url)}`);
		expect(link('telegram')).toContain(`url=${encodeURIComponent(content.url)}`);
	});

	it('builds an email with a subject and the link in the body', () => {
		const mail = link('email');
		expect(mail.startsWith('mailto:?subject=')).toBe(true);
		expect(decodeURIComponent(mail)).toContain(content.url);
	});

	it('has a unique id and label for each target', () => {
		expect(new Set(shareTargets.map((t) => t.id)).size).toBe(shareTargets.length);
		expect(shareTargets.every((t) => t.label)).toBe(true);
	});
});
