import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient, CreateTableCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { dynamo } from "@config/dynamo.ts";
import { env } from "@config/env.ts";

const rawClient = new DynamoDBClient({
    region: env.awsRegion,
    ...(env.dynamoEndpoint ? { endpoint: env.dynamoEndpoint } : {}),
    credentials: { accessKeyId: env.awsAccessKeyId, secretAccessKey: env.awsSecretAccessKey },
});

const shinies = [
    // ── Parte 3: Stardust Crusaders ────────────────────────────────────────────
    { id: "anubis-manga-shiny", image: "https://static.jojowiki.com/images/4/42/latest/20210712180008/Anubis_Appearance.png" },

    { id: "atum-manga-shiny", image: "https://static.jojowiki.com/images/1/1e/latest/20260411213852/Atum_Infobox_Manga.png" },

    { id: "cream-manga-shiny", image: "https://i.ibb.co/JRxxhqCP/image.png" },
    { id: "cream-asb-shiny", image: "https://static.jojowiki.com/images/f/f6/latest/20240722223746/Cream_ASB.png" },

    { id: "dark-blue-moon-manga-shiny", image: "https://i.ibb.co/Dg71pYGm/image.png" },

    { id: "death-13-manga-shiny", image: "https://static.jojowiki.com/images/5/52/latest/20231130182946/Death_Thirteen_Infobox_Manga.png" },
    { id: "death-13-chibi-shiny", image: "https://i.ibb.co/r2zcLrQf/image.png" },

    { id: "the-fool-manga-shiny", image: "https://static.jojowiki.com/images/f/f0/latest/20191015214051/The_Fool_Infobox_Manga.png" },
    { id: "the-fool-ova-shiny", image: "https://i.ibb.co/5XmhT70p/image.png" },
    { id: "the-fool-color-shift-shiny", image: "https://i.ibb.co/GQ20wxFf/image.png" },
    { id: "the-fool-asb-shiny", image: "https://static.jojowiki.com/images/b/be/latest/20191015214927/The_Fool_ASB.png" },
    { id: "the-fool-asbr-shiny", image: "https://static.jojowiki.com/images/0/09/latest/20220310014541/Iggy_ASB_R.png" },

    { id: "geb-manga-shiny", image: "https://static.jojowiki.com/images/3/34/latest/20220409163435/Geb_Infobox_Manga.png" },
    { id: "geb-ova-shiny", image: "https://static.jojowiki.com/images/7/78/latest/20231124215431/Geb_Infobox_OVA.png" },
    { id: "geb-color-shift-shiny", image: "https://i.ibb.co/JR7BnNXY/image.png" },

    { id: "hanged-man-manga-shiny", image: "https://static.jojowiki.com/images/2/26/latest/20220407125952/Hanged_Man_Infobox_Manga.png" },
    { id: "hanged-man-ova-shiny", image: "https://i.ibb.co/G450zT8d/image.png" },

    { id: "hermit-purple-manga-shiny", image: "https://i.ibb.co/qLhCxLfg/image.png" },
    { id: "hermit-purple-ova-shiny", image: "https://i.ibb.co/7dkCZNP7/image.png" },
    { id: "hermit-purple-part4-shiny", image: "https://i.ibb.co/bMFSg0qS/image.png" },

    { id: "hierophant-green-manga-shiny", image: "https://i.ibb.co/1fL1hrgm/image.png" },
    { id: "hierophant-green-ova-shiny", image: "https://i.ibb.co/vxjt2Sgn/image.png" },
    { id: "hierophant-green-color-shift-shiny", image: "https://i.ibb.co/B2dkqCBM/image.png" },
    { id: "hierophant-green-ora-ora-overdrive-shiny", image: "https://static.jojowiki.com/images/f/ff/latest/20250929180240/OraDora_Hierophant_Green_1.png" },

    { id: "horus-manga-shiny", image: "https://i.ibb.co/g18zDZn/image.png" },
    { id: "horus-asbr-shiny", image: "https://i.ibb.co/xSD3WHGZ/image.png" },

    { id: "judgement-manga-shiny", image: "https://i.ibb.co/Jhy9csP/image.png" },

    { id: "justice-manga-shiny", image: "https://i.ibb.co/wFBvNBjL/image.png" },

    { id: "magicians-red-manga-shiny", image: "https://i.ibb.co/V60nLC0/image.png" },
    { id: "magicians-red-ova-shiny", image: "https://i.ibb.co/JwLBXFBY/image.png" },
    { id: "magicians-red-asbr-shiny", image: "https://i.ibb.co/20mcKxHt/image.png" },
    { id: "magicians-red-eoh-shiny", image: "https://i.ibb.co/GfS2vnfY/image.png" },

    { id: "osiris-manga-shiny", image: "https://i.ibb.co/35ZbJHVT/image.png" },
    { id: "osiris-ova-shiny", image: "https://i.ibb.co/8D4QW0jw/image.png" },

    { id: "silver-chariot-manga-shiny", image: "https://i.ibb.co/RkK3HsmR/image.png" },
    { id: "silver-chariot-ova-shiny", image: "https://i.ibb.co/ZzbzgM8T/image.png" },
    { id: "silver-chariot-baby-chariot-shiny", image: "https://i.ibb.co/YTQLGjXS/image.png" },
    { id: "silver-chariot-part5-shiny", image: "https://i.ibb.co/cS4wSxvG/image.png" },

    { id: "star-platinum-manga-shiny", image: "https://i.ibb.co/6J7r25Bc/image.png" },
    { id: "star-platinum-ova-shiny", image: "https://i.ibb.co/bR1dKDG1/image.png" },
    { id: "star-platinum-color-shift-shiny", image: "https://i.ibb.co/Dg8g0j9g/image.png" },
    { id: "star-platinum-jaguar-shiny", image: "https://i.ibb.co/KjRfD20n/image.png" },
    { id: "star-platinum-silly-shiny", image: "https://i.ibb.co/KjqTwN4J/image.png" },
    { id: "star-platinum-part4-shiny", image: "https://i.ibb.co/jdqv54t/image.png" },
    { id: "star-platinum-eoh-shiny", image: "https://i.ibb.co/ks06N18g/image.png" },
    { id: "star-platinum-green-shiny", image: "https://i.ibb.co/bYk9R8X/image.png" },
    { id: "star-platinum-luffy-shiny", image: "https://i.ibb.co/mCHyZzDC/image.png" },

    { id: "strength-manga-shiny", image: "https://i.ibb.co/RpQYJ785/image.png" },

    { id: "the-world-manga-shiny", image: "https://static.jojowiki.com/images/f/f5/latest/20210424162912/The_World_Infobox_Manga.png" },
    { id: "the-world-ova-shiny", image: "https://static.jojowiki.com/images/c/ce/latest/20210117132044/The_World_Infobox_OVA.png" },
    { id: "the-world-color-shift-shiny", image: "https://i.ibb.co/rG2CXxKX/image.png" },
    { id: "the-world-greatest-high-shiny", image: "https://i.ibb.co/Y71RQyk6/image.png" },
    { id: "the-world-asb-shiny", image: "https://static.jojowiki.com/images/1/1f/latest/20220312070106/The_World_ASB.png" },

    { id: "yellow-temperance-manga-shiny", image: "https://i.ibb.co/21hZNSBv/image.png" },

    // ── Parte 4: Diamond is Unbreakable ────────────────────────────────────────
    { id: "aqua-necklace-manga-shiny", image: "https://static.jojowiki.com/images/7/74/latest/20260313220747/Aqua_Necklace_Infobox_Manga.png" },

    { id: "crazy-diamond-manga-shiny", image: "https://static.jojowiki.com/images/c/c5/latest/20200625184236/Crazy_Diamond_Infobox_Manga.png" },
    { id: "crazy-diamond-color-shift-shiny", image: "https://i.ibb.co/Fk2fDfp6/image.png" },
    { id: "crazy-diamond-asbr-shiny", image: "https://static.jojowiki.com/images/4/44/latest/20220312092514/CrazyDiamond_ASB.png" },
    { id: "crazy-diamond-eoh-shiny", image: "https://static.jojowiki.com/images/6/6e/latest/20240721031820/Crazy_Diamond_EoH.png" },

    { id: "echoes-manga-shiny", image: "https://static.jojowiki.com/images/d/db/latest/20230330014026/Echoes_ACT1_DU_Infobox_Manga.png" },

    { id: "enigma-manga-shiny", image: "https://static.jojowiki.com/images/2/28/latest/20220425061147/Enigma_Infobox_Manga.png" },

    { id: "the-hand-manga-shiny", image: "https://i.ibb.co/3yG5Jchx/image.png" },
    { id: "the-hand-color-shift-shiny", image: "https://i.ibb.co/cSvb7Vjz/image.png" },
    { id: "the-hand-asb-shiny", image: "https://static.jojowiki.com/images/6/6c/latest/20220312092915/The_Hand_ASB.png" },

    { id: "heavens-door-manga-shiny", image: "https://i.ibb.co/8JvVLPG/image.png" },
    { id: "heavens-door-ova-shiny", image: "https://i.ibb.co/Q7rDzPH4/image.png" },
    { id: "heavens-door-asb-shiny", image: "https://static.jojowiki.com/images/8/85/latest/20220312044130/Heaven's_Door_ASB.png" },
    { id: "heavens-door-eoh-shiny", image: "https://static.jojowiki.com/images/5/5d/latest/20240721044129/HeavensDoorEoH.png" },

    { id: "highway-star-manga-shiny", image: "https://static.jojowiki.com/images/0/0d/latest/20210513135001/Highway_Star_Infobox_Manga.png" },

    { id: "killer-queen-manga-shiny", image: "https://static.jojowiki.com/images/f/fb/latest/20210420222949/Killer_Queen_Infobox_Manga.png" },
    { id: "killer-queen-shadow-shiny", image: "https://i.ibb.co/k6qm3n35/image.png" },
    { id: "killer-queen-asbr-shiny", image: "https://static.jojowiki.com/images/2/28/latest/20240721180536/KiraYoshikage_KillerQueen_jojoeoh.png" },

    { id: "ratt-manga-shiny", image: "https://static.jojowiki.com/images/f/fe/latest/20220524212255/Ratt_Infobox_Manga.png" },
    { id: "ratt-chibi-shiny", image: "https://static.jojowiki.com/images/5/51/latest/20210501222221/BugEatenStandPPPFull.png" },

    { id: "red-hot-chili-peppers-manga-shiny", image: "https://static.jojowiki.com/images/6/6b/latest/20210716115856/RHCP_Infobox_Manga.png" },
    { id: "red-hot-chili-peppers-asb-shiny", image: "https://static.jojowiki.com/images/5/5c/latest/20240723065509/Red_Hot_Chili_Pepper_ASB.png" },
    { id: "red-hot-chili-peppers-eoh-shiny", image: "https://static.jojowiki.com/images/9/9f/latest/20240721173854/OtoishiAkira_RHCP_jojoeoh.png" },
    { id: "red-hot-chili-peppers-electro-shiny", image: "https://i.ibb.co/q8jQvdz/image.png" },

    { id: "surface-manga-shiny", image: "https://i.ibb.co/k23RzQNF/image.png" },

    // ── Parte 5: Golden Wind ────────────────────────────────────────────────────
    { id: "aerosmith-asb-shiny", image: "https://static.jojowiki.com/images/f/f8/latest/20240723054413/Aerosmith_AllStarBattle.png" },
    { id: "aerosmith-eoh-shiny", image: "https://static.jojowiki.com/images/b/b7/latest/20240721213458/Narancia_Aerosmith_jojoeoh.png" },

    { id: "beach-boy-manga-shiny", image: "https://static.jojowiki.com/images/8/8f/latest/20191127095125/Beach_Boy_Infobox_Manga.png" },
    { id: "beach-boy-fishing-rod-shiny", image: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/7/7f/Fishing_Rod_JE2_BE2.png/revision/latest?cb=20200201063839" },

    { id: "black-sabbath-manga-shiny", image: "https://static.jojowiki.com/images/3/38/latest/20191015213503/Black_Sabbath_Infobox_Manga.png" },
    { id: "black-sabbath-chibi-shiny", image: "https://static.jojowiki.com/images/b/ba/latest/20220929222821/PPP_BlackSabbath_Win.png" },

    { id: "clash-manga-shiny", image: "https://static.jojowiki.com/images/8/89/latest/20250722135646/Clash_Infobox_Manga.png" },

    { id: "gold-experience-manga-shiny", image: "https://static.jojowiki.com/images/2/28/latest/20241013015824/Gold_Experience_Infobox_Manga.png" },
    { id: "gold-experience-eoh-shiny", image: "https://static.jojowiki.com/images/b/bf/latest/20250109235229/MS_Gold_Experience.png" },
    { id: "gold-experience-ora-ora-overdrive-shiny", image: "https://static.jojowiki.com/images/b/b7/latest/20251210235045/OraDora_Gold_Experience_1.png" },

    { id: "the-grateful-dead-manga-shiny", image: "https://i.ibb.co/s9tFBK25/image.png" },

    { id: "green-day-manga-shiny", image: "https://static.jojowiki.com/images/b/b7/latest/20221026025215/Green_Day_Infobox_Manga.png" },

    { id: "king-crimson-manga-shiny", image: "https://i.ibb.co/qYxzp13d/image.png" },
    { id: "king-crimson-stardust-shooters-shiny", image: "https://static.jojowiki.com/images/1/11/latest/20260210082215/Unit_King_Crimson_(Technical_Tower_Battle).png" },
    { id: "king-crimson-eoh-shiny", image: "https://static.jojowiki.com/images/9/91/latest/20260131161305/OraDora_King_Crimson_1.png" },

    { id: "metallica-aura-farm-shiny", image: "https://static.jojowiki.com/images/c/c0/latest/20241122144847/Metallica_Infobox_Anime.png" },
    { id: "metallica-magneto-shiny", image: "https://i.ibb.co/35bKsLNY/image.png" },

    { id: "moody-blues-manga-shiny", image: "https://i.ibb.co/QvkBjwq6/image.png" },

    { id: "notorious-big-manga-shiny", image: "https://static.jojowiki.com/images/5/5e/latest/20230406144642/Notorious_B.I.G_Normal_Infobox_Manga.png" },

    { id: "oasis-big-head-shiny", image: "https://static.jojowiki.com/images/8/8c/latest/20220623001228/JH_Chara_P5_Secco.png" },

    { id: "purple-haze-manga-shiny", image: "https://static.jojowiki.com/images/8/82/latest/20210215173755/Purple_Haze_Infobox_Manga.png" },
    { id: "purple-haze-bw-shiny", image: "https://i.ibb.co/SD9PKLsp/image.png" },

    { id: "sex-pistols-manga-shiny", image: "https://static.jojowiki.com/images/3/3d/latest/20191015212825/Sex_Pistols_Infobox_Manga.png" },

    { id: "spice-girl-manga-shiny", image: "https://static.jojowiki.com/images/8/84/latest/20191015214711/Spice_Girl_Infobox_Manga.png" },
    { id: "spice-girl-eoh-shiny", image: "https://static.jojowiki.com/images/1/1a/latest/20240722051206/SpiceGirlEoH.png" },

    { id: "sticky-fingers-manga-shiny", image: "https://static.jojowiki.com/images/4/42/latest/20251201143842/Sticky_Fingers_Infobox_Manga.png" },
    { id: "sticky-fingers-color-shift-shiny", image: "https://i.ibb.co/4wVJRCdv/image.png" },
    { id: "sticky-fingers-eoh-shiny", image: "https://static.jojowiki.com/images/1/11/latest/20240721195414/Sticky_Fingers_EoH.png" },
    { id: "sticky-fingers-ora-ora-overdrive-shiny", image: "https://static.jojowiki.com/images/9/9e/latest/20250929180000/OraDora_Sticky_Fingers_1.png" },

    { id: "white-album-manga-shiny", image: "https://static.jojowiki.com/images/b/be/latest/20240405022040/White_Album_Infobox_Manga.png" },

    // ── Parte 6: Stone Ocean ────────────────────────────────────────────────────
    { id: "bohemian-rhapsody-pinocchio-shiny", image: "https://i.ibb.co/ZzJ46zp1/image.png" },
    { id: "bohemian-rhapsody-snow-white-shiny", image: "https://i.ibb.co/dqS7Bjm/image.png" },
    { id: "bohemian-rhapsody-red-riding-hood-shiny", image: "https://i.ibb.co/1fzJ06cT/image.png" },
    { id: "bohemian-rhapsody-cinderella-shiny", image: "https://www.pngarts.com/files/10/Cinderella-PNG-Image.png" },
    { id: "bohemian-rhapsody-beast-shiny", image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhTEmuJv87mFv15EZAjXH1Mf6CjSxuOSY9q69z7MM_mF8wIImjXrtTSmlDz_Ky66DpPuJKM0qZHvG2ubwYoht2t1MjhzwiyE8nesMJr38IxjcQQ7gysytiemRlMHCa6R6UWHLiPvarPdM4/s1600/a+bela+e+a+fera-+png+e+gifs++%281%29.png" },

    { id: "diver-down-manga-shiny", image: "https://static.jojowiki.com/images/9/98/latest/20211112115109/Diver_Down_Infobox_Manga.png" },
    { id: "diver-down-eoh-shiny", image: "https://static.jojowiki.com/images/9/90/latest/20240722062555/Anasui_DiverDown_jojoeoh.png" },
    { id: "diver-down-ora-ora-overdrive-shiny", image: "https://static.jojowiki.com/images/8/83/latest/20250929175907/OraDora_Diver_Down_1.png" },

    { id: "dragons-dream-manga-shiny", image: "https://static.jojowiki.com/images/6/6d/latest/20260310155913/Dragon's_Dream_Infobox_Manga.png" },

    { id: "foo-fighters-manga-shiny", image: "https://static.jojowiki.com/images/thumb/0/07/latest/20210313143756/Foo_Fighters_Stand_Infobox_Manga.png/400px-Foo_Fighters_Stand_Infobox_Manga.png" },
    { id: "foo-fighters-plankton-shiny", image: "https://static.wikia.nocookie.net/herois/images/7/77/Plankton_stock_art.png/revision/latest?cb=20221204023124&path-prefix=pt-br" },

    { id: "green-green-grass-of-home-manga-shiny", image: "https://static.jojowiki.com/images/a/a9/latest/20220112060603/G3oH_Infobox_Manga.png" },

    { id: "jail-house-lock-manga-shiny", image: "https://static.jojowiki.com/images/1/17/latest/20210525040651/Jail_House_Lock_Infobox_Manga.png" },
    { id: "jail-house-lock-3d-shiny", image: "https://static.jojowiki.com/images/8/8b/latest/20241227041455/PTN_Jail_House_Lock.png" },

    { id: "kiss-manga-shiny", image: "https://static.jojowiki.com/images/7/77/latest/20210829145227/Kiss_Infobox_Manga.png" },
    { id: "kiss-color-shift-shiny", image: "https://i.ibb.co/k6vHQDT2/image.png" },
    { id: "kiss-asb-shiny", image: "https://static.jojowiki.com/images/4/4b/latest/20240723055043/Kiss_AllStarBattle.png" },
    { id: "kiss-3d-shiny", image: "https://static.jojowiki.com/images/9/94/latest/20240502014741/PTN_Ermes_Kiss.png" },

    { id: "limp-bizkit-manga-shiny", image: "https://i.ibb.co/KjPScN8n/image.png" },

    { id: "stone-free-manga-shiny", image: "https://static.jojowiki.com/images/2/24/latest/20220925022203/Stone_Free_Infobox_Manga.png" },
    { id: "stone-free-color-shift-shiny", image: "https://i.ibb.co/6R0hKy85/image.png" },
    { id: "stone-free-eoh-shiny", image: "https://static.jojowiki.com/images/7/7f/latest/20240722054923/Stone_Free_EOH.png" },
    { id: "stone-free-spider-man-shiny", image: "https://i.ibb.co/0jZfXN9d/CITYPNG-COM-HD-Spider-Man-Jumping-Anime-PNG-2000x2000.png" },
    { id: "stone-free-spider-man-symbiote-shiny", image: "https://i.ibb.co/LsNTX2c/image.png" },

    { id: "weather-report-manga-shiny", image: "https://static.jojowiki.com/images/8/8a/latest/20211109144423/Weather_Report_Stand_Infobox_Manga.png" },
    { id: "weather-report-eoh-shiny", image: "https://static.jojowiki.com/images/7/70/latest/20240722064532/WeatherReport_Stand_jojoeoh.png" },
    { id: "weather-report-3d-shiny", image: "https://static.jojowiki.com/images/d/d6/latest/20240502014848/PTN_Weather_Weather_Report.png" },
    { id: "weather-report-storm-shiny", image: "https://i.ibb.co/jkdGdcvW/image.png" },

    { id: "whitesnake-manga-shiny", image: "https://static.jojowiki.com/images/6/62/latest/20231210172019/Whitesnake_Infobox_Manga.png" },
    { id: "whitesnake-mintsnake-shiny", image: "https://static.jojowiki.com/images/5/5e/latest/20240723055714/Whitesnake_ASB.png" },
    { id: "whitesnake-eoh-shiny", image: "https://static.jojowiki.com/images/a/ad/latest/20240722065015/Whitesnake_EOH.png" },
];

const stands = [
    // ── Parte 3: Stardust Crusaders ────────────────────────────────────────────
    { id: "anubis", name: "Anubis", part: 3, rarity: "epic", weight: 25, shinies: [{ id: "anubis-manga-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/6/64/latest/20220916183812/Anubis_Infobox_Anime.png" },
    { id: "atum", name: "Atum", part: 3, rarity: "rare", weight: 60, shinies: [{ id: "atum-manga-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/5/50/latest/20211114224746/Atum_Infobox_Anime.png" },
    { id: "bastet", name: "Bastet", part: 3, rarity: "uncommon", weight: 75, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/d/dd/latest/20211010231924/Bastet_Infobox_Anime.png" },
    { id: "cream", name: "Cream", part: 3, rarity: "legendary", weight: 5, shinies: [{ id: "cream-manga-shiny", weight: 100 }, { id: "cream-asb-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/7/7f/latest/20220916193130/Cream_Infobox_Anime.png" },
    { id: "dark-blue-moon", name: "Dark Blue Moon", part: 3, rarity: "rare", weight: 60, shinies: [{ id: "dark-blue-moon-manga-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/7/73/latest/20251210224929/OraDora_Dark_Blue_Moon_1.png" },
    { id: "death-13", name: "Death 13", part: 3, rarity: "legendary", weight: 5, shinies: [{ id: "death-13-manga-shiny", weight: 100 }, { id: "death-13-chibi-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/b/be/latest/20221008023351/Death_Thirteen_Infobox_Anime.png" },
    { id: "ebony-devil", name: "Ebony Devil", part: 3, rarity: "uncommon", weight: 75, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/7/77/latest/20220920020932/Ebony_Devil_Infobox_Anime.png" },
    { id: "emperor", name: "Emperor", part: 3, rarity: "uncommon", weight: 75, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/5/5d/latest/20220917022257/Emperor_Infobox_Anime.png" },
    { id: "empress", name: "Empress", part: 3, rarity: "common", weight: 100, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/c/c9/latest/20220917233428/Empress_Infobox_Anime.png" },
    { id: "the-fool", name: "The Fool", part: 3, rarity: "epic", weight: 25, shinies: [{ id: "the-fool-manga-shiny", weight: 100 }, { id: "the-fool-ova-shiny", weight: 100 }, { id: "the-fool-color-shift-shiny", weight: 100 }, { id: "the-fool-asb-shiny", weight: 100 }, { id: "the-fool-asbr-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/1/10/latest/20210312225357/The_Fool_Infobox_Anime.png" },
    { id: "geb", name: "Geb", part: 3, rarity: "rare", weight: 60, shinies: [{ id: "geb-manga-shiny", weight: 100 }, { id: "geb-ova-shiny", weight: 100 }, { id: "geb-color-shift-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/2/26/latest/20220922192352/Geb_Infobox_Anime.png" },
    { id: "hanged-man", name: "Hanged Man", part: 3, rarity: "epic", weight: 25, shinies: [{ id: "hanged-man-manga-shiny", weight: 100 }, { id: "hanged-man-ova-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/1/1f/latest/20220917022046/Hanged_Man_Infobox_Anime.png" },
    { id: "hermit-purple", name: "Hermit Purple", part: 3, rarity: "common", weight: 100, shinies: [{ id: "hermit-purple-manga-shiny", weight: 100 }, { id: "hermit-purple-ova-shiny", weight: 100 }, { id: "hermit-purple-part4-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/0/0a/latest/20220922193045/Hermit_Purple_SC_Infobox_Anime.png" },
    { id: "hierophant-green", name: "Hierophant Green", part: 3, rarity: "epic", weight: 25, shinies: [{ id: "hierophant-green-manga-shiny", weight: 100 }, { id: "hierophant-green-ova-shiny", weight: 100 }, { id: "hierophant-green-color-shift-shiny", weight: 100 }, { id: "hierophant-green-ora-ora-overdrive-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/3/3e/latest/20210616200106/Hierophant_Green_Infobox_Anime.png" },
    { id: "high-priestess", name: "High Priestess", part: 3, rarity: "uncommon", weight: 75, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/1/1f/latest/20220920014856/High_Priestess_Infobox_Anime.png" },
    { id: "horus", name: "Horus", part: 3, rarity: "epic", weight: 25, shinies: [{ id: "horus-manga-shiny", weight: 100 }, { id: "horus-asbr-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/d/d7/latest/20221008021726/Horus_Infobox_Anime.png" },
    { id: "judgement", name: "Judgement", part: 3, rarity: "incommon", weight: 75, shinies: [{ id: "judgement-manga-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/a/af/latest/20220920211919/Judgement_Infobox_Anime.png" },
    { id: "justice", name: "Justice", part: 3, rarity: "epic", weight: 25, shinies: [{ id: "justice-manga-shiny", weight: 100 }], can_evolve: false, image: "https://i.ibb.co/Kc61jqpt/image.png" },
    { id: "khnum", name: "Khnum", part: 3, rarity: "uncommon", weight: 75, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/1/1c/latest/20220920014323/Khnum_Infobox_Anime.png" },
    { id: "lovers", name: "Lovers", part: 3, rarity: "common", weight: 100, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/4/4a/latest/20220917022801/Lovers_Infobox_Anime.png" },
    { id: "magicians-red", name: "Magician's Red", part: 3, rarity: "epic", weight: 25, shinies: [{ id: "magicians-red-manga-shiny", weight: 100 }, { id: "magicians-red-ova-shiny", weight: 100 }, { id: "magicians-red-asbr-shiny", weight: 100 }, { id: "magicians-red-eoh-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/4/40/latest/20210725004739/Magician's_Red_Appearance.png" },
    { id: "osiris", name: "Osiris", part: 3, rarity: "uncommon", weight: 75, shinies: [{ id: "osiris-manga-shiny", weight: 100 }, { id: "osiris-ova-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/a/ae/latest/20221008021422/Osiris_Infobox_Anime.png" },
    { id: "sethan", name: "Sethan", part: 3, rarity: "uncommon", weight: 75, shinies: [], can_evolve: false, image: "https://i.ibb.co/p9VyV5z/image.png" },
    { id: "silver-chariot", name: "Silver Chariot", part: 3, rarity: "legendary", weight: 5, shinies: [{ id: "silver-chariot-manga-shiny", weight: 100 }, { id: "silver-chariot-ova-shiny", weight: 100 }, { id: "silver-chariot-baby-chariot-shiny", weight: 100 }, { id: "silver-chariot-part5-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/8/80/latest/20251210223654/OraDora_Silver_Chariot_1.png" },
    { id: "star-platinum", name: "Star Platinum", part: 3, rarity: "legendary", weight: 5, shinies: [{ id: "star-platinum-manga-shiny", weight: 100 }, { id: "star-platinum-ova-shiny", weight: 100 }, { id: "star-platinum-color-shift-shiny", weight: 100 }, { id: "star-platinum-jaguar-shiny", weight: 100 }, { id: "star-platinum-silly-shiny", weight: 100 }, { id: "star-platinum-part4-shiny", weight: 100 }, { id: "star-platinum-eoh-shiny", weight: 100 }, { id: "star-platinum-green-shiny", weight: 100 }, { id: "star-platinum-luffy-shiny", weight: 100 }], can_evolve: true, image: "https://static.jojowiki.com/images/7/72/latest/20250929180209/OraDora_Star_Platinum_1.png" },
    { id: "strength", name: "Strength", part: 3, rarity: "rare", weight: 60, shinies: [{ id: "strength-manga-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/b/ba/latest/20230206194005/Strength_Infobox_Anime.png" },
    { id: "sun", name: "Sun", part: 3, rarity: "common", weight: 100, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/f/fd/latest/20221008023104/Sun_Infobox_Anime.png" },
    { id: "tenore-sax", name: "Tenore Sax", part: 3, rarity: "common", weight: 100, shinies: [], can_evolve: false, image: "https://i.ibb.co/WWPvMZJx/image.png" },
    { id: "tohth", name: "Tohth", part: 3, rarity: "uncommon", weight: 75, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/0/09/latest/20211010231309/Tohth_Infobox_Anime.png" },
    { id: "tower-of-gray", name: "Tower of Gray", part: 3, rarity: "common", weight: 100, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/c/c2/latest/20220917233012/Tower_of_Gray_Infobox_Anime.png" },
    { id: "the-world", name: "The World", part: 3, rarity: "legendary", weight: 5, shinies: [{ id: "the-world-manga-shiny", weight: 100 }, { id: "the-world-ova-shiny", weight: 100 }, { id: "the-world-color-shift-shiny", weight: 100 }, { id: "the-world-greatest-high-shiny", weight: 100 }, { id: "the-world-asb-shiny", weight: 100 }], can_evolve: true, image: "https://static.jojowiki.com/images/8/8d/latest/20251210224158/OraDora_The_World_1.png" },
    { id: "wheel-of-fortune", name: "Wheel of Fortune", part: 3, rarity: "common", weight: 100, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/b/b7/latest/20221008022642/Wheel_of_Fortune_Infobox_Anime.png" },
    { id: "yellow-temperance", name: "Yellow Temperance", part: 3, rarity: "uncommon", weight: 75, shinies: [{ id: "yellow-temperance-manga-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/3/38/latest/20220917234459/Yellow_Temperance_Infobox_Anime.png" },

    // ── Parte 4: Diamond is Unbreakable ────────────────────────────────────────
    { id: "achtung-baby", name: "Achtung Baby", part: 4, rarity: "common", weight: 100, shinies: [], can_evolve: false, image: "https://i.ibb.co/qYq5FQCS/image.png" },
    { id: "aqua-necklace", name: "Aqua Necklace", part: 4, rarity: "rare", weight: 60, shinies: [{ id: "aqua-necklace-manga-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/7/74/latest/20251210234013/OraDora_Aqua_Necklace_1.png" },
    { id: "atom-heart-father", name: "Atom Heart Father", part: 4, rarity: "common", weight: 100, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/0/00/latest/20220924230813/Atom_Heart_Father_Infobox_Anime.png" },
    { id: "bad-company", name: "Bad Company", part: 4, rarity: "uncommon", weight: 75, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/3/3f/latest/20191015213049/BadCompany_KeyArt.png" },
    { id: "boy-ii-man", name: "Boy II Man", part: 4, rarity: "common", weight: 100, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/b/b9/latest/20191015220101/Boy_II_Man_Infobox_Anime.png" },
    { id: "cheap-trick", name: "Cheap Trick", part: 4, rarity: "common", weight: 100, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/8/8e/latest/20250724150945/Cheap_Trick_Infobox_Anime.png" },
    { id: "cinderella", name: "Cinderella", part: 4, rarity: "common", weight: 100, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/8/83/latest/20220924232818/Cinderella_KeyArt.png" },
    { id: "crazy-diamond", name: "Crazy Diamond", part: 4, rarity: "legendary", weight: 5, shinies: [{ id: "crazy-diamond-manga-shiny", weight: 100 }, { id: "crazy-diamond-color-shift-shiny", weight: 100 }, { id: "crazy-diamond-asbr-shiny", weight: 100 }, { id: "crazy-diamond-eoh-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/b/b5/latest/20191015215419/Crazy_Diamond_Infobox_Anime.png" },
    { id: "earth-wind-and-fire", name: "Earth, Wind and Fire", part: 4, rarity: "common", weight: 100, shinies: [], can_evolve: false, image: "https://i.ibb.co/hbzKsr8/image.png" },
    { id: "echoes", name: "Echoes", part: 4, rarity: "uncommon", weight: 75, shinies: [{ id: "echoes-manga-shiny", weight: 100 }], can_evolve: true, image: "https://static.jojowiki.com/images/d/dc/latest/20210424210829/Echoes_ACT1_DU_Infobox_Anime.png" },
    { id: "enigma", name: "Enigma", part: 4, rarity: "rare", weight: 60, shinies: [{ id: "enigma-manga-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/5/51/latest/20221010022748/Enigma_Infobox_Anime.png" },
    { id: "the-hand", name: "The Hand", part: 4, rarity: "epic", weight: 25, shinies: [{ id: "the-hand-manga-shiny", weight: 100 }, { id: "the-hand-color-shift-shiny", weight: 100 }, { id: "the-hand-asb-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/a/ae/latest/20210111150120/The_Hand_Infobox_Anime.png" },
    { id: "harvest", name: "Harvest", part: 4, rarity: "uncommon", weight: 75, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/7/73/latest/20220904041353/Harvest_Infobox_Anime.png" },
    { id: "heavens-door", name: "Heaven's Door", part: 4, rarity: "legendary", weight: 5, shinies: [{ id: "heavens-door-manga-shiny", weight: 100 }, { id: "heavens-door-ova-shiny", weight: 100 }, { id: "heavens-door-asb-shiny", weight: 100 }, { id: "heavens-door-eoh-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/5/50/latest/20210203193008/Heaven's_Door_Infobox_Anime.png" },
    { id: "highway-star", name: "Highway Star", part: 4, rarity: "rare", weight: 60, shinies: [{ id: "highway-star-manga-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/0/07/latest/20230228171739/Highway_Star_Infobox_Anime.png" },
    { id: "killer-queen", name: "Killer Queen", part: 4, rarity: "legendary", weight: 5, shinies: [{ id: "killer-queen-manga-shiny", weight: 100 }, { id: "killer-queen-shadow-shiny", weight: 100 }, { id: "killer-queen-asbr-shiny", weight: 100 }], can_evolve: true, image: "https://static.jojowiki.com/images/1/14/latest/20221020232023/Killer_Queen_Infobox_Anime.png" },
    { id: "the-lock", name: "The Lock", part: 4, rarity: "common", weight: 100, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/5/5d/latest/20211012143104/The_Lock_Infobox_Anime.png" },
    { id: "love-deluxe", name: "Love Deluxe", part: 4, rarity: "common", weight: 100, shinies: [], can_evolve: false, image: "https://i.ibb.co/TBCjQRvM/image.png" },
    { id: "pearl-jam", name: "Pearl Jam", part: 4, rarity: "uncommon", weight: 75, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/7/70/latest/20250722142541/Pearl_Jam_Infobox_Anime.png" },
    { id: "ratt", name: "Ratt", part: 4, rarity: "rare", weight: 60, shinies: [{ id: "ratt-manga-shiny", weight: 100 }, { id: "ratt-chibi-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/2/2a/latest/20191015215324/Ratt_Infobox_Anime.png" },
    { id: "red-hot-chili-peppers", name: "Red Hot Chili Peppers", part: 4, rarity: "epic", weight: 25, shinies: [{ id: "red-hot-chili-peppers-manga-shiny", weight: 100 }, { id: "red-hot-chili-peppers-asb-shiny", weight: 100 }, { id: "red-hot-chili-peppers-eoh-shiny", weight: 100 }, { id: "red-hot-chili-peppers-electro-shiny", weight: 100 }], can_evolve: false, image: "https://i.ibb.co/PzZRxjz7/image.png" },
    { id: "stray-cat", name: "Stray Cat", part: 4, rarity: "uncommon", weight: 75, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/7/7d/latest/20220908212216/Stray_Cat_Original_Infobox_Anime.png" },
    { id: "surface", name: "Surface", part: 4, rarity: "rare", weight: 60, shinies: [{ id: "surface-manga-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/4/4a/latest/20220924233119/Surface_KeyArt.png" },

    // ── Parte 5: Golden Wind ────────────────────────────────────────────────────
    { id: "aerosmith", name: "Aerosmith", part: 5, rarity: "rare", weight: 60, shinies: [{ id: "aerosmith-asb-shiny", weight: 100 }, { id: "aerosmith-eoh-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/7/7c/latest/20210701024635/Aerosmith_Infobox_Anime.png" },
    { id: "baby-face", name: "Baby Face", part: 5, rarity: "uncommon", weight: 75, shinies: [], can_evolve: true, image: "https://static.jojowiki.com/images/e/e3/latest/20250929202656/BabyFaceAnime.png" },
    { id: "beach-boy", name: "Beach Boy", part: 5, rarity: "rare", weight: 60, shinies: [{ id: "beach-boy-manga-shiny", weight: 100 }, { id: "beach-boy-fishing-rod-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/e/ec/latest/20241122152334/Beach_Boy_Infobox_Anime.png" },
    { id: "black-sabbath", name: "Black Sabbath", part: 5, rarity: "epic", weight: 25, shinies: [{ id: "black-sabbath-manga-shiny", weight: 100 }, { id: "black-sabbath-chibi-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/1/17/latest/20220920220032/Black_Sabbath_Infobox_Anime.png" },
    { id: "clash", name: "Clash", part: 5, rarity: "rare", weight: 60, shinies: [{ id: "clash-manga-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/6/66/latest/20210208190621/Clash_Infobox_Anime.png" },
    { id: "gold-experience", name: "Gold Experience", part: 5, rarity: "legendary", weight: 5, shinies: [{ id: "gold-experience-manga-shiny", weight: 100 }, { id: "gold-experience-eoh-shiny", weight: 100 }, { id: "gold-experience-ora-ora-overdrive-shiny", weight: 100 }], can_evolve: true, image: "https://static.jojowiki.com/images/8/81/latest/20210707053105/Gold_Experience_Infobox_Anime.png" },
    { id: "the-grateful-dead", name: "The Grateful Dead", part: 5, rarity: "rare", weight: 60, shinies: [{ id: "the-grateful-dead-manga-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/2/29/latest/20250324140252/The_Grateful_Dead_Infobox_Anime.png" },
    { id: "green-day", name: "Green Day", part: 5, rarity: "epic", weight: 25, shinies: [{ id: "green-day-manga-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/a/a4/latest/20230303153451/Green_Day_Infobox_Anime.png" },
    { id: "king-crimson", name: "King Crimson", part: 5, rarity: "legendary", weight: 5, shinies: [{ id: "king-crimson-manga-shiny", weight: 100 }, { id: "king-crimson-stardust-shooters-shiny", weight: 100 }, { id: "king-crimson-eoh-shiny", weight: 100 }], can_evolve: true, image: "https://static.jojowiki.com/images/c/c6/latest/20241012182526/King_Crimson_Infobox_Anime.png" },
    { id: "kraft-work", name: "Kraft Work", part: 5, rarity: "uncommon", weight: 75, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/4/49/latest/20231109191433/Kraft_Work_Infobox_Anime.png" },
    { id: "little-feet", name: "Little Feet", part: 5, rarity: "common", weight: 100, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/5/56/latest/20241122151845/Little_Feet_Infobox_Anime.png" },
    { id: "man-in-the-mirror", name: "Man in the Mirror", part: 5, rarity: "uncommon", weight: 75, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/e/eb/latest/20241122152028/Man_in_the_Mirror_Infobox_Anime.png" },
    { id: "metallica", name: "Metallica", part: 5, rarity: "legendary", weight: 5, shinies: [{ id: "metallica-aura-farm-shiny", weight: 100 }, { id: "metallica-magneto-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/1/15/latest/20191015215736/Metallicca.png" },
    { id: "moody-blues", name: "Moody Blues", part: 5, rarity: "uncommon", weight: 75, shinies: [{ id: "moody-blues-manga-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/9/91/latest/20220916205647/Moody_Blues_Infobox_Anime.png" },
    { id: "mr-president", name: "Mr. President", part: 5, rarity: "common", weight: 100, shinies: [], can_evolve: false, image: "https://i.ibb.co/67G1cyft/image.png" },
    { id: "notorious-big", name: "Notorious B.I.G", part: 5, rarity: "rare", weight: 60, shinies: [{ id: "notorious-big-manga-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/a/a4/latest/20191015214035/Notorious_B.I.G.png" },
    { id: "oasis", name: "Oasis", part: 5, rarity: "epic", weight: 25, shinies: [{ id: "oasis-big-head-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/0/06/latest/20241005192306/Oasis_Infobox_Anime.png" },
    { id: "purple-haze", name: "Purple Haze", part: 5, rarity: "epic", weight: 25, shinies: [{ id: "purple-haze-manga-shiny", weight: 100 }, { id: "purple-haze-bw-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/c/ca/latest/20191015214140/Purple_Haze_Infobox_Anime.png" },
    { id: "rolling-stones", name: "Rolling Stones", part: 5, rarity: "common", weight: 100, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/d/d4/latest/20191015214110/Rolling_Stones_anime.png" },
    { id: "sex-pistols", name: "Sex Pistols", part: 5, rarity: "uncommon", weight: 75, shinies: [{ id: "sex-pistols-manga-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/b/b9/latest/20210521114106/Sex_Pistols_Infobox_Anime.png" },
    { id: "soft-machine", name: "Soft Machine", part: 5, rarity: "uncommon", weight: 75, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/6/69/latest/20240118150429/Soft_Machine_Infobox_Anime.png" },
    { id: "spice-girl", name: "Spice Girl", part: 5, rarity: "rare", weight: 60, shinies: [{ id: "spice-girl-manga-shiny", weight: 100 }, { id: "spice-girl-eoh-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/2/21/latest/20200118002424/Spice_Girl_Infobox_Anime.png" },
    { id: "sticky-fingers", name: "Sticky Fingers", part: 5, rarity: "epic", weight: 25, shinies: [{ id: "sticky-fingers-manga-shiny", weight: 100 }, { id: "sticky-fingers-color-shift-shiny", weight: 100 }, { id: "sticky-fingers-eoh-shiny", weight: 100 }, { id: "sticky-fingers-ora-ora-overdrive-shiny", weight: 100 }], can_evolve: true, image: "https://static.jojowiki.com/images/7/78/latest/20221006032155/Sticky_Fingers_Infobox_Anime.png" },
    { id: "talking-head", name: "Talking Head", part: 5, rarity: "uncommon", weight: 75, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/6/68/latest/20210719190437/Talking_Head_Infobox_Anime.png" },
    { id: "white-album", name: "White Album", part: 5, rarity: "rare", weight: 60, shinies: [{ id: "white-album-manga-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/c/c0/latest/20221003162753/White_Album_Acrylic.png" },

    // ── Parte 6: Stone Ocean ────────────────────────────────────────────────────
    { id: "bohemian-rhapsody", name: "Bohemian Rhapsody", part: 6, rarity: "legendary", weight: 5, shinies: [{ id: "bohemian-rhapsody-pinocchio-shiny", weight: 100 }, { id: "bohemian-rhapsody-snow-white-shiny", weight: 100 }, { id: "bohemian-rhapsody-red-riding-hood-shiny", weight: 100 }, { id: "bohemian-rhapsody-cinderella-shiny", weight: 100 }, { id: "bohemian-rhapsody-beast-shiny", weight: 100 }], can_evolve: false, image: "https://i.ibb.co/0dFhcFr/image.png" },
    { id: "burning-down-the-house", name: "Burning Down the House", part: 6, rarity: "common", weight: 100, shinies: [], can_evolve: false, image: "https://i.ibb.co/LzyT8CYk/image.png" },
    { id: "diver-down", name: "Diver Down", part: 6, rarity: "epic", weight: 25, shinies: [{ id: "diver-down-manga-shiny", weight: 100 }, { id: "diver-down-eoh-shiny", weight: 100 }, { id: "diver-down-ora-ora-overdrive-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/c/c6/latest/20230826110448/Diver_Down_Anime_Infobox.png" },
    { id: "dragons-dream", name: "Dragon's Dream", part: 6, rarity: "uncommon", weight: 75, shinies: [{ id: "dragons-dream-manga-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/2/2e/latest/20221002121518/Dragon's_Dream_Infobox_Anime.png" },
    { id: "foo-fighters", name: "Foo Fighters", part: 6, rarity: "rare", weight: 60, shinies: [{ id: "foo-fighters-manga-shiny", weight: 100 }, { id: "foo-fighters-plankton-shiny", weight: 100 }], can_evolve: true, image: "https://static.jojowiki.com/images/3/37/latest/20220902190331/Foo_Fighters_Stand_Anime_Infobox.png" },
    { id: "goo-goo-dolls", name: "Goo Goo Dolls", part: 6, rarity: "common", weight: 100, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/f/f1/latest/20211202072644/Goo_Goo_Dolls_Infobox_Anime.png" },
    { id: "green-green-grass-of-home", name: "Green, Green Grass of Home", part: 6, rarity: "rare", weight: 60, shinies: [{ id: "green-green-grass-of-home-manga-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/c/c0/latest/20221005175220/GGGoH_Render_1.png" },
    { id: "highway-to-hell", name: "Highway to Hell", part: 6, rarity: "common", weight: 100, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/f/f3/latest/20211201174538/Highway_to_Hell_Infobox_Anime.png" },
    { id: "jail-house-lock", name: "Jail House Lock", part: 6, rarity: "epic", weight: 25, shinies: [{ id: "jail-house-lock-manga-shiny", weight: 100 }, { id: "jail-house-lock-3d-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/6/6f/latest/20220902181930/Jail_House_Lock_Infobox_Anime.png" },
    { id: "jumpin-jack-flash", name: "Jumpin' Jack Flash", part: 6, rarity: "uncommon", weight: 75, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/1/17/latest/20221030000457/Jumpin'_Jack_Flash_Infobox_Anime.png" },
    { id: "kiss", name: "KISS", part: 6, rarity: "rare", weight: 60, shinies: [{ id: "kiss-manga-shiny", weight: 100 }, { id: "kiss-color-shift-shiny", weight: 100 }, { id: "kiss-asb-shiny", weight: 100 }, { id: "kiss-3d-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/2/24/latest/20230826110958/Kiss_Infobox_Anime.png" },
    { id: "limp-bizkit", name: "Limp Bizkit", part: 6, rarity: "rare", weight: 60, shinies: [{ id: "limp-bizkit-manga-shiny", weight: 100 }], can_evolve: false, image: "https://static.jojowiki.com/images/9/92/latest/20250721083820/Limp_Bizkit_Infobox_Anime.png" },
    { id: "manhattan-transfer", name: "Manhattan Transfer", part: 6, rarity: "common", weight: 100, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/b/ba/latest/20211201170744/Manhattan_Transfer_Infobox_Anime.png" },
    { id: "marilyn-manson", name: "Marilyn Manson", part: 6, rarity: "uncommon", weight: 75, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/9/9d/latest/20211201173825/Marilyn_Manson_Infobox_Anime.png" },
    { id: "planet-waves", name: "Planet Waves", part: 6, rarity: "uncommon", weight: 75, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/e/ec/latest/20221125230133/Planet_Waves_Infobox_Anime.png" },
    { id: "sky-high", name: "Sky High", part: 6, rarity: "common", weight: 100, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/6/6b/latest/20221201105503/Sky_High_Render_Appearance_Anime.png" },
    { id: "stone-free", name: "Stone Free", part: 6, rarity: "epic", weight: 25, shinies: [{ id: "stone-free-manga-shiny", weight: 100 }, { id: "stone-free-color-shift-shiny", weight: 100 }, { id: "stone-free-eoh-shiny", weight: 100 }, { id: "stone-free-spider-man-shiny", weight: 100 }, { id: "stone-free-spider-man-symbiote-shiny", weight: 100 }], can_evolve: true, image: "https://static.jojowiki.com/images/0/03/latest/20230826070709/Stone_Free_Infobox_Anime.png" },
    { id: "survivor", name: "Survivor", part: 6, rarity: "common", weight: 100, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/d/df/latest/20220901113058/Survivor_Render_1.png" },
    { id: "under-world", name: "Under World", part: 6, rarity: "uncommon", weight: 75, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/3/3d/latest/20251123210313/Under_World_Infobox_Anime.png" },
    { id: "weather-report", name: "Weather Report", part: 6, rarity: "legendary", weight: 5, shinies: [{ id: "weather-report-manga-shiny", weight: 100 }, { id: "weather-report-eoh-shiny", weight: 100 }, { id: "weather-report-3d-shiny", weight: 100 }, { id: "weather-report-storm-shiny", weight: 100 }], can_evolve: true, image: "https://static.jojowiki.com/images/a/ac/latest/20230826110804/Weather_Report_Stand_Anime_Infobox.png" },
    { id: "whitesnake", name: "Whitesnake", part: 6, rarity: "legendary", weight: 5, shinies: [{ id: "whitesnake-manga-shiny", weight: 100 }, { id: "whitesnake-mintsnake-shiny", weight: 100 }, { id: "whitesnake-eoh-shiny", weight: 100 }], can_evolve: true, image: "https://static.jojowiki.com/images/9/91/latest/20241001191051/Whitesnake_Infobox_Anime.png" },
    { id: "yo-yo-ma", name: "Yo-Yo-Ma", part: 6, rarity: "uncommon", weight: 75, shinies: [], can_evolve: false, image: "https://static.jojowiki.com/images/a/a5/latest/20221125230532/Yo-Yo_Ma_Infobox_Anime.png" },
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

for (const shiny of shinies) {
    await dynamo.send(new PutCommand({
        TableName: env.tableInfoStands,
        Item: shiny,
    }));
    console.log(`Inserido shiny: ${shiny.id}`);
}

console.log("Seed concluído.");
Deno.exit(0);
