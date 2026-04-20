import type { ActiveStandRepository } from "@domain/stand/ports/activeStandRepository.ts";
import type { StandRepository } from "@domain/stand/ports/standRepository.ts";
import type { InfoShinyRepository } from "@domain/stand/ports/infoShinyRepository.ts";
import { SHINY_RATE } from "@domain/stand/rarity.ts";
import type { OwnedStand } from "@domain/stand/stand.types.ts";
import { selectWeighted } from "@domain/probability/selectWeighted.ts";

export type ObtainResult =
    | { status: "no_stand" }
    | { status: "obtained"; stand: OwnedStand; image: string };

type Deps = {
    activeStandRepository: ActiveStandRepository;
    standRepository: StandRepository;
    infoShinyRepository: InfoShinyRepository;
};

export async function obtainStand(userId: string, deps: Deps): Promise<ObtainResult> {
    const active = await deps.activeStandRepository.last();
    if (!active.value) return { status: "no_stand" };

    const info = active.value;

    await deps.activeStandRepository.save({ date: Temporal.Now.instant(), value: undefined });

    const shinies = info.shinies ?? [];
    const shinyVariantId = shinies.length > 0 && Math.random() < SHINY_RATE
        ? selectWeighted(shinies, (s) => s.id, (s) => s.weight).selected.id
        : null;

    const shinyInfo = shinyVariantId
        ? await deps.infoShinyRepository.findById(shinyVariantId)
        : null;

    const stand = await deps.standRepository.create({
        stand_id: info.id,
        name: info.name,
        rarity: info.rarity,
        shiny: shinyVariantId,
        user: userId,
    });

    return { status: "obtained", stand, image: shinyInfo?.image ?? info.image };
}
