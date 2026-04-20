import { GetCommand } from "@aws-sdk/lib-dynamodb";
import type { InfoShinyRepository } from "@domain/stand/ports/infoShinyRepository.ts";
import type { InfoShiny } from "@domain/stand/stand.types.ts";
import { dynamo } from "@config/dynamo.ts";
import { env } from "@config/env.ts";
import { traced } from "@infra/telemetry.ts";

export function createInfoShinyRepository(): InfoShinyRepository {
    return {
        async findById(id: string): Promise<InfoShiny | null> {
            return traced("dynamo.infoShiny.findById", async () => {
                const result = await dynamo.send(new GetCommand({
                    TableName: env.tableInfoStands,
                    Key: { id },
                }));
                return (result.Item as InfoShiny) ?? null;
            });
        },
    };
}
