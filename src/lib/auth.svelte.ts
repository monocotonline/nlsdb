export type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

/** Shared state for the customer sign-in dialog, so any page can open it. */
export const auth = $state<{
	open: boolean;
	mode: AuthMode;
	redirectTo: string | null;
	/** The reset token from an emailed link (?auth=reset&token=…). */
	token: string | null;
	/** A message to show on the next screen, such as "Password updated". */
	notice: string;
}>({
	open: false,
	mode: 'login',
	redirectTo: null,
	token: null,
	notice: ''
});

export function openAuth(mode: AuthMode = 'login', redirectTo: string | null = null) {
	auth.mode = mode;
	auth.redirectTo = redirectTo;
	auth.token = null;
	auth.notice = '';
	auth.open = true;
}
