import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient, CreateTableCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { dynamo } from "@config/dynamo.ts";
import { env } from "@config/env.ts";

const rawClient = new DynamoDBClient({
    region: env.awsRegion,
    ...(env.dynamoEndpoint ? { endpoint: env.dynamoEndpoint } : {}),
    credentials: { accessKeyId: env.awsAccessKeyId, secretAccessKey: env.awsSecretAccessKey },
});

const stands = [
    // Lendárias
    { id: "star-platinum", name: "Star Platinum", rarity: "legendary", weight: 1, can_be_shiny: true, can_evolve: false },
    { id: "the-world", name: "The World", rarity: "legendary", weight: 1, can_be_shiny: true, can_evolve: false },
    { id: "gold-experience-requiem", name: "Gold Experience Requiem", rarity: "legendary", weight: 1, can_be_shiny: true, can_evolve: false },
    { id: "made-in-heaven", name: "Made in Heaven", rarity: "legendary", weight: 1, can_be_shiny: true, can_evolve: false },

    // Épicas
    { id: "crazy-diamond", name: "Crazy Diamond", rarity: "epic", weight: 5, can_be_shiny: true, can_evolve: false },
    { id: "king-crimson", name: "King Crimson", rarity: "epic", weight: 5, can_be_shiny: true, can_evolve: false },
    { id: "sticky-fingers", name: "Sticky Fingers", rarity: "epic", weight: 5, can_be_shiny: true, can_evolve: false },
    { id: "killer-queen", name: "Killer Queen", rarity: "epic", weight: 5, can_be_shiny: true, can_evolve: true, evolution_item: "arrow-bites" },

    // Raras
    { id: "hierophant-green", name: "Hierophant Green", rarity: "rare", weight: 15, can_be_shiny: true, can_evolve: false },
    { id: "silver-chariot", name: "Silver Chariot", rarity: "rare", weight: 15, can_be_shiny: true, can_evolve: false },
    { id: "magicians-red", name: "Magician's Red", rarity: "rare", weight: 15, can_be_shiny: true, can_evolve: false },
    { id: "the-hand", name: "The Hand", rarity: "rare", weight: 15, can_be_shiny: true, can_evolve: false },

    // Incomuns
    { id: "hermit-purple", name: "Hermit Purple", rarity: "uncommon", weight: 40, can_be_shiny: false, can_evolve: false },
    { id: "sex-pistols", name: "Sex Pistols", rarity: "uncommon", weight: 40, can_be_shiny: false, can_evolve: false },
    { id: "moody-blues", name: "Moody Blues", rarity: "uncommon", weight: 40, can_be_shiny: false, can_evolve: false },
    { id: "highway-star", name: "Highway Star", rarity: "uncommon", weight: 40, can_be_shiny: false, can_evolve: false },

    // Comuns
    { id: "strength", name: "Strength", rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false },
    { id: "justice", name: "Justice", rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false },
    { id: "ebony-devil", name: "Ebony Devil", rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false },
    { id: "dark-blue-moon", name: "Dark Blue Moon", rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false },
];

async function ensureTable(name: string, keys: { hash: string; range?: string }) {
    const { TableNames } = await rawClient.send(new ListTablesCommand({}));
    if (TableNames?.includes(name)) return;

    const keySchema = [{ AttributeName: keys.hash, KeyType: "HASH" as const }];
    const attrDefs = [{ AttributeName: keys.hash, AttributeType: "S" as const }];

    if (keys.range) {
        keySchema.push({ AttributeName: keys.range, KeyType: "RANGE" as const });
        attrDefs.push({ AttributeName: keys.range, AttributeType: "S" as const });
    }

    await rawClient.send(new CreateTableCommand({
        TableName: name,
        KeySchema: keySchema,
        AttributeDefinitions: attrDefs,
        BillingMode: "PAY_PER_REQUEST",
    }));

    console.log(`Tabela ${name} criada.`);
}

await ensureTable(env.tableInfoStands, { hash: "id" });
await ensureTable(env.tableOwnedStands, { hash: "pk", range: "sk" });
await ensureTable(env.tableInventory, { hash: "pk", range: "sk" });

for (const stand of stands) {
    await dynamo.send(new PutCommand({
        TableName: env.tableInfoStands,
        Item: stand,
    }));
    console.log(`Inserido: ${stand.name}`);
}

console.log("Seed concluído.");
Deno.exit(0);
