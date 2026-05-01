export const cacheTags = {
  inventoryList: 'inventory:list',
  inventoryItem: (id: string) => `inventory:item:${id}`,
  warehouseList: 'warehouse:list',
  warehouseItem: (id: string) => `warehouse:item:${id}`,
};
