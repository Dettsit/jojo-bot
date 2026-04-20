export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export const RARITY_LABEL: Record<Rarity, string> = {
    common: "⚪ Comum",
    uncommon: "🟢 Incomum",
    rare: "🔵 Rara",
    epic: "🟣 Épica",
    legendary: "🟡 Lendária",
};

export type ShinyVariant = {
    id: string;
    weight: number;
};

export type InfoShiny = {
    id: string;
    image: string;
};

export type InfoStand = {
    id: string;
    name: string;
    rarity: Rarity;
    weight: number;
    shinies: ShinyVariant[];
    image: string;
    part: number;
    can_evolve: boolean;
    evolution_item?: string;
};

export type OwnedStand = {
    stand_id: string;
    name: string;
    rarity: Rarity;
    shiny: string | null;
    user: string;
    created_at: Date;
};
