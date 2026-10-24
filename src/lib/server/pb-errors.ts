import { ClientResponseError } from 'pocketbase';

/** The record really does not exist. */
export const isNotFound = (e: unknown) => e instanceof ClientResponseError && e.status === 404;

/** PocketBase could not be reached at all (not running, wrong address, network down). */
export const isUnreachable = (e: unknown) =>
	e instanceof ClientResponseError && e.status === 0 && !e.isAbort;
