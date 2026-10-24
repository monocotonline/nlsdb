import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// Any address that matches no other route lands here, so an unknown URL gets the shop's own
// "page not found" (with its header and footer) instead of a bare error screen.
export const load: PageLoad = () => error(404, 'Page not found');
