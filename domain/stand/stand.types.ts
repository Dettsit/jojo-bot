export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export const RARITY_LABEL: Record<Rarity, string> = {
    common: "⚪ Comum",
    uncommon: "🟢 Incomum",
    rare: "🔵 Rara",
    epic: "🟣 Épica",
    legendary: "🟡 Lendária",
};

export type InfoStand = {
    id: string;
    name: string;
    rarity: Rarity;
    weight: number;
    can_be_shiny: boolean;
    image: string;
    part: number;
    can_evolve: boolean;
    evolution_item?: string;
};

export type OwnedStand = {
    stand_id: string;
    name: string;
    rarity: Rarity;
    shiny: boolean;
    user: string;
    created_at: Date;
};
