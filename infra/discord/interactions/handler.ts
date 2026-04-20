import {
    InteractionType,
    InteractionResponseType,
    verifyKey,
} from "discord-interactions";

import { context, trace, SpanStatusCode, type Span } from "npm:@opentelemetry/api";
import { env } from "@config/env.ts";
import { traced } from "@infra/telemetry.ts";
import { handlePegar } from "@messages/pegar/handle.ts";
import { handleObterStand } from "@messages/obter-stand/handle.ts";
import { itemRepository, inventoryRepository, infoRepository, standRepository } from "@config/container.ts";

export async function handleInteraction(req: Request, span: Span): Promise<Response> {
    if (req.method !== "POST") {
        span.end();
        return new Response("Method Not Allowed", { status: 405 });
    }

    const signature = req.headers.get("X-Signature-Ed25519");
    const timestamp = req.headers.get("X-Signature-Timestamp");
    const body = await req.text();

    if (!signature || !timestamp) {
        span.end();
        return new Response("Bad Request", { status: 400 });
    }

    const verified = await verifyKey(body, signature, timestamp, env.discordPublicKey);
    if (!verified) {
        span.end();
        return new Response("Unauthorized", { status: 401 });
    }

    const interaction = JSON.parse(body);

    if (interaction.type === InteractionType.PING) {
        span.end();
        return Response.json({ type: InteractionResponseType.PONG });
    }

    const userId = interaction.member?.user?.id ?? interaction.user?.id;
    if (!userId) {
        span.end();
        return new Response("Bad Request", { status: 400 });
    }

    if (interaction.type === InteractionType.APPLICATION_COMMAND && interaction.data?.name === "ping") {
        span.end();
        return Response.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: "pong", flags: 64 },
        });
    }

    if (interaction.type === InteractionType.APPLICATION_COMMAND && interaction.data?.name === "pegar") {
        const token = interaction.token as string;
        const appId = interaction.application_id as string;

        const ctx = trace.setSpan(context.active(), span);
        queueMicrotask(context.bind(ctx, async () => {
            try {
                await traced("interaction.pegar", async () => {
                    const result = await handlePegar(userId, {
                        itemRepository: itemRepository(),
                        inventoryRepository: inventoryRepository(),
                    });

                    const description = result.status === "no_item"
                        ? "Nenhum item disponível no momento."
                        : `<@${userId}> coletou ${result.emoji} **${result.label}**!`;

                    await fetch(`https://discord.com/api/v10/webhooks/${appId}/${token}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            embeds: [{ color: 0xc0392b, description }],
                        }),
                    });
                });
                span.setStatus({ code: SpanStatusCode.OK });
            } catch (e) {
                console.error({ interaction, e });
                span.recordException(e as Error);
                span.setStatus({ code: SpanStatusCode.ERROR, message: String(e) });
                await fetch(`https://discord.com/api/v10/webhooks/${appId}/${token}/messages/@original`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: "Erro ao executar /pegar." }),
                }).catch(() => { });
            } finally {
                span.end();
            }
        }));

        return Response.json({
            type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
            data: { flags: 0 },
        });
    }

    if (interaction.type === InteractionType.APPLICATION_COMMAND && interaction.data?.name === "obter-stand") {
        const token = interaction.token as string;
        const appId = interaction.application_id as string;

        const ctx = trace.setSpan(context.active(), span);
        queueMicrotask(context.bind(ctx, async () => {
            try {
                await traced("interaction.obter-stand", async () => {
                    const { description, ephemeral } = await handleObterStand(userId, {
                        infoRepository: infoRepository(),
                        standRepository: standRepository(),
                        inventoryRepository: inventoryRepository(),
                    });

                    await fetch(`https://discord.com/api/v10/webhooks/${appId}/${token}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            flags: ephemeral ? 64 : 0,
                            embeds: [{ color: 0xc0392b, description }],
                        }),
                    });
                });
                span.setStatus({ code: SpanStatusCode.OK });
            } catch (e) {
                console.error({ interaction, e });
                span.recordException(e as Error);
                span.setStatus({ code: SpanStatusCode.ERROR, message: String(e) });
                await fetch(`https://discord.com/api/v10/webhooks/${appId}/${token}/messages/@original`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: "Erro ao executar /obter-stand." }),
                }).catch(() => { });
            } finally {
                span.end();
            }
        }));

        return Response.json({
            type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
            data: { flags: 0 },
        });
    }

    span.end();
    return new Response("Not handled", { status: 400 });
}
