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
    { id: "achtung-baby", name: "Achtung Baby", part: 4, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://i.ibb.co/qYq5FQCS/image.png" },
    { id: "aqua-necklace", name: "Aqua Necklace", part: 4, rarity: "rare", weight: 60, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/7/74/latest/20251210234013/OraDora_Aqua_Necklace_1.png" },
    { id: "atom-heart-father", name: "Atom Heart Father", part: 4, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/0/00/latest/20220924230813/Atom_Heart_Father_Infobox_Anime.png" },
    { id: "bad-company", name: "Bad Company", part: 4, rarity: "uncommon", weight: 75, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/3/3f/latest/20191015213049/BadCompany_KeyArt.png" },
    { id: "boy-ii-man", name: "Boy II Man", part: 4, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/b/b9/latest/20191015220101/Boy_II_Man_Infobox_Anime.png" },
    { id: "cheap-trick", name: "Cheap Trick", part: 4, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/8/8e/latest/20250724150945/Cheap_Trick_Infobox_Anime.png" },
    { id: "cinderella", name: "Cinderella", part: 4, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/8/83/latest/20220924232818/Cinderella_KeyArt.png" },
    { id: "crazy-diamond", name: "Crazy Diamond", part: 4, rarity: "legendary", weight: 5, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/b/b5/latest/20191015215419/Crazy_Diamond_Infobox_Anime.png" },
    { id: "earth-wind-and-fire", name: "Earth, Wind and Fire", part: 4, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://i.ibb.co/hbzKsr8/image.png" },
    { id: "echoes", name: "Echoes", part: 4, rarity: "uncommon", weight: 75, can_be_shiny: true, can_evolve: true, image: "https://static.jojowiki.com/images/d/dc/latest/20210424210829/Echoes_ACT1_DU_Infobox_Anime.png" },
    { id: "enigma", name: "Enigma", part: 4, rarity: "rare", weight: 60, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/5/51/latest/20221010022748/Enigma_Infobox_Anime.png" },
    { id: "the-hand", name: "The Hand", part: 4, rarity: "epic", weight: 25, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/a/ae/latest/20210111150120/The_Hand_Infobox_Anime.png" },
    { id: "harvest", name: "Harvest", part: 4, rarity: "uncommon", weight: 75, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/7/73/latest/20220904041353/Harvest_Infobox_Anime.png" },
    { id: "heavens-door", name: "Heaven's Door", part: 4, rarity: "legendary", weight: 5, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/5/50/latest/20210203193008/Heaven's_Door_Infobox_Anime.png" },
    { id: "highway-star", name: "Highway Star", part: 4, rarity: "rare", weight: 60, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/0/07/latest/20230228171739/Highway_Star_Infobox_Anime.png" },
    { id: "killer-queen", name: "Killer Queen", part: 4, rarity: "legendary", weight: 5, can_be_shiny: true, can_evolve: true, image: "https://static.jojowiki.com/images/1/14/latest/20221020232023/Killer_Queen_Infobox_Anime.png" },
    { id: "the-lock", name: "The Lock", part: 4, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/5/5d/latest/20211012143104/The_Lock_Infobox_Anime.png" },
    { id: "love-deluxe", name: "Love Deluxe", part: 4, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://i.ibb.co/TBCjQRvM/image.png" },
    { id: "pearl-jam", name: "Pearl Jam", part: 4, rarity: "uncommon", weight: 75, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/7/70/latest/20250722142541/Pearl_Jam_Infobox_Anime.png" },
    { id: "ratt", name: "Ratt", part: 4, rarity: "rare", weight: 60, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/2/2a/latest/20191015215324/Ratt_Infobox_Anime.png" },
    { id: "red-hot-chili-peppers", name: "Red Hot Chili Peppers", part: 4, rarity: "epic", weight: 25, can_be_shiny: true, can_evolve: false, image: "https://i.ibb.co/PzZRxjz7/image.png" },
    { id: "stray-cat", name: "Stray Cat", part: 4, rarity: "uncommon", weight: 75, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/7/7d/latest/20220908212216/Stray_Cat_Original_Infobox_Anime.png" },
    { id: "surface", name: "Surface", part: 4, rarity: "rare", weight: 60, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/4/4a/latest/20220924233119/Surface_KeyArt.png" },

    // ── Parte 5: Golden Wind ────────────────────────────────────────────────────
    { id: "aerosmith", name: "Aerosmith", part: 5, rarity: "rare", weight: 60, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/7/7c/latest/20210701024635/Aerosmith_Infobox_Anime.png" },
    { id: "baby-face", name: "Baby Face", part: 5, rarity: "uncommon", weight: 75, can_be_shiny: false, can_evolve: true, image: "https://static.jojowiki.com/images/e/e3/latest/20250929202656/BabyFaceAnime.png" },
    { id: "beach-boy", name: "Beach Boy", part: 5, rarity: "rare", weight: 60, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/e/ec/latest/20241122152334/Beach_Boy_Infobox_Anime.png" },
    { id: "black-sabbath", name: "Black Sabbath", part: 5, rarity: "epic", weight: 25, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/1/17/latest/20220920220032/Black_Sabbath_Infobox_Anime.png" },
    { id: "clash", name: "Clash", part: 5, rarity: "rare", weight: 60, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/6/66/latest/20210208190621/Clash_Infobox_Anime.png" },
    { id: "gold-experience", name: "Gold Experience", part: 5, rarity: "legendary", weight: 5, can_be_shiny: true, can_evolve: true, image: "https://static.jojowiki.com/images/8/81/latest/20210707053105/Gold_Experience_Infobox_Anime.png" },
    { id: "the-grateful-dead", name: "The Greateful Dead", part: 5, rarity: "rare", weight: 60, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/2/29/latest/20250324140252/The_Grateful_Dead_Infobox_Anime.png" },
    { id: "green-day", name: "Green Day", part: 5, rarity: "epic", weight: 25, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/a/a4/latest/20230303153451/Green_Day_Infobox_Anime.png" },
    { id: "king-crimson", name: "King Crimson", part: 5, rarity: "legendary", weight: 5, can_be_shiny: true, can_evolve: true, image: "https://static.jojowiki.com/images/c/c6/latest/20241012182526/King_Crimson_Infobox_Anime.png" },
    { id: "kraft-work", name: "Kraft Work", part: 5, rarity: "uncommon", weight: 75, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/4/49/latest/20231109191433/Kraft_Work_Infobox_Anime.png" },
    { id: "little-feet", name: "Little Feet", part: 5, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/5/56/latest/20241122151845/Little_Feet_Infobox_Anime.png" },
    { id: "man-in-the-mirror", name: "Man in the Mirror", part: 5, rarity: "uncommon", weight: 75, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/e/eb/latest/20241122152028/Man_in_the_Mirror_Infobox_Anime.png" },
    { id: "metallica", name: "Metallica", part: 5, rarity: "legendary", weight: 5, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/1/15/latest/20191015215736/Metallicca.png" },
    { id: "moody-blues", name: "Moody Blues", part: 5, rarity: "uncommon", weight: 75, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/9/91/latest/20220916205647/Moody_Blues_Infobox_Anime.png" },
    { id: "mr-president", name: "Mr. President", part: 5, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://i.ibb.co/67G1cyft/image.png" },
    { id: "notorious-big", name: "Notorious B.I.G", part: 5, rarity: "rare", weight: 60, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/a/a4/latest/20191015214035/Notorious_B.I.G.png" },
    { id: "oasis", name: "Oasis", part: 5, rarity: "epic", weight: 25, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/0/06/latest/20241005192306/Oasis_Infobox_Anime.png" },
    { id: "purple-haze", name: "Purple Haze", part: 5, rarity: "epic", weight: 25, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/c/ca/latest/20191015214140/Purple_Haze_Infobox_Anime.png" },
    { id: "rolling-stones", name: "Rolling Stones", part: 5, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/d/d4/latest/20191015214110/Rolling_Stones_anime.png" },
    { id: "sex-pistols", name: "Sex Pistols", part: 5, rarity: "uncommon", weight: 75, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/b/b9/latest/20210521114106/Sex_Pistols_Infobox_Anime.png" },
    { id: "soft-machine", name: "Soft Machine", part: 5, rarity: "uncommon", weight: 75, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/6/69/latest/20240118150429/Soft_Machine_Infobox_Anime.png" },
    { id: "spice-girl", name: "Spice Girl", part: 5, rarity: "rare", weight: 60, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/2/21/latest/20200118002424/Spice_Girl_Infobox_Anime.png" },
    { id: "sticky-fingers", name: "Sticky Fingers", part: 5, rarity: "epic", weight: 25, can_be_shiny: true, can_evolve: true, image: "https://static.jojowiki.com/images/7/78/latest/20221006032155/Sticky_Fingers_Infobox_Anime.png" },
    { id: "talking-head", name: "Talking Head", part: 5, rarity: "uncommon", weight: 75, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/6/68/latest/20210719190437/Talking_Head_Infobox_Anime.png" },
    { id: "white-album", name: "White Album", part: 5, rarity: "rare", weight: 60, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/c/c0/latest/20221003162753/White_Album_Acrylic.png" },

    // ── Parte 6: Stone Ocean ────────────────────────────────────────────────────
    { id: "bohemian-rhapsody", name: "Bohemian Rhapsody", part: 6, rarity: "legendary", weight: 5, can_be_shiny: true, can_evolve: false, image: "https://i.ibb.co/0dFhcFr/image.png" },
    { id: "burning-down-the-house", name: "Burning Down the House", part: 6, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://i.ibb.co/LzyT8CYk/image.png" },
    { id: "diver-down", name: "Diver Down", part: 6, rarity: "epic", weight: 25, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/c/c6/latest/20230826110448/Diver_Down_Anime_Infobox.png" },
    { id: "dragons-dream", name: "Dragon's Dream", part: 6, rarity: "uncommon", weight: 75, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/2/2e/latest/20221002121518/Dragon's_Dream_Infobox_Anime.png" },
    { id: "foo-fighters", name: "Foo Fighters", part: 6, rarity: "rare", weight: 60, can_be_shiny: true, can_evolve: true, image: "https://static.jojowiki.com/images/3/37/latest/20220902190331/Foo_Fighters_Stand_Anime_Infobox.png" },
    { id: "goo-goo-dolls", name: "Goo Goo Dolls", part: 6, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/f/f1/latest/20211202072644/Goo_Goo_Dolls_Infobox_Anime.png" },
    { id: "green-green-grass-of-home", name: "Green, Green Grass of Home", part: 6, rarity: "rare", weight: 60, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/c/c0/latest/20221005175220/GGGoH_Render_1.png" },
    { id: "highway-to-hell", name: "Highway to Hell", part: 6, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/f/f3/latest/20211201174538/Highway_to_Hell_Infobox_Anime.png" },
    { id: "jail-house-lock", name: "Jail House Lock", part: 6, rarity: "epic", weight: 25, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/6/6f/latest/20220902181930/Jail_House_Lock_Infobox_Anime.png" },
    { id: "jumpin-jack-flash", name: "Jumpin' Jack Flash", part: 6, rarity: "uncommon", weight: 75, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/1/17/latest/20221030000457/Jumpin'_Jack_Flash_Infobox_Anime.png" },
    { id: "kiss", name: "KISS", part: 6, rarity: "rare", weight: 60, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/2/24/latest/20230826110958/Kiss_Infobox_Anime.png" },
    { id: "limp-bizkit", name: "Limp Bizkit", part: 6, rarity: "rare", weight: 60, can_be_shiny: true, can_evolve: false, image: "https://static.jojowiki.com/images/9/92/latest/20250721083820/Limp_Bizkit_Infobox_Anime.png" },
    { id: "manhattan-transfer", name: "Manhattan Transfer", part: 6, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/b/ba/latest/20211201170744/Manhattan_Transfer_Infobox_Anime.png" },
    { id: "marilyn-manson", name: "Marilyn Manson", part: 6, rarity: "uncommon", weight: 75, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/9/9d/latest/20211201173825/Marilyn_Manson_Infobox_Anime.png" },
    { id: "planet-waves", name: "Planet Waves", part: 6, rarity: "uncommon", weight: 75, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/e/ec/latest/20221125230133/Planet_Waves_Infobox_Anime.png" },
    { id: "sky-high", name: "Sky High", part: 6, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/6/6b/latest/20221201105503/Sky_High_Render_Appearance_Anime.png" },
    { id: "stone-free", name: "Stone Free", part: 6, rarity: "epic", weight: 25, can_be_shiny: true, can_evolve: true, image: "https://static.jojowiki.com/images/0/03/latest/20230826070709/Stone_Free_Infobox_Anime.png" },
    { id: "survivor", name: "Survivor", part: 6, rarity: "common", weight: 100, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/d/df/latest/20220901113058/Survivor_Render_1.png" },
    { id: "under-world", name: "Under World", part: 6, rarity: "uncommon", weight: 75, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/3/3d/latest/20251123210313/Under_World_Infobox_Anime.png" },
    { id: "weather-report", name: "Weather Report", part: 6, rarity: "legendary", weight: 5, can_be_shiny: true, can_evolve: true, image: "https://static.jojowiki.com/images/a/ac/latest/20230826110804/Weather_Report_Stand_Anime_Infobox.png" },
    { id: "whitesnake", name: "Whitesnake", part: 6, rarity: "legendary", weight: 5, can_be_shiny: true, can_evolve: true, image: "https://static.jojowiki.com/images/9/91/latest/20241001191051/Whitesnake_Infobox_Anime.png" },
    { id: "yo-yo-ma", name: "Yo-Yo-Ma", part: 6, rarity: "uncommon", weight: 75, can_be_shiny: false, can_evolve: false, image: "https://static.jojowiki.com/images/a/a5/latest/20221125230532/Yo-Yo_Ma_Infobox_Anime.png" },



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
