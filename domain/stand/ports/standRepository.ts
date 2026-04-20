import type { OwnedStand } from "../stand.types.ts";

export interface StandRepository {
    create(stand: Omit<OwnedStand, "created_at">): Promise<OwnedStand>;
    findByUser(userId: string): Promise<OwnedStand[]>;
}
