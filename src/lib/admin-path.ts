/**
 * Where the admin lives. The route folder (src/routes/nls-console) has to match, so renaming it
 * means renaming that folder and changing this one line.
 */
export const ADMIN_PATH = '/nls-console';

export const isAdminPath = (pathname: string) =>
	pathname === ADMIN_PATH || pathname.startsWith(`${ADMIN_PATH}/`);
