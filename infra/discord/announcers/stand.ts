import { env } from "@config/env.ts";
import type { StandAnnouncer } from "@domain/stand/ports/announcer.ts";
import type { ActiveStand } from "@domain/stand/ports/activeStandRepository.ts";
import { RARITY_LABEL } from "@domain/stand/stand.types.ts";
import { traced } from "@infra/telemetry.ts";

async function post(body: object): Promise<void> {
    await traced("discord.post", async () => {
        const res = await fetch(`https://discord.com/api/v10/channels/${env.discordChannelId}/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bot ${env.discordBotToken}`,
            },
            body: JSON.stringify(body),
        });
        if (!res.ok) console.error(`Discord post failed: ${res.status} ${await res.text()}`);
    });
}

async function announceAppear(stand: ActiveStand): Promise<void> {
    if (!stand.value) return;

    const { name, rarity, image } = stand.value;

    await post({
        embeds: [{
            color: 0x9b59b6,
            title: `Uma Stand apareceu!`,
            description: `**${name}**\nRaridade: ${RARITY_LABEL[rarity]}\n\nDigite **/obter-stand** para reclamá-la!`,
            image: { url: image },
        }],
    });
}

async function announceRunAway(stand: ActiveStand): Promise<void> {
    if (!stand.value) return;

    const { name } = stand.value;

    await post({
        embeds: [{
            color: 0x7f8c8d,
            description: `A Stand **${name}** desapareceu sem ser reclamada...`,
        }],
    });
}

export function createStandAnnouncer(): StandAnnouncer {
    return { announceAppear, announceRunAway };
}
