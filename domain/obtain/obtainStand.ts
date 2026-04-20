import type { InfoStandRepository } from "@domain/stand/ports/infoRepository.ts";
import type { StandRepository } from "@domain/stand/ports/standRepository.ts";
import type { InventoryRepository } from "@domain/stand/ports/inventoryRepository.ts";
import { selectWeighted } from "@domain/probability/selectWeighted.ts";
import { SHINY_RARITIES, SHINY_RATE } from "@domain/stand/rarity.ts";
import type { OwnedStand } from "@domain/stand/stand.types.ts";

export type ObtainResult =
    | { status: "no_arrow" }
    | { status: "no_stands" }
    | { status: "obtained"; stand: OwnedStand };

type Deps = {
    infoRepository: InfoStandRepository;
    standRepository: StandRepository;
    inventoryRepository: InventoryRepository;
};

export async function obtainStand(userId: string, deps: Deps): Promise<ObtainResult> {
    const hasArrow = await deps.inventoryRepository.removeItem(userId, "flecha-de-stand");
    if (!hasArrow) return { status: "no_arrow" };

    const stands = await deps.infoRepository.findAll();
    if (stands.length === 0) return { status: "no_stands" };

    const { selected } = selectWeighted(stands, (s) => s.id, (s) => s.weight);

    const canBeShiny = selected.can_be_shiny && SHINY_RARITIES.includes(selected.rarity);
    const shiny = canBeShiny && Math.random() < SHINY_RATE;

    const stand = await deps.standRepository.create({
        stand_id: selected.id,
        name: selected.name,
        rarity: selected.rarity,
        shiny,
        user: userId,
    });

    return { status: "obtained", stand };
}
