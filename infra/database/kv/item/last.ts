import type { ActiveItem } from "@domain/item/item.types.ts";
import { traced } from "@infra/telemetry.ts";

const kv = await Deno.openKv();

type StoredItem = Omit<ActiveItem, "date"> & { dateMs: number };

export async function last(): Promise<ActiveItem> {
    return traced("kv.item.last", async () => {
        const entry = await kv.get<StoredItem>(["lastItem"]);

        if (entry.value) {
            return {
                ...entry.value,
                date: Temporal.Instant.fromEpochMilliseconds(entry.value.dateMs),
            };
        }

        const initial: ActiveItem = { date: Temporal.Now.instant(), value: undefined };
        await save(initial);
        return initial;
    });
}

export async function save(item: ActiveItem): Promise<void> {
    await traced("kv.item.save", async () => {
        const { date, ...rest } = item;
        const stored: StoredItem = { ...rest, dateMs: date.epochMilliseconds };
        await kv.set(["lastItem"], stored);
    });
}
