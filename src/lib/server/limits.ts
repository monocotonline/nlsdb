import { createRateLimiter } from './rate-limit.js';

// Shared across requests (module level) so the limits survive between them.
export const newTicketLimiter = createRateLimiter({ max: 5, windowMs: 60 * 60 * 1000 });
export const replyLimiter = createRateLimiter({ max: 30, windowMs: 60 * 60 * 1000 });
export const trackLimiter = createRateLimiter({ max: 15, windowMs: 10 * 60 * 1000 });

// Wrong current passwords are the signal to watch for when changing a password.
export const passwordChangeLimiter = createRateLimiter({ max: 10, windowMs: 60 * 60 * 1000 });

// Password reset emails: enough for a person who mistyped, not enough to flood someone's inbox.
export const resetRequestLimiter = createRateLimiter({ max: 5, windowMs: 60 * 60 * 1000 });
export const resetConfirmLimiter = createRateLimiter({ max: 15, windowMs: 60 * 60 * 1000 });
