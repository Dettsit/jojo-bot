import type { Rarity } from "./stand.types.ts";

export const RARITY_WEIGHTS: Record<Rarity, number> = {
    common: 100,
    uncommon: 40,
    rare: 15,
    epic: 5,
    legendary: 1,
};

export const SHINY_RARITIES: Rarity[] = ["rare", "epic", "legendary"];
export const SHINY_RATE = 0.05;
