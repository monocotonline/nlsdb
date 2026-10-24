import { describe, expect, it } from 'vitest';
import { descriptionToHtml, sanitizeDescription, stripTags } from './description.js';

describe('sanitizeDescription', () => {
	it('keeps formatting the editor produces', () => {
		const html =
			'<h2>Overview</h2><p>Some <strong>bold</strong> and <em>italic</em>.</p><ul><li>One</li></ul>';
		expect(sanitizeDescription(html)).toBe(html);
	});

	it('removes scripts, event handlers and unsafe links', () => {
		const dirty =
			'<p onclick="x()">Hi</p><script>alert(1)</script><a href="javascript:alert(1)">bad</a><img src=x onerror=alert(1)>';
		const clean = sanitizeDescription(dirty);
		expect(clean).not.toMatch(/script|onclick|onerror|javascript:|<img/i);
		expect(clean).toContain('Hi');
	});

	it('forces external links to open safely', () => {
		expect(sanitizeDescription('<p><a href="https://example.com">x</a></p>')).toContain(
			'rel="noopener noreferrer nofollow"'
		);
	});

	it('treats an empty document as empty', () => {
		expect(sanitizeDescription('<p></p>')).toBe('');
		expect(sanitizeDescription('   ')).toBe('');
	});
});

describe('descriptionToHtml', () => {
	it('turns old plain text into escaped paragraphs', () => {
		expect(descriptionToHtml('First a < b & c\nsecond\n\nNext paragraph')).toBe(
			'<p>First a &lt; b &amp; c<br>second</p><p>Next paragraph</p>'
		);
	});

	it('re-sanitises stored html', () => {
		expect(descriptionToHtml('<p>ok</p><script>x</script>')).toBe('<p>ok</p>');
	});

	it('handles empty', () => {
		expect(descriptionToHtml('')).toBe('');
	});
});

describe('stripTags', () => {
	it('returns readable plain text', () => {
		expect(stripTags('<h2>Title</h2><p>Hello <strong>world</strong> &amp; more</p>')).toBe(
			'Title Hello world & more'
		);
	});
});
