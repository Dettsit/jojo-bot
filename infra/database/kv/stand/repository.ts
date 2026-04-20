import type { ActiveStandRepository } from "@domain/stand/ports/activeStandRepository.ts";
import { last, save } from "./last.ts";

export function createActiveStandRepository(): ActiveStandRepository {
    return { last, save };
}
