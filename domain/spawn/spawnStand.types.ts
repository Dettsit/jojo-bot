export type SpawnStandResult =
    | { status: "skipped"; reason: "probability"; probability: number; elapsedMs: number }
    | { status: "ran-away"; stand: string }
    | { status: "spawned"; stand: string };
