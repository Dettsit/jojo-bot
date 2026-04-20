import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import type { InfoStandRepository } from "@domain/stand/ports/infoRepository.ts";
import type { InfoStand } from "@domain/stand/stand.types.ts";
import { dynamo } from "@config/dynamo.ts";
import { env } from "@config/env.ts";
import { traced } from "@infra/telemetry.ts";

export function createInfoStandRepository(): InfoStandRepository {
    return {
        async findAll(): Promise<InfoStand[]> {
            return traced("dynamo.infoStand.findAll", async () => {
                const result = await dynamo.send(new ScanCommand({
                    TableName: env.tableInfoStands,
                }));
                return (result.Items ?? []) as InfoStand[];
            });
        },
    };
}
