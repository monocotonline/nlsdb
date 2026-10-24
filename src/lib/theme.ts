/** What the person chose. "system" means follow the device's light/dark setting. */
export type ThemePreference = 'light' | 'dark' | 'system';
/** What is actually shown. */
export type Theme = 'light' | 'dark';

const KEY = 'theme';
const META_COLOURS: Record<Theme, string> = { light: '#ffffff', dark: '#18181b' };

/** Pure: which theme to show for a preference, given the device setting. */
export const resolveTheme = (preference: ThemePreference, systemIsDark: boolean): Theme =>
	preference === 'system' ? (systemIsDark ? 'dark' : 'light') : preference;

const systemIsDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

/** The saved choice. Anything missing or unrecognised means "system". */
export function getPreference(): ThemePreference {
	try {
		const value = localStorage.getItem(KEY);
		return value === 'light' || value === 'dark' ? value : 'system';
	} catch {
		return 'system';
	}
}

function apply(preference: ThemePreference) {
	const theme = resolveTheme(preference, systemIsDark());
	const root = document.documentElement;
	root.classList.toggle('dark', theme === 'dark');
	// The switcher's highlight is positioned from this attribute, so it is right from first paint.
	root.dataset.themePref = preference;
	// Keeps the phone's browser bar in step with the page.
	document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META_COLOURS[theme]);
}

/** Switches theme and remembers the choice ("system" clears it). */
export function setPreference(preference: ThemePreference) {
	try {
		if (preference === 'system') localStorage.removeItem(KEY);
		else localStorage.setItem(KEY, preference);
	} catch {
		// storage unavailable; the choice just won't persist
	}
	apply(preference);
}

/**
 * While the preference is "system", follow the device setting as it changes (for example, a
 * phone switching to dark at sunset). Returns a function that stops listening.
 */
export function followSystemTheme(): () => void {
	const query = window.matchMedia('(prefers-color-scheme: dark)');
	const listener = () => {
		if (getPreference() === 'system') apply('system');
	};
	query.addEventListener('change', listener);
	return () => query.removeEventListener('change', listener);
}
