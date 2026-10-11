import * as THREE from 'three';

export const CLAY_PALETTE = {
  floor: '#dedad2',
  floorGrid: '#cfc9be',
  rackPillars: '#334155',
  rackBeams: '#f97316',
  rackShelves: '#e2e8f0',
  conveyorFrame: '#475569',
  conveyorBelt: '#1e293b',
  conveyorRoller: '#cbd5e1',
  truckCab: '#3b82f6',
  truckTrailer: '#f1f5f9',
  truckWheel: '#1e293b',
  chargerBase: '#64748b',
  chargerPad: '#10b981',
  palletWood: '#c29b68',
  boxes: [
    { main: '#fbbf24', accent: '#f59e0b', label: 'Tech & Gadgets' },
    { main: '#f87171', accent: '#ef4444', label: 'Fragile Glass' },
    { main: '#34d399', accent: '#10b981', label: 'Eco Goods' },
    { main: '#60a5fa', accent: '#3b82f6', label: 'Hardware' },
    { main: '#c084fc', accent: '#a855f7', label: 'Apparel' },
    { main: '#fb923c', accent: '#ea580c', label: 'Tech & Gadgets' },
  ],
  agvs: [
    { color: '#fbbf24', accent: '#d97706', name: 'Bot-Alpha' },
    { color: '#38bdf8', accent: '#0284c7', name: 'Bot-Beta' },
    { color: '#a78bfa', accent: '#7c3aed', name: 'Bot-Gamma' },
    { color: '#4ade80', accent: '#16a34a', name: 'Bot-Delta' },
  ],
};

/**
 * Creates a tactile clay material with soft matte finish
 */
export function createClayMaterial(color: string | number, options?: {
  roughness?: number;
  metalness?: number;
  emissive?: string | number;
  emissiveIntensity?: number;
}) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: options?.roughness ?? 0.88,
    metalness: options?.metalness ?? 0.04,
    emissive: options?.emissive ? new THREE.Color(options.emissive) : new THREE.Color(0x000000),
    emissiveIntensity: options?.emissiveIntensity ?? 0,
    flatShading: false,
  });
}

/**
 * Heatmap color gradient interpolator
 * value: 0.0 (low) to 1.0 (high)
 */
export function getHeatmapColor(value: number): string {
  // Cool Blue -> Green -> Yellow -> Vibrant Red
  const clamped = Math.max(0, Math.min(1, value));
  if (clamped < 0.25) {
    return '#38bdf8'; // Sky blue
  } else if (clamped < 0.5) {
    return '#4ade80'; // Bright green
  } else if (clamped < 0.75) {
    return '#facc15'; // Warm yellow
  } else {
    return '#f43f5e'; // Bright hot rose/red
  }
}
