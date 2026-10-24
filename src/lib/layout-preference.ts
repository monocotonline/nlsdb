export type Layout = 'grid' | 'list';

const KEY = 'layout';

/** The saved grid/list choice. It is a personal preference, so it lives in the browser, not the URL. */
export function loadLayout(): Layout {
	try {
		return localStorage.getItem(KEY) === 'list' ? 'list' : 'grid';
	} catch {
		return 'grid';
	}
}

export function saveLayout(layout: Layout) {
	try {
		localStorage.setItem(KEY, layout);
	} catch {
		// storage unavailable; the choice just won't persist
	}
}
