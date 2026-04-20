import type { ActiveStandRepository } from "@domain/stand/ports/activeStandRepository.ts";
import type { StandRepository } from "@domain/stand/ports/standRepository.ts";
import { SHINY_RARITIES, SHINY_RATE } from "@domain/stand/rarity.ts";
import type { OwnedStand } from "@domain/stand/stand.types.ts";

export type ObtainResult =
    | { status: "no_stand" }
    | { status: "obtained"; stand: OwnedStand; image: string };

type Deps = {
    activeStandRepository: ActiveStandRepository;
    standRepository: StandRepository;
};

export async function obtainStand(userId: string, deps: Deps): Promise<ObtainResult> {
    const active = await deps.activeStandRepository.last();
    if (!active.value) return { status: "no_stand" };

    const info = active.value;

    await deps.activeStandRepository.save({ date: Temporal.Now.instant(), value: undefined });

    const canBeShiny = info.can_be_shiny && SHINY_RARITIES.includes(info.rarity);
    const shiny = canBeShiny && Math.random() < SHINY_RATE;

    const stand = await deps.standRepository.create({
        stand_id: info.id,
        name: info.name,
        rarity: info.rarity,
        shiny,
        user: userId,
    });

    return { status: "obtained", stand, image: info.image };
}
