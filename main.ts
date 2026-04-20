import "@infra/telemetry.ts";
import { handleInteraction } from "@infra/discord/interactions/handler.ts";
import { handleApi } from "@infra/http/handler.ts";
import { itemAnnouncer, itemRepository, activeStandRepository, standAnnouncer, infoRepository } from "@config/container.ts";
import { spawnItem } from "@domain/spawn/spawn.ts";
import { spawnStand } from "@domain/spawn/spawnStand.ts";
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

Deno.cron("Spawn routine", "* 0-3,10-23 * * *", async () => {
    log.info("tick");

    await traced("cron.spawn", async () => {
        const standRepo = activeStandRepository();
        const itemRepo = itemRepository();

        const [standState, itemState] = await Promise.all([
            standRepo.last(),
            itemRepo.last(),
        ]);

        if (standState.value) {
            const result = await spawnStand({
                announcer: standAnnouncer(),
                repository: standRepo,
                infoRepository: infoRepository(),
            });
            if (result.status === "ran-away") log.info(`stand ran away: ${result.stand}`);
            return;
        }

        if (itemState.value) {
            const result = await spawnItem({
                announcer: itemAnnouncer(),
                repository: itemRepo,
            });
            if (result.status === "ran-away") log.info(`item ran away: ${result.item}`);
            return;
        }

        const standResult = await spawnStand({
            announcer: standAnnouncer(),
            repository: standRepo,
            infoRepository: infoRepository(),
        });

        if (standResult.status === "spawned") {
            log.info(`stand spawned: ${standResult.stand}`);
            return;
        }

        if (standResult.status === "skipped") {
            log.info("stand skipped", {
                probability: `${(standResult.probability * 100).toFixed(1)}%`,
                elapsed: `${Math.round(standResult.elapsedMs / 1000)}s`,
            });
        }

        const itemResult = await spawnItem({
            announcer: itemAnnouncer(),
            repository: itemRepo,
        });

        switch (itemResult.status) {
            case "skipped":
                log.info("item skipped", {
                    probability: `${(itemResult.probability * 100).toFixed(1)}%`,
                    elapsed: `${Math.round(itemResult.elapsedMs / 1000)}s`,
                });
                break;
            case "spawned":
                log.info(`item spawned: ${itemResult.item}`);
                break;
        }
    }).catch((e) => {
        log.error("unhandled error", { error: String(e) });
    });
});
