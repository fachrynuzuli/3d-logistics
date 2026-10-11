import React from 'react';
import { Box, Activity, CheckCircle2, Layers } from 'lucide-react';
import { useLogisticsStore } from '../../store/useLogisticsStore';

export const TopNavbar: React.FC = () => {
  const agvs = useLogisticsStore((s) => s.agvs);
  const boxes = useLogisticsStore((s) => s.boxes);
  const racks = useLogisticsStore((s) => s.racks);
  const completedOrdersCount = useLogisticsStore((s) => s.completedOrdersCount);
  const isPlaying = useLogisticsStore((s) => s.isPlaying);

  // Calculate live warehouse metrics
  const activeBots = agvs.filter((a) => a.status !== 'idle' && a.status !== 'charging').length;
  const totalSlots = racks.reduce((acc, r) => acc + r.shelves * r.slotsPerShelf, 0);
  const occupiedBoxes = Object.values(boxes).filter((b) => !b.isPicked).length;
  const occupancyPercent = totalSlots > 0 ? Math.round((occupiedBoxes / totalSlots) * 100) : 0;

  return (
    <header className="top-navbar" role="banner">
      {/* Brand & Title */}
      <div className="brand-section">
        <div className="brand-icon">
          <Box size={24} strokeWidth={2.4} />
        </div>
        <div className="brand-title">
          <span>LogiClay 3D</span>
          <span className="brand-badge">Digital Twin</span>
        </div>
      </div>

      {/* KPI Chips */}
      <div className="kpi-group">
        {/* Active AGVs */}
        <div className="kpi-chip" title="Active AGVs moving or picking">
          <span className="icon-wrap">
            <Activity size={16} strokeWidth={2.2} />
          </span>
          <span>Fleet Active:</span>
          <span className="val">{activeBots} / {agvs.length}</span>
        </div>

        {/* Warehouse Storage Occupancy */}
        <div className="kpi-chip" title="Rack storage capacity utilized">
          <span className="icon-wrap">
            <Layers size={16} strokeWidth={2.2} />
          </span>
          <span>Storage:</span>
          <span className="val">{occupancyPercent}%</span>
        </div>

        {/* Orders Dispatched & Fulfilled */}
        <div className="kpi-chip" title="Orders fulfilled through conveyor">
          <span className="icon-wrap">
            <CheckCircle2 size={16} color="#10b981" strokeWidth={2.2} />
          </span>
          <span>Orders Fulfilled:</span>
          <span className="val">{completedOrdersCount}</span>
        </div>

        {/* Sim Status Indicator */}
        <div className="kpi-chip" title="Simulation loop state">
          <span 
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: isPlaying ? '#10b981' : '#f59e0b',
              boxShadow: isPlaying ? '0 0 6px #10b981' : 'none'
            }} 
          />
          <span style={{ fontSize: '0.8rem', color: isPlaying ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
            {isPlaying ? 'LIVE SIM' : 'PAUSED'}
          </span>
        </div>
      </div>
    </header>
  );
};
