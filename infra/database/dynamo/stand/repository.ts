import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import type { StandRepository } from "@domain/stand/ports/standRepository.ts";
import type { OwnedStand } from "@domain/stand/stand.types.ts";
import { dynamo } from "@config/dynamo.ts";
import { env } from "@config/env.ts";
import { traced } from "@infra/telemetry.ts";

export function createStandRepository(): StandRepository {
    return {
        async create(stand): Promise<OwnedStand> {
            return traced("dynamo.stand.create", async () => {
                const id = crypto.randomUUID();
                const created_at = new Date();

                await dynamo.send(new PutCommand({
                    TableName: env.tableOwnedStands,
                    Item: { PK: stand.user, SK: id, ...stand, created_at: created_at.toISOString() },
                }));

                return { ...stand, created_at };
            });
        },

        async findByUser(userId: string): Promise<OwnedStand[]> {
            return traced("dynamo.stand.findByUser", async () => {
                const result = await dynamo.send(new QueryCommand({
                    TableName: env.tableOwnedStands,
                    KeyConditionExpression: "PK = :pk",
                    ExpressionAttributeValues: { ":pk": userId },
                }));

                return (result.Items ?? []).map((item) => ({
                    stand_id: item.stand_id,
                    name: item.name,
                    rarity: item.rarity,
                    shiny: item.shiny,
                    user: item.PK,
                    created_at: new Date(item.created_at),
                })) as OwnedStand[];
            });
        },
    };
}
