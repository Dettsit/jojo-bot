import type { InfoStand } from "@domain/stand/stand.types.ts";

export type ActiveStand = {
    date: Temporal.Instant;
    value?: InfoStand;
};

export interface ActiveStandRepository {
    last(): Promise<ActiveStand>;
    save(stand: ActiveStand): Promise<void>;
}
