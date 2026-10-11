import React from 'react';
import { WarehouseCanvas } from './components/scene/WarehouseCanvas';
import { TopNavbar } from './components/ui/TopNavbar';
import { ControlBar } from './components/ui/ControlBar';
import { CameraSelector } from './components/ui/CameraSelector';
import { InspectorModal } from './components/ui/InspectorModal';
import { FleetStatusPanel } from './components/ui/FleetStatusPanel';
import { HeatmapLegend } from './components/ui/HeatmapLegend';

export const App: React.FC = () => {
  return (
    <main className="app-container">
      {/* 3D WebGL Canvas Layer */}
      <section className="canvas-viewport" aria-label="3D Warehouse Simulation Viewport">
        <WarehouseCanvas />
      </section>

      {/* Modern Claymorphic HUD Overlay */}
      <section className="hud-overlay" aria-label="Control Interface">
        {/* Top Navbar */}
        <TopNavbar />

        {/* Side Panels (Inspector Drawer & Heatmap Legend) */}
        <div className="side-panel-wrap">
          <InspectorModal />
          <HeatmapLegend />
        </div>

        {/* Bottom Dock Controls */}
        <div className="bottom-dock">
          {/* Left: Quick Fleet Status */}
          <FleetStatusPanel />

          {/* Center: Core Simulation Controls & Order Dispatch */}
          <ControlBar />

          {/* Right: Camera View Modes */}
          <CameraSelector />
        </div>
      </section>
    </main>
  );
};

export default App;
