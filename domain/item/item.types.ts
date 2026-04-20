export type ItemType = "flecha-de-stand";

export type ItemInfo = {
    type: ItemType;
    label: string;
    emoji: string;
};

export const ITEMS: Record<ItemType, ItemInfo> = {
    "flecha-de-stand": {
        type: "flecha-de-stand",
        label: "Flecha de Stand",
        emoji: "🏹",
    },
};

export type ActiveItemData = {
    type: ItemType;
    label: string;
    emoji: string;
};

export type ActiveItem = {
    date: Temporal.Instant;
    value?: ActiveItemData;
};
