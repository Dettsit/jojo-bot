import { UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import type { InventoryRepository } from "@domain/stand/ports/inventoryRepository.ts";
import type { ItemType } from "@domain/item/item.types.ts";
import { dynamo } from "@config/dynamo.ts";
import { env } from "@config/env.ts";
import { traced } from "@infra/telemetry.ts";

export function createInventoryRepository(): InventoryRepository {
    return {
        async addItem(userId: string, type: ItemType): Promise<void> {
            await traced("dynamo.inventory.addItem", async () => {
                await dynamo.send(new UpdateCommand({
                    TableName: env.tableInventory,
                    Key: { pk: userId, sk: type },
                    UpdateExpression: "SET #count = if_not_exists(#count, :zero) + :inc",
                    ExpressionAttributeNames: { "#count": "count" },
                    ExpressionAttributeValues: { ":inc": 1, ":zero": 0 },
                }));
            });
        },

        async removeItem(userId: string, type: ItemType): Promise<boolean> {
            return traced("dynamo.inventory.removeItem", async () => {
                try {
                    await dynamo.send(new UpdateCommand({
                        TableName: env.tableInventory,
                        Key: { pk: userId, sk: type },
                        UpdateExpression: "SET #count = #count - :dec",
                        ConditionExpression: "#count > :zero",
                        ExpressionAttributeNames: { "#count": "count" },
                        ExpressionAttributeValues: { ":dec": 1, ":zero": 0 },
                    }));
                    return true;
                } catch (e) {
                    if ((e as { name: string }).name === "ConditionalCheckFailedException") return false;
                    throw e;
                }
            });
        },

        async getCount(userId: string, type: ItemType): Promise<number> {
            return traced("dynamo.inventory.getCount", async () => {
                const result = await dynamo.send(new GetCommand({
                    TableName: env.tableInventory,
                    Key: { pk: userId, sk: type },
                }));
                return result.Item?.count ?? 0;
            });
        },
    };
}
