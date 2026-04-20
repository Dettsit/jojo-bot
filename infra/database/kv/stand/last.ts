import type { ActiveStand } from "@domain/stand/ports/activeStandRepository.ts";
import type { InfoStand } from "@domain/stand/stand.types.ts";
import { traced } from "@infra/telemetry.ts";

const kv = await Deno.openKv();

type StoredStand = Omit<ActiveStand, "date"> & { dateMs: number };

export async function last(): Promise<ActiveStand> {
    return traced("kv.stand.last", async () => {
        const entry = await kv.get<StoredStand>(["lastStand"]);

        if (entry.value) {
            return {
                ...entry.value,
                date: Temporal.Instant.fromEpochMilliseconds(entry.value.dateMs),
            };
        }

        const initial: ActiveStand = { date: Temporal.Now.instant(), value: undefined };
        await save(initial);
        return initial;
    });
}

export async function save(stand: ActiveStand): Promise<void> {
    await traced("kv.stand.save", async () => {
        const { date, ...rest } = stand;
        const stored: StoredStand = { ...rest, dateMs: date.epochMilliseconds };
        await kv.set(["lastStand"], stored);
    });
}
