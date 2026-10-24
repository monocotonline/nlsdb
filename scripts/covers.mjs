// Generates textbook-style cover images (front, back, contents, preface) for the seed data.
import { fileURLToPath } from 'node:url';
import { GlobalFonts, createCanvas } from '@napi-rs/canvas';

const font = (pkg, file) =>
	fileURLToPath(new URL(`../node_modules/@fontsource/${pkg}/files/${file}.woff`, import.meta.url));
GlobalFonts.registerFromPath(
	font('playfair-display', 'playfair-display-latin-700-normal'),
	'Playfair'
);
GlobalFonts.registerFromPath(
	font('playfair-display', 'playfair-display-latin-900-normal'),
	'PlayfairBlack'
);
GlobalFonts.registerFromPath(
	font('playfair-display', 'playfair-display-latin-400-normal'),
	'PlayfairRegular'
);
GlobalFonts.registerFromPath(font('inter', 'inter-latin-400-normal'), 'InterRegular');
GlobalFonts.registerFromPath(font('inter', 'inter-latin-600-normal'), 'InterSemi');
GlobalFonts.registerFromPath(font('inter', 'inter-latin-700-normal'), 'InterBold');

const W = 600;
const H = 800;

const PALETTES = [
	{ bg: '#14213d', ink: '#f4efe4', accent: '#c9a227', soft: '#24365f' }, // navy & gold
	{ bg: '#5a1a2b', ink: '#f6ede3', accent: '#e0b97a', soft: '#74283c' }, // burgundy
	{ bg: '#1f3d2e', ink: '#f3eee0', accent: '#d4b45a', soft: '#2d5340' }, // forest
	{ bg: '#222428', ink: '#f2f2f0', accent: '#d9482b', soft: '#34373d' }, // charcoal & red
	{ bg: '#1d4e89', ink: '#f7f7f5', accent: '#f2c14e', soft: '#2b64a8' }, // royal blue
	{ bg: '#0f4c5c', ink: '#f6f1e6', accent: '#e36414', soft: '#1b6577' }, // teal & orange
	{ bg: '#3b2f2f', ink: '#f5ece0', accent: '#c8a165', soft: '#524141' }, // espresso
	{ bg: '#2a2d5a', ink: '#f5f3ec', accent: '#e8a33d', soft: '#3d4180' } // indigo
];
const IVORY = '#f5efe2';
const INK = '#1c1c1f';

function wrap(ctx, text, maxWidth) {
	const lines = [];
	let line = '';
	for (const word of text.split(' ')) {
		const test = line ? `${line} ${word}` : word;
		if (ctx.measureText(test).width > maxWidth && line) {
			lines.push(line);
			line = word;
		} else line = test;
	}
	if (line) lines.push(line);
	return lines;
}

/** Shrinks the font until the wrapped text fits in `maxLines`. */
function fitText(ctx, text, family, weightSize, maxWidth, maxLines, minSize = 30) {
	for (let size = weightSize; size >= minSize; size -= 2) {
		ctx.font = `${size}px ${family}`;
		const lines = wrap(ctx, text, maxWidth);
		const fits = lines.every((l) => ctx.measureText(l).width <= maxWidth);
		if (lines.length <= maxLines && fits) return { size, lines };
	}
	ctx.font = `${minSize}px ${family}`;
	return { size: minSize, lines: wrap(ctx, text, maxWidth).slice(0, maxLines) };
}

function spaced(ctx, text, x, y, spacing, align = 'left') {
	const widths = [...text].map((c) => ctx.measureText(c).width);
	const total = widths.reduce((a, b) => a + b, 0) + spacing * (text.length - 1);
	let cx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
	[...text].forEach((c, i) => {
		ctx.fillText(c, cx, y);
		cx += widths[i] + spacing;
	});
}

function hardcoverFinish(ctx, rand) {
	// subtle linen grain
	for (let i = 0; i < 26000; i++) {
		ctx.fillStyle = rand() < 0.5 ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.045)';
		ctx.fillRect(rand() * W, rand() * H, 1.4, 1.4);
	}
	// lighting across the whole cover
	const light = ctx.createLinearGradient(0, 0, W, H);
	light.addColorStop(0, 'rgba(255,255,255,0.07)');
	light.addColorStop(1, 'rgba(0,0,0,0.16)');
	ctx.fillStyle = light;
	ctx.fillRect(0, 0, W, H);
	// spine hinge
	const spine = ctx.createLinearGradient(0, 0, 56, 0);
	spine.addColorStop(0, 'rgba(0,0,0,0.38)');
	spine.addColorStop(0.55, 'rgba(0,0,0,0.05)');
	spine.addColorStop(0.62, 'rgba(255,255,255,0.10)');
	spine.addColorStop(0.7, 'rgba(0,0,0,0.12)');
	spine.addColorStop(1, 'rgba(0,0,0,0)');
	ctx.fillStyle = spine;
	ctx.fillRect(0, 0, 56, H);
}

const SERIES = 'NLS LAW SERIES';

function front(book, pal, style, rand) {
	const canvas = createCanvas(W, H);
	const ctx = canvas.getContext('2d');
	const left = 84;
	const right = W - 56;
	const width = right - left;
	ctx.textBaseline = 'alphabetic';

	if (style === 0) {
		// Classic: centred serif title, double rule, publisher mark
		ctx.fillStyle = pal.bg;
		ctx.fillRect(0, 0, W, H);
		ctx.strokeStyle = pal.accent;
		ctx.lineWidth = 2;
		ctx.strokeRect(left - 18, 46, width + 36, H - 92);
		ctx.lineWidth = 1;
		ctx.strokeRect(left - 10, 54, width + 20, H - 108);

		ctx.fillStyle = pal.accent;
		ctx.font = '600 15px InterSemi';
		spaced(ctx, SERIES, W / 2 + 14, 112, 5, 'center');

		ctx.fillStyle = pal.ink;
		ctx.font = '400 17px InterRegular';
		spaced(ctx, book.kicker, W / 2 + 14, 196, 3.5, 'center');

		ctx.fillStyle = pal.ink;
		const t = fitText(ctx, book.subject, 'PlayfairBlack', 66, width - 30, 4, 40);
		let y = 270;
		ctx.textAlign = 'center';
		for (const line of t.lines) {
			ctx.fillText(line, W / 2 + 14, y);
			y += t.size * 1.16;
		}
		ctx.fillStyle = pal.accent;
		ctx.fillRect(W / 2 + 14 - 40, y + 4, 80, 3);
		ctx.fillStyle = pal.ink;
		ctx.font = '400 20px PlayfairRegular';
		ctx.fillText(book.editionLabel, W / 2 + 14, y + 44);

		ctx.font = '600 17px InterSemi';
		ctx.fillStyle = pal.ink;
		spaced(ctx, book.author.toUpperCase(), W / 2 + 14, H - 128, 2, 'center');
		ctx.fillStyle = pal.accent;
		ctx.font = '600 13px InterSemi';
		spaced(ctx, 'NLS PRESS · ABUJA', W / 2 + 14, H - 92, 4, 'center');
		ctx.textAlign = 'left';
	} else if (style === 1) {
		// Modern: bold left-aligned title with accent block
		ctx.fillStyle = pal.bg;
		ctx.fillRect(0, 0, W, H);
		ctx.fillStyle = pal.accent;
		ctx.fillRect(left, 64, 74, 8);
		ctx.fillStyle = pal.soft;
		ctx.fillRect(0, H * 0.7, W, H * 0.3);

		ctx.fillStyle = pal.accent;
		ctx.font = '700 15px InterBold';
		spaced(ctx, SERIES, left, 116, 4);

		ctx.fillStyle = pal.ink;
		ctx.font = '400 20px InterRegular';
		ctx.fillText(book.kickerTitle, left, 214);
		const t = fitText(ctx, book.subject, 'PlayfairBlack', 80, width, 4, 44);
		let y = 214 + t.size * 1.18 + 6;
		for (const line of t.lines) {
			ctx.fillText(line, left, y);
			y += t.size * 1.12;
		}

		ctx.fillStyle = pal.accent;
		ctx.font = '700 64px InterBold';
		ctx.fillText(String(book.edition) + '.', left, H * 0.7 + 86);
		ctx.fillStyle = pal.ink;
		ctx.font = '400 17px InterRegular';
		ctx.fillText('edition', left + (book.edition > 9 ? 84 : 52), H * 0.7 + 86);

		ctx.font = '600 20px InterSemi';
		ctx.fillText(book.author, left, H - 74);
		ctx.fillStyle = pal.accent;
		ctx.font = '600 13px InterSemi';
		spaced(ctx, 'NLS PRESS', left, H - 44, 4);
	} else if (style === 2) {
		// Split: ivory upper panel, coloured band below
		ctx.fillStyle = IVORY;
		ctx.fillRect(0, 0, W, H);
		ctx.fillStyle = pal.bg;
		ctx.fillRect(0, H * 0.6, W, H * 0.4);
		ctx.fillStyle = pal.accent;
		ctx.fillRect(0, H * 0.6, W, 6);

		ctx.fillStyle = pal.bg;
		ctx.font = '700 14px InterBold';
		spaced(ctx, SERIES, left, 96, 4);
		ctx.fillStyle = '#55535a';
		ctx.font = '400 17px InterRegular';
		spaced(ctx, book.kicker, left, 156, 3);

		ctx.fillStyle = INK;
		const t = fitText(ctx, book.subject, 'PlayfairBlack', 72, width, 4, 40);
		let y = 232;
		for (const line of t.lines) {
			ctx.fillText(line, left, y);
			y += t.size * 1.14;
		}

		ctx.fillStyle = pal.ink;
		ctx.font = '600 22px InterSemi';
		ctx.fillText(book.author, left, H * 0.6 + 76);
		ctx.fillStyle = pal.accent;
		ctx.font = '400 20px PlayfairRegular';
		ctx.fillText(book.editionLabel, left, H * 0.6 + 114);
		ctx.fillStyle = pal.ink;
		ctx.font = '600 13px InterSemi';
		spaced(ctx, 'NLS PRESS · ABUJA', left, H - 52, 4);
	} else {
		// Minimal: ivory with colour spine band and large dark title
		ctx.fillStyle = IVORY;
		ctx.fillRect(0, 0, W, H);
		ctx.fillStyle = pal.bg;
		ctx.fillRect(0, 0, 60, H);
		ctx.fillStyle = pal.accent;
		ctx.fillRect(60, 0, 6, H);

		ctx.fillStyle = pal.bg;
		ctx.font = '700 14px InterBold';
		spaced(ctx, book.kicker, left + 8, 120, 3.5);
		ctx.fillStyle = INK;
		const t = fitText(ctx, book.subject, 'PlayfairBlack', 76, width - 8, 5, 42);
		let y = 200;
		for (const line of t.lines) {
			ctx.fillText(line, left + 8, y);
			y += t.size * 1.12;
		}
		ctx.fillStyle = pal.accent;
		ctx.fillRect(left + 8, y + 6, 54, 4);
		ctx.fillStyle = '#55535a';
		ctx.font = '400 20px PlayfairRegular';
		ctx.fillText(book.editionLabel, left + 8, y + 50);
		ctx.fillStyle = INK;
		ctx.font = '600 20px InterSemi';
		ctx.fillText(book.author, left + 8, H - 92);
		ctx.fillStyle = pal.bg;
		ctx.font = '700 13px InterBold';
		spaced(ctx, 'NLS PRESS · ABUJA', left + 8, H - 56, 4);
	}
	hardcoverFinish(ctx, rand);
	return canvas;
}

function back(book, pal, style, rand) {
	const canvas = createCanvas(W, H);
	const ctx = canvas.getContext('2d');
	const light = style >= 2;
	ctx.fillStyle = light ? IVORY : pal.bg;
	ctx.fillRect(0, 0, W, H);
	const fg = light ? INK : pal.ink;
	const left = 84;
	const width = W - left - 56;

	ctx.fillStyle = light ? pal.bg : pal.accent;
	ctx.font = '700 14px InterBold';
	spaced(ctx, SERIES, left, 110, 4);

	ctx.fillStyle = fg;
	const heading = fitText(ctx, book.subject, 'Playfair', 34, width, 2, 24);
	let y = 168;
	for (const line of heading.lines) {
		ctx.fillText(line, left, y);
		y += heading.size * 1.25;
	}
	ctx.fillStyle = light ? pal.bg : pal.accent;
	ctx.fillRect(left, y - 10, 46, 3);

	ctx.fillStyle = fg;
	ctx.font = '400 19px InterRegular';
	y += 34;
	for (const line of wrap(ctx, book.description, width).slice(0, 12)) {
		ctx.fillText(line, left, y);
		y += 31;
	}

	ctx.font = '600 16px InterSemi';
	ctx.fillStyle = light ? pal.bg : pal.accent;
	ctx.fillText(`About the author`, left, H - 250);
	ctx.fillStyle = fg;
	ctx.font = '400 16px InterRegular';
	let ay = H - 224;
	for (const line of wrap(
		ctx,
		`${book.author} is a legal practitioner and lecturer with many years of experience teaching and practising in Nigeria.`,
		width
	).slice(0, 3)) {
		ctx.fillText(line, left, ay);
		ay += 25;
	}

	// barcode panel
	ctx.fillStyle = '#ffffff';
	ctx.fillRect(W - 236, H - 150, 180, 96);
	ctx.fillStyle = '#111';
	let bx = W - 226;
	while (bx < W - 66) {
		const w = 1 + Math.floor(rand() * 3);
		ctx.fillRect(bx, H - 140, w, 62);
		bx += w + 1 + Math.floor(rand() * 3);
	}
	ctx.fillStyle = '#111';
	ctx.font = '400 11px InterRegular';
	ctx.fillText(`978 ${String(book.isbn).padStart(10, '0')}`, W - 226, H - 64);

	ctx.fillStyle = fg;
	ctx.font = '600 13px InterSemi';
	spaced(ctx, 'NLS PRESS · ABUJA', left, H - 62, 4);
	hardcoverFinish(ctx, rand);
	return canvas;
}

const CHAPTERS = [
	'Introduction and sources',
	'Jurisdiction and parties',
	'Commencement of proceedings',
	'Pleadings and particulars',
	'Interlocutory applications',
	'Evidence and proof',
	'Trial and judgment',
	'Remedies and reliefs',
	'Appeals and review',
	'Costs and enforcement',
	'Practice directions',
	'Statutes and subsidiary legislation'
];

function page(book, pal, kind, rand) {
	const canvas = createCanvas(W, H);
	const ctx = canvas.getContext('2d');
	ctx.fillStyle = '#fbf8f0';
	ctx.fillRect(0, 0, W, H);
	const left = 78;
	const right = W - 62;

	ctx.fillStyle = INK;
	if (kind === 'contents') {
		ctx.font = '700 40px Playfair';
		ctx.fillText('Contents', left, 130);
		ctx.fillStyle = pal.accent;
		ctx.fillRect(left, 150, 60, 3);
		ctx.fillStyle = INK;
		ctx.font = '400 20px InterRegular';
		let pageNo = 1;
		const chapters = [...CHAPTERS].sort(() => rand() - 0.5).slice(0, 10);
		chapters.forEach((name, i) => {
			const y = 214 + i * 50;
			const label = `${String(i + 1).padStart(2, '0')}  ${name}`;
			const num = String((pageNo += 6 + Math.floor(rand() * 22)));
			ctx.fillStyle = INK;
			ctx.textAlign = 'left';
			ctx.fillText(label, left, y);
			const labelEnd = left + ctx.measureText(label).width + 10;
			const numStart = right - ctx.measureText(num).width;
			ctx.fillStyle = '#9a968d';
			for (let x = labelEnd; x < numStart - 8; x += 7) ctx.fillRect(x, y - 3, 2, 2);
			ctx.fillStyle = INK;
			ctx.textAlign = 'right';
			ctx.fillText(num, right, y);
			ctx.textAlign = 'left';
		});
	} else {
		ctx.font = '700 40px Playfair';
		ctx.fillText('Preface', left, 130);
		ctx.fillStyle = pal.accent;
		ctx.fillRect(left, 150, 60, 3);
		ctx.fillStyle = '#3b3a40';
		ctx.font = '400 19px InterRegular';
		const text =
			`This edition of ${book.subject} has been prepared for students and practitioners who need a clear, ` +
			`dependable guide. The law has moved on since the last edition: new decisions of the appellate courts, ` +
			`amendments to the rules of court and fresh statutory provisions have all been taken into account. ` +
			`Each chapter opens with a short overview, sets out the governing authorities and closes with a summary ` +
			`and practice questions. I am grateful to colleagues and students whose questions shaped this book.`;
		let y = 214;
		for (const line of wrap(ctx, text, right - left)) {
			ctx.fillText(line, left, y);
			y += 33;
		}
		ctx.fillStyle = INK;
		ctx.font = '400 20px PlayfairRegular';
		ctx.textAlign = 'right';
		ctx.fillText(book.author, right, y + 40);
		ctx.textAlign = 'left';
	}
	ctx.fillStyle = '#9a968d';
	ctx.font = '400 13px InterRegular';
	ctx.textAlign = 'center';
	ctx.fillText(kind === 'contents' ? 'v' : 'vii', W / 2, H - 50);
	ctx.textAlign = 'left';
	// paper gutter shadow
	const gutter = ctx.createLinearGradient(0, 0, 46, 0);
	gutter.addColorStop(0, 'rgba(0,0,0,0.14)');
	gutter.addColorStop(1, 'rgba(0,0,0,0)');
	ctx.fillStyle = gutter;
	ctx.fillRect(0, 0, 46, H);
	return canvas;
}

/** Returns PNG buffers: front, back, contents, preface (in that order, up to `count`). */
export function renderCovers(book, count, seed) {
	let s = seed >>> 0;
	const rand = () => {
		s = (s + 0x6d2b79f5) | 0;
		let t = Math.imul(s ^ (s >>> 15), 1 | s);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
	const pal = PALETTES[seed % PALETTES.length];
	const style = Math.floor(seed / PALETTES.length) % 4;
	const makers = [
		() => front(book, pal, style, rand),
		() => back(book, pal, style, rand),
		() => page(book, pal, 'contents', rand),
		() => page(book, pal, 'preface', rand)
	];
	return makers.slice(0, count).map((make) => make().toBuffer('image/png'));
}
