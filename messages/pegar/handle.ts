import type { ItemRepository } from "@domain/item/ports/repository.ts";
import type { InventoryRepository } from "@domain/stand/ports/inventoryRepository.ts";

export type PegarResult =
    | { status: "no_item" }
    | { status: "collected"; label: string; emoji: string };

type Deps = {
    itemRepository: ItemRepository;
    inventoryRepository: InventoryRepository;
};

export async function handlePegar(userId: string, deps: Deps): Promise<PegarResult> {
    const current = await deps.itemRepository.last();

    if (!current.value) return { status: "no_item" };

    const { type, label, emoji } = current.value;

    await Promise.all([
        deps.itemRepository.save({ date: Temporal.Now.instant(), value: undefined }),
        deps.inventoryRepository.addItem(userId, type),
    ]);

    return { status: "collected", label, emoji };
}
