import type { InfoStand } from "../stand.types.ts";

export interface InfoStandRepository {
    findAll(): Promise<InfoStand[]>;
}
