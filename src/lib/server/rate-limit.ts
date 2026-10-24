/**
 * A small in-memory limiter: at most `max` hits per `windowMs` for each key (for example an IP
 * address). It resets when the server restarts, which is fine for stopping a contact form from
 * being flooded; it is not a security boundary.
 */
export function createRateLimiter({ max, windowMs }: { max: number; windowMs: number }) {
	const hits = new Map<string, number[]>();

	return {
		/** Records a hit and returns whether it is allowed. */
		allow(key: string, now = Date.now()): boolean {
			const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
			if (recent.length >= max) {
				hits.set(key, recent);
				return false;
			}
			recent.push(now);
			hits.set(key, recent);
			// Stop the map growing forever on a long-running server.
			if (hits.size > 5000) {
				for (const [k, times] of hits) {
					if (times.every((t) => now - t >= windowMs)) hits.delete(k);
				}
			}
			return true;
		}
	};
}
