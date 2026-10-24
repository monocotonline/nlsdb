// Seeds the shop with sample books (with generated cover images).
//
//   pnpm seed              add 100 books (refuses if books already exist)
//   pnpm seed --force      add them anyway
//   pnpm seed --replace    delete previously seeded books first, then add new ones
//   pnpm seed --count 20   add a different number
//
// Needs PB_URL, PB_SUPERUSER_EMAIL and PB_SUPERUSER_PASSWORD (from .env).
import PocketBase from 'pocketbase';
import { renderCovers } from './covers.mjs';

const args = process.argv.slice(2);
const force = args.includes('--force');
const replace = args.includes('--replace');
const countArg = args.indexOf('--count');
const COUNT = countArg >= 0 ? Number(args[countArg + 1]) : 100;

const { PB_URL = 'http://127.0.0.1:8090', PB_SUPERUSER_EMAIL, PB_SUPERUSER_PASSWORD } = process.env;
if (!PB_SUPERUSER_EMAIL || !PB_SUPERUSER_PASSWORD) {
	console.error(
		'Set PB_SUPERUSER_EMAIL and PB_SUPERUSER_PASSWORD (run via `pnpm seed` to load .env).'
	);
	process.exit(1);
}

// ---------- deterministic randomness ----------
function mulberry32(seed) {
	return () => {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
const rand = mulberry32(2026);
const pick = (list) => list[Math.floor(rand() * list.length)];
const int = (min, max) => min + Math.floor(rand() * (max - min + 1));

// ---------- book data ----------
const subjects = [
	['Civil Litigation', 'the conduct of civil proceedings in the Nigerian courts'],
	['Criminal Litigation', 'criminal procedure from arrest to appeal'],
	['Corporate Law Practice', 'company formation, governance and transactions'],
	['Property Law Practice', 'conveyancing, land law and property transactions'],
	['Professional Ethics', 'the rules of conduct governing legal practitioners'],
	['Legal Drafting and Conveyancing', 'drafting skills for deeds, contracts and pleadings'],
	['Constitutional Law', 'the Nigerian constitution and fundamental rights'],
	['Law of Evidence', 'admissibility, proof and the rules of evidence'],
	['Law of Contract', 'formation, terms and remedies in contract'],
	['Law of Torts', 'civil wrongs and their remedies'],
	['Equity and Trusts', 'equitable doctrines and the law of trusts'],
	['Administrative Law', 'public bodies, judicial review and accountability'],
	['Company Law', 'the Companies and Allied Matters Act in practice'],
	['Labour and Employment Law', 'employment relationships and industrial disputes'],
	['Family Law', 'marriage, divorce, custody and succession'],
	['Alternative Dispute Resolution', 'arbitration, mediation and negotiation'],
	['Banking and Finance Law', 'banking regulation, security and finance'],
	['Intellectual Property Law', 'copyright, trademarks and patents'],
	['Oil and Gas Law', 'upstream and downstream petroleum regulation'],
	['International Law', 'public international law and its application'],
	['Taxation Law', 'tax administration and planning in Nigeria'],
	['Maritime Law', 'shipping, admiralty and carriage by sea'],
	['Jurisprudence', 'legal theory and the philosophy of law'],
	['Advocacy and Court Practice', 'trial advocacy and courtroom technique']
];
const formats = [
	['Principles of', 'A clear, practical account of the principles of', 'PRINCIPLES OF'],
	['Cases and Materials on', 'Leading cases, statutes and commentary on', 'CASES & MATERIALS ON'],
	['Practice Manual:', 'A step-by-step practice manual for', 'PRACTICE MANUAL'],
	['Digest of', 'A topic-by-topic digest covering', 'DIGEST OF'],
	[
		'Bar Finals Study Guide:',
		'A focused revision guide for the Bar Finals on',
		'BAR FINALS STUDY GUIDE'
	],
	['Essential Statutes for', 'The key statutes and rules needed for', 'ESSENTIAL STATUTES FOR']
];
// Subject -> category (course / area of law). Categories are created if missing.
const categoryOf = {
	'Civil Litigation': 'Litigation & Procedure',
	'Criminal Litigation': 'Litigation & Procedure',
	'Law of Evidence': 'Litigation & Procedure',
	'Advocacy and Court Practice': 'Litigation & Procedure',
	'Alternative Dispute Resolution': 'Litigation & Procedure',
	'Corporate Law Practice': 'Corporate & Commercial',
	'Company Law': 'Corporate & Commercial',
	'Banking and Finance Law': 'Corporate & Commercial',
	'Taxation Law': 'Corporate & Commercial',
	'Intellectual Property Law': 'Corporate & Commercial',
	'Property Law Practice': 'Property & Land',
	'Legal Drafting and Conveyancing': 'Property & Land',
	'Constitutional Law': 'Public Law',
	'Administrative Law': 'Public Law',
	'International Law': 'Public Law',
	'Law of Contract': 'Private Law',
	'Law of Torts': 'Private Law',
	'Equity and Trusts': 'Private Law',
	'Family Law': 'Private Law',
	'Labour and Employment Law': 'Private Law',
	Jurisprudence: 'Private Law',
	'Professional Ethics': 'Professional Practice',
	'Oil and Gas Law': 'Energy & Maritime',
	'Maritime Law': 'Energy & Maritime'
};
const ordinals = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh'];
// Every seeded description contains this sentence, which is how --replace finds seeded books.
const SEED_MARKER =
	'Written for students preparing for the Bar Finals and for practitioners who need a reliable reference.';
const surnames = [
	'Okonkwo',
	'Adeyemi',
	'Ibrahim',
	'Eze',
	'Balogun',
	'Nwosu',
	'Abubakar',
	'Okafor',
	'Oyelaran',
	'Chukwu',
	'Danjuma',
	'Afolabi',
	'Umeh',
	'Bello',
	'Onyema',
	'Adebayo',
	'Musa',
	'Ogunleye',
	'Nnamdi',
	'Yakubu',
	'Olawale',
	'Ekwueme',
	'Garba',
	'Ajayi'
];
const initials = 'ABCDEFGHJKLMNOPRSTUW'.split('');

const titles = new Set();
const books = [];
for (let attempt = 0; books.length < COUNT && attempt < COUNT * 20; attempt++) {
	const [subject, about] = pick(subjects);
	const [prefix, blurb, kicker] = pick(formats);
	const edition = int(1, 7);
	const title = `${prefix} ${subject}${edition > 1 ? `, ${edition}${['th', 'st', 'nd', 'rd'][edition % 10 > 3 ? 0 : edition % 10]} Edition` : ''}`;
	if (titles.has(title)) continue;
	titles.add(title);

	const authorCount = rand() < 0.25 ? 2 : 1;
	const authors = Array.from(
		{ length: authorCount },
		() => `${pick(initials)}. ${pick(initials)}. ${pick(surnames)}`
	);
	books.push({
		title,
		author: authors.join(' & '),
		price: int(6, 50) * 500, // ₦3,000 – ₦25,000
		description:
			`<p>${blurb} ${about}.</p>` +
			`<p>${SEED_MARKER}</p>` +
			`<h2>Inside this edition</h2>` +
			`<ul><li>Updated for recent decisions and statutory amendments</li>` +
			`<li>Worked examples and practice questions</li>` +
			`<li>Chapter summaries for quick revision</li></ul>`,
		imageCount: rand() < 0.2 ? 0 : rand() < 0.5 ? 1 : int(2, 4),
		// used to typeset the generated cover images
		subject,
		category: categoryOf[subject],
		kicker,
		kickerTitle: prefix,
		edition,
		editionLabel: `${ordinals[edition - 1]} Edition`,
		isbn: int(100000000, 999999999)
	});
}

// ---------- seed ----------
const pb = new PocketBase(PB_URL);
await pb.collection('_superusers').authWithPassword(PB_SUPERUSER_EMAIL, PB_SUPERUSER_PASSWORD);

if (replace) {
	const old = await pb
		.collection('books')
		.getFullList({ filter: pb.filter('description ~ {:marker}', { marker: SEED_MARKER }) });
	for (const book of old) await pb.collection('books').delete(book.id);
	console.log(`Removed ${old.length} previously seeded book(s).`);
}

const existing = await pb.collection('books').getList(1, 1);
if (existing.totalItems > 0 && !force && !replace) {
	console.error(
		`The shop already has ${existing.totalItems} book(s). Run \`pnpm seed --force\` to add ${books.length} more.`
	);
	process.exit(1);
}

const categoryIds = new Map();
try {
	for (const c of await pb.collection('categories').getFullList()) categoryIds.set(c.name, c.id);
	for (const name of new Set(Object.values(categoryOf))) {
		if (!categoryIds.has(name)) {
			categoryIds.set(name, (await pb.collection('categories').create({ name })).id);
		}
	}
} catch {
	console.error(
		'Could not use the categories collection. Restart PocketBase to apply the latest migrations.'
	);
	process.exit(1);
}

let done = 0;
for (const [i, book] of books.entries()) {
	const data = new FormData();
	data.set('type', 'book');
	data.set('title', book.title);
	data.set('author', book.author);
	data.set('description', book.description);
	data.set('price', String(book.price));
	data.set('category', categoryIds.get(book.category) ?? '');
	renderCovers(book, book.imageCount, i * 7 + 3).forEach((png, n) => {
		data.append('images', new File([png], `cover-${i + 1}-${n + 1}.png`, { type: 'image/png' }));
	});
	await pb.collection('books').create(data);
	done++;
	if (done % 10 === 0 || done === books.length) console.log(`  ${done}/${books.length} books`);
}
console.log(`Seeded ${done} books into ${PB_URL}.`);
