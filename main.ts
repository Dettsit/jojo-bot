import "@infra/telemetry.ts";
import { handleInteraction } from "@infra/discord/interactions/handler.ts";
import { handleApi } from "@infra/http/handler.ts";
import { itemAnnouncer, itemRepository } from "@config/container.ts";
import { spawnItem } from "@domain/spawn/spawn.ts";
import { logger } from "@infra/logger.ts";
import { traced, tracer } from "@infra/telemetry.ts";

const log = logger("cron:spawn");

Deno.serve((req) => {
    const url = new URL(req.url);

    if (url.pathname === "/interactions") {
        const span = tracer.startSpan("interaction");
        return handleInteraction(req, span);
    }
    if (url.pathname.startsWith("/api")) return handleApi(req);
    if (url.pathname === "/health") return Response.json({ ok: true });

    return new Response("Not found", { status: 404 });
});

Deno.cron("Item spawn routine", "* 0-3,10-23 * * *", async () => {
    log.info("tick");

    await traced("cron.spawn", async () => {
        const result = await spawnItem({
            announcer: itemAnnouncer(),
            repository: itemRepository(),
        });

        switch (result.status) {
            case "skipped":
                log.info("skipped", {
                    probability: `${(result.probability * 100).toFixed(1)}%`,
                    elapsed: `${Math.round(result.elapsedMs / 1000)}s`,
                });
                break;
            case "ran-away":
                log.info(`ran away: ${result.item}`);
                break;
            case "spawned":
                log.info(`spawned: ${result.item}`);
                break;
        }
    }).catch((e) => {
        log.error("unhandled error", { error: String(e) });
    });
});
