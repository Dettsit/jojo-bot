export const DEFAULT_MAX_INTERVAL_MS = 12 * 60 * 1000;

export type SpawnCheck = {
    should: boolean;
    probability: number;
    elapsedMs: number;
};

export function shouldResolveSpawn(
    on: Temporal.Instant,
    current: { date: Temporal.Instant },
    maxIntervalMs = DEFAULT_MAX_INTERVAL_MS,
): SpawnCheck {
    const elapsedMs = on.epochMilliseconds - current.date.epochMilliseconds;
    const probability = Math.min(elapsedMs / maxIntervalMs, 1);

    return { should: probability > Math.random(), probability, elapsedMs };
}
