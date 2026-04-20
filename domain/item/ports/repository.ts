import type { ActiveItem } from "../item.types.ts";

export interface ItemRepository {
    last(): Promise<ActiveItem>;
    save(item: ActiveItem): Promise<void>;
}
