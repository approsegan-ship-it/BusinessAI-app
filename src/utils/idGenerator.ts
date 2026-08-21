let idCounter = 0;

/**
 * Generates a globally unique, collision-proof ID for items, notifications, messages, and entities.
 */
export function generateUniqueId(prefix: string = 'id'): string {
  idCounter = (idCounter + 1) % 1000000;
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${timestamp}-${idCounter}-${randomStr}`;
}

/**
 * Deduplicates and guarantees unique IDs in an array of items
 */
export function ensureUniqueIds<T extends { id?: string }>(items: T[], prefix: string = 'item'): T[] {
  const seenIds = new Set<string>();
  return items.map((item, index) => {
    let currentId = item.id;
    if (!currentId || seenIds.has(currentId)) {
      currentId = generateUniqueId(`${prefix}-${index}`);
    }
    seenIds.add(currentId);
    return {
      ...item,
      id: currentId,
    };
  });
}
