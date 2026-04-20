import { PutCommand, CreateTableCommand, ListTablesCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "@config/dynamo.ts";
import { env } from "@config/env.ts";

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

async function ensureTable() {
    const { TableNames } = await dynamo.send(new ListTablesCommand({}));
    if (TableNames?.includes(env.tableInfoStands)) return;

    await dynamo.send(new CreateTableCommand({
        TableName: env.tableInfoStands,
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
        BillingMode: "PAY_PER_REQUEST",
    }));

    console.log(`Tabela ${env.tableInfoStands} criada.`);
}

await ensureTable();

for (const stand of stands) {
    await dynamo.send(new PutCommand({
        TableName: env.tableInfoStands,
        Item: stand,
    }));
    console.log(`Inserido: ${stand.name}`);
}

console.log("Seed concluído.");
Deno.exit(0);
