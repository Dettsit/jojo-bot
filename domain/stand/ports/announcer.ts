import type { ActiveStand } from "./activeStandRepository.ts";

export interface StandAnnouncer {
    announceAppear(stand: ActiveStand): Promise<void>;
    announceRunAway(stand: ActiveStand): Promise<void>;
}
