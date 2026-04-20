import type { ItemRepository } from "@domain/item/ports/repository.ts";
import type { ItemAnnouncer } from "@domain/item/ports/announcer.ts";
import type { InfoStandRepository } from "@domain/stand/ports/infoRepository.ts";
import type { StandRepository } from "@domain/stand/ports/standRepository.ts";
import type { InventoryRepository } from "@domain/stand/ports/inventoryRepository.ts";

import { createItemRepository } from "@infra/database/kv/item/repository.ts";
import { createItemAnnouncer } from "@infra/discord/announcers/item.ts";
import { createInfoStandRepository } from "@infra/database/dynamo/info/repository.ts";
import { createStandRepository } from "@infra/database/dynamo/stand/repository.ts";
import { createInventoryRepository } from "@infra/database/dynamo/inventory/repository.ts";

export function itemRepository(): ItemRepository {
    return createItemRepository();
}

export function itemAnnouncer(): ItemAnnouncer {
    return createItemAnnouncer();
}

export function infoRepository(): InfoStandRepository {
    return createInfoStandRepository();
}

export function standRepository(): StandRepository {
    return createStandRepository();
}

export function inventoryRepository(): InventoryRepository {
    return createInventoryRepository();
}
