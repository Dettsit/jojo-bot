import type { InfoShiny } from "../stand.types.ts";

export interface InfoShinyRepository {
    findById(id: string): Promise<InfoShiny | null>;
}
