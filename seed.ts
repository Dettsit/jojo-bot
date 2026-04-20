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
    // ── Parte 3: Stardust Crusaders ────────────────────────────────────────────
    { id: "star-platinum", name: "Star Platinum", part: 3, rarity: "legendary", weight: 1, can_be_shiny: true, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/5/57/Star_Platinum_Anime.png" },
    { id: "the-world", name: "The World", part: 3, rarity: "legendary", weight: 1, can_be_shiny: true, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/c/c0/The_World_Anime.png" },
    { id: "hierophant-green", name: "Hierophant Green", part: 3, rarity: "rare", weight: 15, can_be_shiny: true, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/2/2e/Hierophant_Green_Anime.png" },
    { id: "silver-chariot", name: "Silver Chariot", part: 3, rarity: "rare", weight: 15, can_be_shiny: true, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/e/ec/Silver_Chariot_Anime.png" },
    { id: "magicians-red", name: "Magician's Red", part: 3, rarity: "rare", weight: 15, can_be_shiny: true, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/6/6f/Magicians_Red_Anime.png" },
    { id: "hermit-purple", name: "Hermit Purple", part: 3, rarity: "uncommon", weight: 40, can_be_shiny: false, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/5/5b/Hermit_Purple_Anime.png" },
    { id: "strength", name: "Strength", part: 3, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/1/1e/Strength_Anime.png" },
    { id: "justice", name: "Justice", part: 3, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/d/d9/Justice_Anime.png" },
    { id: "ebony-devil", name: "Ebony Devil", part: 3, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/a/a5/Ebony_Devil_Anime.png" },
    { id: "dark-blue-moon", name: "Dark Blue Moon", part: 3, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/7/7e/Dark_Blue_Moon_Anime.png" },

    // ── Parte 4: Diamond is Unbreakable ────────────────────────────────────────
    { id: "crazy-diamond", name: "Crazy Diamond", part: 4, rarity: "epic", weight: 5, can_be_shiny: true, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/8/8a/Crazy_Diamond_Anime.png" },
    { id: "killer-queen", name: "Killer Queen", part: 4, rarity: "epic", weight: 5, can_be_shiny: true, can_evolve: true, evolution_item: "arrow-bites", image: "https://static.wikia.nocookie.net/jjba/images/f/fc/Killer_Queen_Anime.png" },
    { id: "the-hand", name: "The Hand", part: 4, rarity: "rare", weight: 15, can_be_shiny: true, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/5/55/The_Hand_Anime.png" },
    { id: "highway-star", name: "Highway Star", part: 4, rarity: "uncommon", weight: 40, can_be_shiny: false, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/b/b1/Highway_Star_Anime.png" },

    // ── Parte 5: Golden Wind ────────────────────────────────────────────────────
    { id: "gold-experience-requiem", name: "Gold Experience Requiem", part: 5, rarity: "legendary", weight: 1, can_be_shiny: true, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/3/3c/Gold_Experience_Requiem_Anime.png" },
    { id: "king-crimson", name: "King Crimson", part: 5, rarity: "epic", weight: 5, can_be_shiny: true, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/4/4e/King_Crimson_Anime.png" },
    { id: "sticky-fingers", name: "Sticky Fingers", part: 5, rarity: "epic", weight: 5, can_be_shiny: true, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/0/03/Sticky_Fingers_Anime.png" },
    { id: "sex-pistols", name: "Sex Pistols", part: 5, rarity: "uncommon", weight: 40, can_be_shiny: false, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/b/b2/Sex_Pistols_Anime.png" },
    { id: "moody-blues", name: "Moody Blues", part: 5, rarity: "uncommon", weight: 40, can_be_shiny: false, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/3/3d/Moody_Blues_Anime.png" },

    // ── Parte 6: Stone Ocean ────────────────────────────────────────────────────
    { id: "made-in-heaven", name: "Made in Heaven", part: 6, rarity: "legendary", weight: 1, can_be_shiny: true, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/9/9a/Made_in_Heaven_Anime.png" },
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
