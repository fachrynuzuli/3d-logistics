import { create } from 'zustand';
import type { 
  AGV, 
  BoxItem, 
  RackBay, 
  Order, 
  HeatmapMode, 
  CameraMode, 
  SelectedEntity, 
  ItemCategory 
} from '../types/logistics';
import { 
  CLAY_PALETTE 
} from '../utils/clayMaterials';
import { 
  CHARGING_PADS, 
  CONVEYOR_DROP_POINT, 
  generateWarehousePath, 
  distance2D 
} from '../utils/pathfinding';

interface LogisticsState {
  isPlaying: boolean;
  speedMultiplier: number;
  cameraMode: CameraMode;
  followedAgvId: string | null;
  heatmapMode: HeatmapMode;
  selectedEntity: SelectedEntity | null;
  
  racks: RackBay[];
  boxes: Record<string, BoxItem>;
  agvs: AGV[];
  orders: Order[];
  completedOrdersCount: number;

  togglePlay: () => void;
  setSpeedMultiplier: (multiplier: number) => void;
  setCameraMode: (mode: CameraMode) => void;
  setFollowedAgvId: (id: string | null) => void;
  setHeatmapMode: (mode: HeatmapMode) => void;
  setSelectedEntity: (entity: SelectedEntity | null) => void;
  
  dispatchPickOrder: (boxId?: string) => void;
  tickSimulation: (deltaSeconds: number) => void;
  resetSimulation: () => void;
}

// Initial Data Generators
const CATEGORIES: ItemCategory[] = [
  'Tech & Gadgets', 
  'Apparel', 
  'Eco Goods', 
  'Hardware', 
  'Fragile Glass'
];

function generateInitialData() {
  const racks: RackBay[] = [];
  const boxes: Record<string, BoxItem> = {};

  const aisleXMap: Record<string, number> = {
    'A': -8,
    'B': -1,
    'C': 6,
  };

  const bayZPositions = [-8, -3, 2, 7];

  let boxCounter = 100;

  Object.entries(aisleXMap).forEach(([aisleKey, aisleX]) => {
    bayZPositions.forEach((bayZ, bIndex) => {
      const rackId = `rack-${aisleKey}-${bIndex + 1}`;
      const rackBoxes: string[] = [];
      const shelves = 3;
      const slotsPerShelf = 2;

      for (let s = 0; s < shelves; s++) {
        for (let slot = 0; slot < slotsPerShelf; slot++) {
          boxCounter++;
          const boxId = `box-${boxCounter}`;
          rackBoxes.push(boxId);

          const cat = CATEGORIES[boxCounter % CATEGORIES.length];
          const colorObj = CLAY_PALETTE.boxes[boxCounter % CLAY_PALETTE.boxes.length];

          // Compute box 3D coordinates on rack
          // Shelves Y: 0.9, 2.1, 3.3
          const boxY = 0.9 + s * 1.15;
          const boxX = aisleX + (slot === 0 ? -0.45 : 0.45);
          const boxZ = bayZ;

          boxes[boxId] = {
            id: boxId,
            sku: `SKU-${cat.slice(0, 3).toUpperCase()}-${boxCounter}`,
            name: `${cat} Pack #${boxCounter % 50 + 1}`,
            category: cat,
            color: colorObj.main,
            accentColor: colorObj.accent,
            weightKg: +(2.5 + (boxCounter % 15) * 1.2).toFixed(1),
            quantity: 12 + (boxCounter % 40),
            rackId,
            shelfIndex: s,
            slotIndex: slot,
            position: [boxX, boxY, boxZ],
            isPicked: false,
            pickCount: (boxCounter % 7),
          };
        }
      }

      racks.push({
        id: rackId,
        aisle: aisleKey as 'A' | 'B' | 'C',
        bayIndex: bIndex + 1,
        position: [aisleX, 0, bayZ],
        shelves,
        slotsPerShelf,
        boxIds: rackBoxes,
      });
    });
  });

  const agvs: AGV[] = CLAY_PALETTE.agvs.map((cfg, idx) => ({
    id: `agv-${idx + 1}`,
    name: cfg.name,
    color: cfg.color,
    accentColor: cfg.accent,
    battery: +(95 - idx * 6).toFixed(0),
    status: 'idle',
    position: [...CHARGING_PADS[idx]],
    targetPosition: null,
    rotation: 0,
    currentOrderId: null,
    carriedBoxId: null,
    path: [],
    pathIndex: 0,
    speed: 4.5,
  }));

  return { racks, boxes, agvs };
}

const initialData = generateInitialData();

export const useLogisticsStore = create<LogisticsState>((set, get) => ({
  isPlaying: true,
  speedMultiplier: 1,
  cameraMode: 'orbit',
  followedAgvId: null,
  heatmapMode: 'none',
  selectedEntity: null,

  racks: initialData.racks,
  boxes: initialData.boxes,
  agvs: initialData.agvs,
  orders: [],
  completedOrdersCount: 24,

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setSpeedMultiplier: (multiplier) => set({ speedMultiplier: multiplier }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  setFollowedAgvId: (id) => set({ followedAgvId: id, cameraMode: id ? 'followAgv' : 'orbit' }),
  setHeatmapMode: (mode) => set({ heatmapMode: mode }),
  setSelectedEntity: (entity) => set({ selectedEntity: entity }),

  dispatchPickOrder: (targetBoxId?: string) => {
    const { boxes, agvs, orders } = get();

    // Find a box to pick
    let boxId = targetBoxId;
    if (!boxId) {
      const availableBoxes = Object.values(boxes).filter((b) => !b.isPicked);
      if (availableBoxes.length === 0) return;
      const randomBox = availableBoxes[Math.floor(Math.random() * availableBoxes.length)];
      boxId = randomBox.id;
    }

    const targetBox = boxes[boxId];
    if (!targetBox || targetBox.isPicked) return;

    // Find an idle AGV
    const idleAgv = agvs.find((a) => a.status === 'idle');
    if (!idleAgv) return;

    const newOrder: Order = {
      id: `ord-${Date.now().toString().slice(-4)}`,
      boxId: targetBox.id,
      sku: targetBox.sku,
      itemName: targetBox.name,
      agvId: idleAgv.id,
      status: 'in_progress',
      createdAt: Date.now(),
    };

    // Calculate picking waypoint in front of rack
    // The AGV stops on the aisle access lane next to rack
    const pickAisleOffset = targetBox.slotIndex === 0 ? -1.8 : 1.8;
    const pickTarget: [number, number, number] = [
      targetBox.position[0] + pickAisleOffset,
      0.2,
      targetBox.position[2],
    ];

    const pickPath = generateWarehousePath(idleAgv.position, pickTarget);

    const updatedAgvs = agvs.map((agv) => {
      if (agv.id === idleAgv.id) {
        return {
          ...agv,
          status: 'moving_to_pick' as const,
          currentOrderId: newOrder.id,
          targetPosition: pickTarget,
          path: pickPath,
          pathIndex: 0,
        };
      }
      return agv;
    });

    set({
      orders: [newOrder, ...orders],
      agvs: updatedAgvs,
    });
  },

  tickSimulation: (deltaSeconds: number) => {
    const state = get();
    if (!state.isPlaying) return;

    const effectiveDelta = deltaSeconds * state.speedMultiplier;
    const { agvs, boxes, completedOrdersCount } = state;

    let hasChanges = false;
    let newCompletedCount = completedOrdersCount;
    const updatedBoxes = { ...boxes };

    const updatedAgvs = agvs.map((agv) => {
      // Battery slowly drains while moving
      let battery = agv.battery;
      if (agv.status !== 'idle' && agv.status !== 'charging') {
        battery = Math.max(5, battery - effectiveDelta * 0.08);
      } else if (agv.status === 'charging') {
        battery = Math.min(100, battery + effectiveDelta * 0.5);
      }

      // AGV Navigation State Machine
      if (agv.path.length > 0 && agv.pathIndex < agv.path.length) {
        hasChanges = true;
        const currentTarget = agv.path[agv.pathIndex];
        const [currX, , currZ] = agv.position;
        const [targetX, , targetZ] = currentTarget;

        const dist = distance2D(currX, currZ, targetX, targetZ);
        const stepDist = agv.speed * effectiveDelta;

        if (dist <= stepDist) {
          // Reached intermediate waypoint
          const nextIndex = agv.pathIndex + 1;
          if (nextIndex >= agv.path.length) {
            // Reached final destination of current phase!
            if (agv.status === 'moving_to_pick') {
              // Transition to picking
              const order = state.orders.find((o) => o.id === agv.currentOrderId);
              if (order && updatedBoxes[order.boxId]) {
                updatedBoxes[order.boxId].isPicked = true;
                updatedBoxes[order.boxId].pickCount += 1;
              }
              // Path to conveyor drop point
              const toConveyorPath = generateWarehousePath(currentTarget, CONVEYOR_DROP_POINT);
              return {
                ...agv,
                battery,
                position: currentTarget,
                status: 'carrying' as const,
                carriedBoxId: order ? order.boxId : null,
                path: toConveyorPath,
                pathIndex: 0,
              };
            } else if (agv.status === 'carrying') {
              // Reached conveyor drop point! Drop parcel
              newCompletedCount++;
              // Return to idle or go to charging pad
              const padIdx = parseInt(agv.id.split('-')[1] || '1', 10) - 1;
              const chargePad = CHARGING_PADS[padIdx] || CHARGING_PADS[0];
              const returnPath = generateWarehousePath(currentTarget, chargePad);

              return {
                ...agv,
                battery,
                position: currentTarget,
                status: 'dropping' as const,
                carriedBoxId: null,
                currentOrderId: null,
                path: returnPath,
                pathIndex: 0,
              };
            } else {
              // Finished returning to base
              return {
                ...agv,
                battery,
                position: currentTarget,
                status: 'idle' as const,
                path: [],
                pathIndex: 0,
              };
            }
          } else {
            return {
              ...agv,
              battery,
              position: currentTarget,
              pathIndex: nextIndex,
            };
          }
        } else {
          // Move toward target
          const angle = Math.atan2(targetX - currX, targetZ - currZ);
          const nextX = currX + Math.sin(angle) * stepDist;
          const nextZ = currZ + Math.cos(angle) * stepDist;

          return {
            ...agv,
            battery,
            position: [nextX, 0.2, nextZ] as [number, number, number],
            rotation: angle,
          };
        }
      }

      return { ...agv, battery };
    });

    // Auto-dispatch random simulated pick if all AGVs are idle and playing
    const allIdle = updatedAgvs.every((a) => a.status === 'idle');
    if (allIdle && Math.random() < effectiveDelta * 0.4) {
      setTimeout(() => {
        get().dispatchPickOrder();
      }, 50);
    }

    if (hasChanges || newCompletedCount !== completedOrdersCount) {
      set({
        agvs: updatedAgvs,
        boxes: updatedBoxes,
        completedOrdersCount: newCompletedCount,
      });
    }
  },

  resetSimulation: () => {
    const freshData = generateInitialData();
    set({
      racks: freshData.racks,
      boxes: freshData.boxes,
      agvs: freshData.agvs,
      orders: [],
      completedOrdersCount: 0,
      selectedEntity: null,
    });
  },
}));
