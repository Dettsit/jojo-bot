const maxInterval = 12 * 60 * 1000;

export type SpawnCheck = {
    should: boolean;
    probability: number;
    elapsedMs: number;
};

export function shouldResolveSpawn(on: Temporal.Instant, current: { date: Temporal.Instant }): SpawnCheck {
    const elapsedMs = on.epochMilliseconds - current.date.epochMilliseconds;
    const probability = Math.min(elapsedMs / maxInterval, 1);

    return { should: probability > Math.random(), probability, elapsedMs };
}
