# LogiClay 3D — Warehouse Logistics Digital Twin

An interactive 3D Warehouse Logistics Digital Twin and Autonomous AGV Fleet Simulator built in a playful **Cartoon Clay Model** visual style using **React 19**, **Three.js**, **React Three Fiber (`@react-three/fiber`, `@react-three/drei`)**, and custom **tactile claymorphism**.

![LogiClay 3D](https://raw.githubusercontent.com/fachrynuzuli/3d-logistics/main/preview.png)

## ✨ Features

- **Cartoon Clay Aesthetics**: 100% procedural 3D meshes (racks, parcels, AGVs, trucks, pallets, conveyors) with soft matte clay materials, studio key/fill lighting, and soft shadows.
- **Warehouse Zones**:
  - **Inbound Receiving Dock**: Stylized delivery truck, loading dock shutter, safety bollards, and arriving pallets.
  - **High-Bay Storage Racks**: 3-tier multi-aisle racks with color-coded clay boxes and wooden pallets.
  - **Dynamic Conveyor Loop**: Continuously moving parcels and spinning rollers.
  - **Outbound Staging & Dispatch**: Packaging workbench, terminal, shrink-wrapped pallet stacks, and clay pallet jack.
  - **AGV Charging Bays**: Ground induction plates and charging pylons with glowing LED battery indicators.
- **Autonomous AGV Fleet**:
  - 4 named robots (`Bot-Alpha`, `Beta`, `Gamma`, `Delta`) with rotating wheels, bobbing antennas, headlights, and elevating scissor lifts.
  - Aisle waypoint pathfinding and task state machine (picking, carrying, dropping, charging).
- **Interactive Claymorphic HUD**:
  - Live KPIs for active fleet, storage occupancy %, and fulfilled orders.
  - Camera mode transitions: **3D Orbit**, **Top-Down 2D Floorplan**, and **Follow AGV** chase cam.
  - Parcel & Bot Telemetry Inspector drawer with real-time stats and manual "Dispatch Pick" actions.
  - Dynamic Stock & Activity Heatmap overlays with color legend.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **State Management**: Zustand
- **Styling**: Vanilla CSS (Tactile Claymorphism)
- **Icons**: Lucide React
