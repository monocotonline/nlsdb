// Seeds sample apparel and paraphernalia (with generated product images).
//
//   pnpm seed:merch             add the items (refuses if apparel/paraphernalia already exist)
//   pnpm seed:merch --replace   delete previously seeded items first
//
// Needs PB_URL, PB_SUPERUSER_EMAIL and PB_SUPERUSER_PASSWORD (from .env).
import PocketBase from 'pocketbase';
import { createCanvas } from '@napi-rs/canvas';
import './covers.mjs'; // registers the fonts

const replace = process.argv.includes('--replace');
const { PB_URL = 'http://127.0.0.1:8090', PB_SUPERUSER_EMAIL, PB_SUPERUSER_PASSWORD } = process.env;
if (!PB_SUPERUSER_EMAIL || !PB_SUPERUSER_PASSWORD) {
	console.error(
		'Set PB_SUPERUSER_EMAIL and PB_SUPERUSER_PASSWORD (run via `pnpm seed:merch` to load .env).'
	);
	process.exit(1);
}

// Every seeded description contains this, which is how --replace finds seeded items.
const MARKER = 'Official Nigerian Law School merchandise (sample item).';

const items = [
	[
		'apparel',
		'NLS Crest Polo Shirt',
		'Polo',
		9500,
		'#14213d',
		'Embroidered crest on a breathable cotton-blend polo.'
	],
	[
		'apparel',
		'Bar Finals Hoodie',
		'Hoodie',
		18500,
		'#222428',
		'Heavyweight fleece hoodie with a front pouch pocket.'
	],
	[
		'apparel',
		'Call to Bar Tee',
		'T-Shirt',
		6000,
		'#5a1a2b',
		'Soft cotton tee marking the day you are called to the Bar.'
	],
	[
		'apparel',
		'Law School Varsity Jacket',
		'Jacket',
		32000,
		'#1f3d2e',
		'Wool-blend body with contrast sleeves and an embroidered crest.'
	],
	[
		'apparel',
		'Advocate Cap',
		'Cap',
		4500,
		'#1d4e89',
		'Adjustable cotton cap with a stitched scales-of-justice emblem.'
	],
	[
		'apparel',
		'Chambers Crew Socks',
		'Socks',
		2500,
		'#0f4c5c',
		'Pair of cushioned crew socks with a woven crest.'
	],
	[
		'paraphernalia',
		'NLS Ceramic Mug',
		'Mug',
		3500,
		'#3b2f2f',
		'Dishwasher-safe 350ml mug with the school crest.'
	],
	[
		'paraphernalia',
		'Branded Tote Bag',
		'Tote',
		4000,
		'#2a2d5a',
		'Sturdy canvas tote, large enough for a stack of textbooks.'
	],
	[
		'paraphernalia',
		'Hardcover Notebook',
		'Notebook',
		3000,
		'#14213d',
		'A5 ruled hardcover notebook for lectures and moots.'
	],
	[
		'paraphernalia',
		'Lanyard and ID Holder',
		'Lanyard',
		1500,
		'#5a1a2b',
		'Woven lanyard with a clear ID card holder.'
	],
	[
		'paraphernalia',
		'Metal Pen Set',
		'Pen Set',
		5500,
		'#222428',
		'Two engraved metal pens in a gift case.'
	],
	[
		'paraphernalia',
		'Crest Pin Badge',
		'Badge',
		1200,
		'#1f3d2e',
		'Enamel lapel pin with the school crest.'
	]
];

function image(name, kind, bg) {
	const canvas = createCanvas(800, 1000);
	const ctx = canvas.getContext('2d');
	ctx.fillStyle = bg;
	ctx.fillRect(0, 0, 800, 1000);
	ctx.fillStyle = 'rgba(255,255,255,0.08)';
	ctx.beginPath();
	ctx.arc(400, 420, 260, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = '#f4efe4';
	ctx.textAlign = 'center';
	ctx.font = '120px PlayfairBlack';
	ctx.fillText(kind.toUpperCase().slice(0, 12), 400, 450, 600);
	ctx.font = '36px InterSemi';
	ctx.fillStyle = '#c9a227';
	ctx.fillText('NIGERIAN LAW SCHOOL', 400, 540);
	ctx.fillStyle = '#f4efe4';
	ctx.font = '44px Playfair';
	ctx.fillText(name, 400, 880, 700);
	return canvas.toBuffer('image/png');
}

const pb = new PocketBase(PB_URL);
await pb.collection('_superusers').authWithPassword(PB_SUPERUSER_EMAIL, PB_SUPERUSER_PASSWORD);

if (replace) {
	const old = await pb
		.collection('books')
		.getFullList({ filter: pb.filter('description ~ {:m}', { m: MARKER }) });
	for (const r of old) await pb.collection('books').delete(r.id);
	console.log(`Removed ${old.length} previously seeded item(s).`);
}

const existing = await pb.collection('books').getList(1, 1, { filter: 'type != "book"' });
if (existing.totalItems > 0) {
	console.error(
		'Apparel or paraphernalia already exist. Run `pnpm seed:merch --replace` to redo them.'
	);
	process.exit(1);
}

for (const [type, title, kind, price, bg, blurb] of items) {
	const data = new FormData();
	data.set('type', type);
	data.set('title', title);
	data.set('price', String(price));
	data.set('description', `<p>${blurb}</p><p>${MARKER}</p>`);
	data.append(
		'images',
		new File([image(title, kind, bg)], `${kind.toLowerCase()}.png`, { type: 'image/png' })
	);
	await pb.collection('books').create(data);
}
console.log(`Seeded ${items.length} items into ${PB_URL}.`);
