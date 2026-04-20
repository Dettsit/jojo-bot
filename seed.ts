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
    { id: "anubis", name: "Anubis", part: 3, rarity: "epic", weight: 25, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/6/64/latest/20220916183812/Anubis_Infobox_Anime.png" },
    { id: "atum", name: "Atum", part: 3, rarity: "rare", weight: 60, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/5/50/latest/20211114224746/Atum_Infobox_Anime.png" },
    { id: "bastet", name: "Bastet", part: 3, rarity: "uncommon", weight: 75, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/d/dd/latest/20211010231924/Bastet_Infobox_Anime.png" },
    { id: "cream", name: "Cream", part: 3, rarity: "legendary", weight: 5, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/7/7f/latest/20220916193130/Cream_Infobox_Anime.png" },
    { id: "dark-blue-moon", name: "Dark Blue Moon", part: 3, rarity: "rare", weight: 60, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/7/73/latest/20251210224929/OraDora_Dark_Blue_Moon_1.png" },
    { id: "death-13", name: "Death 13", part: 3, rarity: "legendary", weight: 5, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/b/be/latest/20221008023351/Death_Thirteen_Infobox_Anime.png" },
    { id: "ebony-devil", name: "Ebony Devil", part: 3, rarity: "uncommon", weight: 75, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/7/77/latest/20220920020932/Ebony_Devil_Infobox_Anime.png" },
    { id: "emperor", name: "Emperor", part: 3, rarity: "uncommon", weight: 75, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/5/5d/latest/20220917022257/Emperor_Infobox_Anime.png" },
    { id: "empress", name: "Empress", part: 3, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/c/c9/latest/20220917233428/Empress_Infobox_Anime.png" },
    { id: "the-fool", name: "The Fool", part: 3, rarity: "epic", weight: 25, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/1/10/latest/20210312225357/The_Fool_Infobox_Anime.png" },
    { id: "geb", name: "Geb", part: 3, rarity: "rare", weight: 60, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/2/26/latest/20220922192352/Geb_Infobox_Anime.png" },
    { id: "hanged-man", name: "Hanged Man", part: 3, rarity: "epic", weight: 25, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/1/1f/latest/20220917022046/Hanged_Man_Infobox_Anime.png " },
    { id: "hermit-purple", name: "Hermit Purple", part: 3, rarity: "common", weight: 100, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/0/0a/latest/20220922193045/Hermit_Purple_SC_Infobox_Anime.png" },
    { id: "hierophant-green", name: "Hierophant Green", part: 3, rarity: "epic", weight: 25, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/3/3e/latest/20210616200106/Hierophant_Green_Infobox_Anime.png" },
    { id: "high-priestess", name: "High Priestess", part: 3, rarity: "uncommon", weight: 75, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/1/1f/latest/20220920014856/High_Priestess_Infobox_Anime.png" },
    { id: "horus", name: "Horus", part: 3, rarity: "epic", weight: 25, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/d/d7/latest/20221008021726/Horus_Infobox_Anime.png" },
    { id: "judgement", name: "Judgement", part: 3, rarity: "incommon", weight: 75, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/a/af/latest/20220920211919/Judgement_Infobox_Anime.png" },
    { id: "justice", name: "Justice", part: 3, rarity: "epic", weight: 25, can_be_shiny: true, can_evolve: false, image: "https://i.ibb.co/Kc61jqpt/image.png" },
    { id: "khnum", name: "Khnum", part: 3, rarity: "uncommon", weight: 75, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/1/1c/latest/20220920014323/Khnum_Infobox_Anime.png" },
    { id: "lovers", name: "Lovers", part: 3, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/4/4a/latest/20220917022801/Lovers_Infobox_Anime.png" },
    { id: "magicians-red", name: "Magician's Red", part: 3, rarity: "epic", weight: 25, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/4/40/latest/20210725004739/Magician's_Red_Appearance.png" },
    { id: "osiris", name: "Osiris", part: 3, rarity: "uncommon", weight: 75, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/a/ae/latest/20221008021422/Osiris_Infobox_Anime.png" },
    { id: "sethan", name: "Sethan", part: 3, rarity: "uncommon", weight: 75, can_be_shiny: false, can_evolve: false, image: "https://i.ibb.co/p9VyV5z/image.png" },
    { id: "silver-chariot", name: "Silver Chariot", part: 3, rarity: "legendary", weight: 5, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/8/80/latest/20251210223654/OraDora_Silver_Chariot_1.png" },
    { id: "star-platinum", name: "Star Platinum", part: 3, rarity: "legendary", weight: 5, can_be_shiny: true, can_evolve: true, image: "https://static.jojowiki.com/images/7/72/latest/20250929180209/OraDora_Star_Platinum_1.png" },
    { id: "strength", name: "Strength", part: 3, rarity: "rare", weight: 60, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/b/ba/latest/20230206194005/Strength_Infobox_Anime.png" },
    { id: "sun", name: "Sun", part: 3, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/f/fd/latest/20221008023104/Sun_Infobox_Anime.png" },
    { id: "tenore sax", name: "Tenore Sax", part: 3, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://i.ibb.co/WWPvMZJx/image.png" },
    { id: "tohth", name: "Tohth", part: 3, rarity: "uncommon", weight: 75, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/0/09/latest/20211010231309/Tohth_Infobox_Anime.png" },
    { id: "tower-of-gray", name: "Tower of Gray", part: 3, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/c/c2/latest/20220917233012/Tower_of_Gray_Infobox_Anime.png" },
    { id: "the-world", name: "The World", part: 3, rarity: "legendary", weight: 5, can_be_shiny: true, can_evolve: true, image: "https://static.jojowiki.com/images/8/8d/latest/20251210224158/OraDora_The_World_1.png" },
    { id: "wheel-of-fortune", name: "Wheel of Fortune", part: 3, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/b/b7/latest/20221008022642/Wheel_of_Fortune_Infobox_Anime.png" },
    { id: "yellow-temperance", name: "Yellow Temperance", part: 3, rarity: "uncommon", weight: 75, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/3/38/latest/20220917234459/Yellow_Temperance_Infobox_Anime.png" },
    
    // ── Parte 4: Diamond is Unbreakable ────────────────────────────────────────
    { id: "atchung-baby", name: "Achtung Baby", part: 4, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://i.ibb.co/qYq5FQCS/image.png" },
    { id: "crazy-diamond", name: "Crazy Diamond", part: 4, rarity: "epic", weight: 5, can_be_shiny: true, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/8/8a/Crazy_Diamond_Anime.png" },
    { id: "highway-star", name: "Highway Star", part: 4, rarity: "uncommon", weight: 40, can_be_shiny: false, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/b/b1/Highway_Star_Anime.png" },
    { id: "killer-queen", name: "Killer Queen", part: 4, rarity: "epic", weight: 5, can_be_shiny: true, can_evolve: true, evolution_item: "arrow-bites", image: "https://static.wikia.nocookie.net/jjba/images/f/fc/Killer_Queen_Anime.png" },
    { id: "the-hand", name: "The Hand", part: 4, rarity: "rare", weight: 15, can_be_shiny: true, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/5/55/The_Hand_Anime.png" },

    // ── Parte 5: Golden Wind ────────────────────────────────────────────────────
    { id: "gold-experience-requiem", name: "Gold Experience Requiem", part: 5, rarity: "legendary", weight: 1, can_be_shiny: true, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/3/3c/Gold_Experience_Requiem_Anime.png" },
    { id: "king-crimson", name: "King Crimson", part: 5, rarity: "epic", weight: 5, can_be_shiny: true, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/4/4e/King_Crimson_Anime.png" },
    { id: "moody-blues", name: "Moody Blues", part: 5, rarity: "uncommon", weight: 40, can_be_shiny: false, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/3/3d/Moody_Blues_Anime.png" },
    { id: "sex-pistols", name: "Sex Pistols", part: 5, rarity: "uncommon", weight: 40, can_be_shiny: false, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/b/b2/Sex_Pistols_Anime.png" },
    { id: "sticky-fingers", name: "Sticky Fingers", part: 5, rarity: "epic", weight: 5, can_be_shiny: true, can_evolve: false, image: "https://static.wikia.nocookie.net/jjba/images/0/03/Sticky_Fingers_Anime.png" },

    // ── Parte 6: Stone Ocean ────────────────────────────────────────────────────
    
    
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
