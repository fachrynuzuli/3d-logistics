export type AgvStatus = 
  | 'idle' 
  | 'moving_to_pick' 
  | 'picking' 
  | 'carrying' 
  | 'dropping' 
  | 'charging';

export interface AGV {
  id: string;
  name: string;
  color: string;
  accentColor: string;
  battery: number;
  status: AgvStatus;
  position: [number, number, number];
  targetPosition: [number, number, number] | null;
  rotation: number;
  currentOrderId: string | null;
  carriedBoxId: string | null;
  path: [number, number, number][];
  pathIndex: number;
  speed: number;
}

export type ItemCategory = 'Tech & Gadgets' | 'Apparel' | 'Eco Goods' | 'Hardware' | 'Fragile Glass';

export interface BoxItem {
  id: string;
  sku: string;
  name: string;
  category: ItemCategory;
  color: string;
  accentColor: string;
  weightKg: number;
  quantity: number;
  rackId: string;
  shelfIndex: number;
  slotIndex: number;
  position: [number, number, number];
  isPicked: boolean;
  pickCount: number;
}

export interface RackBay {
  id: string;
  aisle: 'A' | 'B' | 'C';
  bayIndex: number;
  position: [number, number, number];
  shelves: number;
  slotsPerShelf: number;
  boxIds: string[];
}

export interface Order {
  id: string;
  boxId: string;
  sku: string;
  itemName: string;
  agvId: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: number;
  completedAt?: number;
}

export type HeatmapMode = 'none' | 'occupancy' | 'activity';
export type CameraMode = 'orbit' | 'topDown' | 'followAgv';

export interface SelectedEntity {
  type: 'box' | 'rack' | 'agv' | 'zone';
  id: string;
}
