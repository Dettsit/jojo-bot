import { obtainStand } from "@domain/obtain/obtainStand.ts";
import type { InfoStandRepository } from "@domain/stand/ports/infoRepository.ts";
import type { StandRepository } from "@domain/stand/ports/standRepository.ts";
import type { InventoryRepository } from "@domain/stand/ports/inventoryRepository.ts";
import { RARITY_LABEL } from "@domain/stand/stand.types.ts";

type Deps = {
    infoRepository: InfoStandRepository;
    standRepository: StandRepository;
    inventoryRepository: InventoryRepository;
};

export async function handleObterStand(userId: string, deps: Deps): Promise<{ description: string; ephemeral: boolean }> {
    const result = await obtainStand(userId, deps);

    if (result.status === "no_arrow") {
        return {
            description: "Você não tem uma 🏹 **Flecha de Stand**. Aguarde uma aparecer no canal e use **/pegar**!",
            ephemeral: true,
        };
    }

    if (result.status === "no_stands") {
        return {
            description: "Nenhuma Stand disponível no momento.",
            ephemeral: true,
        };
    }

    const { stand } = result;
    const shinyTag = stand.shiny ? " ✨" : "";
    const rarity = RARITY_LABEL[stand.rarity];

    return {
        description: [
            `<@${userId}> foi perfurado pela Flecha de Stand!`,
            "",
            `**${stand.name}${shinyTag}**`,
            `Raridade: ${rarity}`,
        ].join("\n"),
        ephemeral: false,
    };
}
