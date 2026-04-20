import type { StandAnnouncer } from "@domain/stand/ports/announcer.ts";
import type { ActiveStandRepository } from "@domain/stand/ports/activeStandRepository.ts";
import type { InfoStandRepository } from "@domain/stand/ports/infoRepository.ts";
import { selectWeighted } from "@domain/probability/selectWeighted.ts";
import { shouldResolveSpawn } from "./shouldSpawn.ts";
import type { SpawnStandResult } from "./spawnStand.types.ts";

type Deps = {
    announcer: StandAnnouncer;
    repository: ActiveStandRepository;
    infoRepository: InfoStandRepository;
};

export async function spawnStand(deps: Deps): Promise<SpawnStandResult> {
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
        return { status: "ran-away", stand: current.value.name };
    }

    const stands = await deps.infoRepository.findAll();
    if (stands.length === 0) return { status: "skipped", reason: "probability", probability: 0, elapsedMs: 0 };

    const { selected } = selectWeighted(stands, (s) => s.id, (s) => s.weight);
    const newStand = { date: now, value: selected };

    await Promise.all([
        deps.repository.save(newStand),
        deps.announcer.announceAppear(newStand),
    ]);

    return { status: "spawned", stand: selected.name };
}
