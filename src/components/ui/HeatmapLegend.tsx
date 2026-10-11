import React from 'react';
import { Flame } from 'lucide-react';
import { useLogisticsStore } from '../../store/useLogisticsStore';

export const HeatmapLegend: React.FC = () => {
  const heatmapMode = useLogisticsStore((s) => s.heatmapMode);

  if (heatmapMode === 'none') return null;

  return (
    <div className="heatmap-legend" aria-label="Heatmap Legend">
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0f172a' }}>
        <Flame size={14} color="#ef4444" />
        <span>
          {heatmapMode === 'occupancy' ? 'Stock Occupancy' : 'Picking Activity'}
        </span>
      </div>
      <div className="heatmap-gradient-bar" />
      <div className="heatmap-labels">
        <span>Low</span>
        <span>Medium</span>
        <span>High Heat</span>
      </div>
    </div>
  );
};
