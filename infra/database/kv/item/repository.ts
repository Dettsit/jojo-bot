import type { ItemRepository } from "@domain/item/ports/repository.ts";
import { last, save } from "./last.ts";

export function createItemRepository(): ItemRepository {
    return { last, save };
}
