import type { ItemAnnouncer } from "@domain/item/ports/announcer.ts";
import type { ItemRepository } from "@domain/item/ports/repository.ts";
import { ITEMS } from "@domain/item/item.types.ts";
import { shouldResolveSpawn } from "./shouldSpawn.ts";
import type { SpawnResult } from "./spawn.types.ts";

type Deps = {
    announcer: ItemAnnouncer;
    repository: ItemRepository;
};

export async function spawnItem(deps: Deps): Promise<SpawnResult> {
    const current = await deps.repository.last();
    const now = Temporal.Now.instant();

    const check = shouldResolveSpawn(now, current);
    if (!check.should) {
        return { status: "skipped", reason: "probability", probability: check.probability, elapsedMs: check.elapsedMs };
    }

    if (current.value) {
        await Promise.all([
            deps.announcer.announceRunAway(current),
            deps.repository.save({ date: now, value: undefined }),
        ]);
        return { status: "ran-away", item: current.value.label };
    }

    const itemInfo = ITEMS["flecha-de-stand"];
    const newItem = {
        date: now,
        value: { type: itemInfo.type, label: itemInfo.label, emoji: itemInfo.emoji },
    };

    await Promise.all([
        deps.repository.save(newItem),
        deps.announcer.announceAppear(newItem),
    ]);

    return { status: "spawned", item: itemInfo.label };
}
