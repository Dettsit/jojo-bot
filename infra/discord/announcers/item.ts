import { env } from "@config/env.ts";
import type { ItemAnnouncer } from "@domain/item/ports/announcer.ts";
import type { ActiveItem } from "@domain/item/item.types.ts";
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

async function announceAppear(item: ActiveItem): Promise<void> {
    if (!item.value) return;

    const { label, emoji } = item.value;

    await post({
        embeds: [{
            color: 0xc0392b,
            title: `${emoji} ${label} apareceu!`,
            description: "Digite **/pegar** para coletá-la antes que desapareça!",
        }],
    });
}

async function announceRunAway(item: ActiveItem): Promise<void> {
    if (!item.value) return;

    const { label, emoji } = item.value;

    await post({
        embeds: [{
            color: 0x7f8c8d,
            description: `A ${emoji} **${label}** desapareceu sem ser coletada...`,
        }],
    });
}

export function createItemAnnouncer(): ItemAnnouncer {
    return { announceAppear, announceRunAway };
}
