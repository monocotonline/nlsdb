/** URL-friendly version of a name: "Litigation & Procedure" becomes "litigation-and-procedure". */
export function slugify(name: string): string {
	return (
		name
			.toLowerCase()
			.normalize('NFKD')
			.replace(/[̀-ͯ]/g, '')
			.replace(/&/g, ' and ')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '') || 'category'
	);
}

/** A slug that is not in `taken`, adding -2, -3… when needed. */
export function uniqueSlug(name: string, taken: Iterable<string>): string {
	const used = new Set(taken);
	const base = slugify(name);
	let slug = base;
	for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;
	return slug;
}
