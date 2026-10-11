// Warehouse coordinates & Waypoints Navigation

export interface Waypoint {
  id: string;
  x: number;
  z: number;
  connections: string[];
}

export const CHARGING_PADS: [number, number, number][] = [
  [-4.5, 0.2, 14],
  [-1.5, 0.2, 14],
  [1.5, 0.2, 14],
  [4.5, 0.2, 14],
];

export const CONVEYOR_DROP_POINT: [number, number, number] = [12.5, 0.2, 0];
export const INBOUND_PICKUP_POINT: [number, number, number] = [-14, 0.2, 0];
export const OUTBOUND_STAGE_POINT: [number, number, number] = [18, 0.2, 4];

/**
 * Calculates straight line distance
 */
export function distance2D(x1: number, z1: number, x2: number, z2: number): number {
  return Math.hypot(x2 - x1, z2 - z1);
}

/**
 * Builds a clean orthogonal warehouse path between current location and target destination
 * Route travels:
 * Start -> nearest corridor (Z = -14 or Z = 14) -> transfer along X -> enter target aisle -> reach target
 */
export function generateWarehousePath(
  start: [number, number, number],
  destination: [number, number, number]
): [number, number, number][] {
  const [startX, , startZ] = start;
  const [destX, , destZ] = destination;

  // If already very close, just go direct
  if (distance2D(startX, startZ, destX, destZ) < 1.0) {
    return [destination];
  }

  // Choose closer cross-aisle corridor: North (Z = -14) or South (Z = 13)
  const corridorZ = Math.abs(startZ - (-14)) + Math.abs(destZ - (-14)) <
                    Math.abs(startZ - 13) + Math.abs(destZ - 13)
    ? -14
    : 13;

  const path: [number, number, number][] = [];

  // 1. Move into the cross-aisle corridor from start if not already there
  if (Math.abs(startZ - corridorZ) > 0.5) {
    path.push([startX, 0.2, corridorZ]);
  }

  // 2. Travel along the cross corridor to align with destination X
  if (Math.abs(startX - destX) > 0.5) {
    path.push([destX, 0.2, corridorZ]);
  }

  // 3. Move along the aisle to destination Z
  path.push([destX, 0.2, destZ]);

  return path;
}
