import { obtainStand } from "@domain/obtain/obtainStand.ts";
import type { ActiveStandRepository } from "@domain/stand/ports/activeStandRepository.ts";
import type { StandRepository } from "@domain/stand/ports/standRepository.ts";
import { RARITY_LABEL } from "@domain/stand/stand.types.ts";

type Deps = {
    activeStandRepository: ActiveStandRepository;
    standRepository: StandRepository;
};

export type ObterStandResult = {
    description: string;
    ephemeral: boolean;
    image?: string;
};

export async function handleObterStand(userId: string, deps: Deps): Promise<ObterStandResult> {
    const result = await obtainStand(userId, deps);

    if (result.status === "no_stand") {
        return {
            description: "Nenhuma Stand apareceu ainda. Aguarde uma aparecer no canal!",
            ephemeral: true,
        };
    }

    const { stand } = result;
    const shinyTag = stand.shiny ? " ✨" : "";
    const rarity = RARITY_LABEL[stand.rarity];

    return {
        description: [
            `<@${userId}> reclamou uma Stand!`,
            "",
            `**${stand.name}${shinyTag}**`,
            `Raridade: ${rarity}`,
        ].join("\n"),
        ephemeral: false,
        image: result.image,
    };
}
