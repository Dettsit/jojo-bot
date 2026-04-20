import type { ActiveItem } from "../item.types.ts";

export interface ItemAnnouncer {
    announceAppear(item: ActiveItem): Promise<void>;
    announceRunAway(item: ActiveItem): Promise<void>;
}
