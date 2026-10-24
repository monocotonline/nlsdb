import sanitizeHtml from 'sanitize-html';

const ALLOWED = {
	allowedTags: [
		'p',
		'br',
		'strong',
		'em',
		'u',
		's',
		'h2',
		'h3',
		'ul',
		'ol',
		'li',
		'blockquote',
		'a',
		'hr'
	],
	allowedAttributes: { a: ['href', 'target', 'rel'] },
	allowedSchemes: ['http', 'https', 'mailto'],
	transformTags: {
		a: sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer nofollow' })
	}
};

const escapeHtml = (text: string) =>
	text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Only real markup counts, so plain text such as "a < b" is not mistaken for HTML.
const looksLikeHtml = (text: string) =>
	/<\/?(p|br|strong|em|b|i|u|s|h[1-6]|ul|ol|li|blockquote|a|hr|div|span)\b[^>]*>/i.test(text);

/** Cleans editor HTML before it is stored. Returns '' for an empty document. */
export function sanitizeDescription(html: string): string {
	const clean = sanitizeHtml(html, ALLOWED).trim();
	return stripTags(clean).trim() ? clean : '';
}

/** Safe HTML for display. Old plain-text descriptions become paragraphs. */
export function descriptionToHtml(stored: string): string {
	if (!stored) return '';
	if (looksLikeHtml(stored)) return sanitizeHtml(stored, ALLOWED);
	return stored
		.split(/\n{2,}/)
		.map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`)
		.join('');
}

/** Plain text for snippets such as card previews. */
export function stripTags(html: string): string {
	const spaced = html.replace(/<\/(p|h[1-6]|li|blockquote|div)>|<br\s*\/?>/gi, ' ');
	return sanitizeHtml(spaced, { allowedTags: [], allowedAttributes: {} })
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/\s+/g, ' ')
		.trim();
}
