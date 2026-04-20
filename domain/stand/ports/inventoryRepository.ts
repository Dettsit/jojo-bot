import type { ItemType } from "@domain/item/item.types.ts";

export interface InventoryRepository {
    addItem(userId: string, type: ItemType): Promise<void>;
    removeItem(userId: string, type: ItemType): Promise<boolean>;
    getCount(userId: string, type: ItemType): Promise<number>;
}
