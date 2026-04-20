export type SpawnResult =
    | { status: "skipped"; reason: "probability"; probability: number; elapsedMs: number }
    | { status: "ran-away"; item: string }
    | { status: "spawned"; item: string };
