import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Flame, 
  PackagePlus 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLogisticsStore } from '../../store/useLogisticsStore';

export const ControlBar: React.FC = () => {
  const isPlaying = useLogisticsStore((s) => s.isPlaying);
  const togglePlay = useLogisticsStore((s) => s.togglePlay);
  const speedMultiplier = useLogisticsStore((s) => s.speedMultiplier);
  const setSpeedMultiplier = useLogisticsStore((s) => s.setSpeedMultiplier);
  const heatmapMode = useLogisticsStore((s) => s.heatmapMode);
  const setHeatmapMode = useLogisticsStore((s) => s.setHeatmapMode);
  const dispatchPickOrder = useLogisticsStore((s) => s.dispatchPickOrder);
  const resetSimulation = useLogisticsStore((s) => s.resetSimulation);

  const handleDispatch = () => {
    dispatchPickOrder();
    // Playful confetti pop
    confetti({
      particleCount: 28,
      spread: 60,
      origin: { y: 0.85 },
      colors: ['#f59e0b', '#3b82f6', '#10b981', '#f43f5e'],
    });
  };

  const cycleHeatmap = () => {
    if (heatmapMode === 'none') {
      setHeatmapMode('occupancy');
    } else if (heatmapMode === 'occupancy') {
      setHeatmapMode('activity');
    } else {
      setHeatmapMode('none');
    }
  };

  return (
    <div className="control-bar" role="toolbar" aria-label="Simulation Controls">
      {/* Play / Pause Toggle */}
      <button 
        className={`clay-btn clay-btn-icon ${isPlaying ? '' : 'active'}`}
        onClick={togglePlay}
        title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
        aria-label={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>

      {/* Speed Multipliers */}
      <div className="speed-group" title="Simulation Speed Multiplier">
        {[1, 2, 5].map((speed) => (
          <button
            key={speed}
            className={`speed-btn ${speedMultiplier === speed ? 'active' : ''}`}
            onClick={() => setSpeedMultiplier(speed)}
          >
            {speed}x
          </button>
        ))}
      </div>

      <div style={{ width: 1, height: 24, background: '#cbd5e1' }} />

      {/* Primary Action: Dispatch Order */}
      <button 
        className="clay-btn clay-btn-primary"
        onClick={handleDispatch}
        title="Dispatch an AGV robot to pick a box"
      >
        <PackagePlus size={18} strokeWidth={2.4} />
        <span>Dispatch Order</span>
      </button>

      {/* Heatmap Toggle */}
      <button
        className={`clay-btn ${heatmapMode !== 'none' ? 'active' : ''}`}
        onClick={cycleHeatmap}
        title="Toggle Floor & Rack Heatmap (Off / Occupancy / Activity)"
      >
        <Flame 
          size={18} 
          color={heatmapMode !== 'none' ? '#ef4444' : '#64748b'} 
        />
        <span>
          Heatmap: {heatmapMode === 'none' ? 'Off' : heatmapMode === 'occupancy' ? 'Stock' : 'Activity'}
        </span>
      </button>

      {/* Reset Simulation */}
      <button 
        className="clay-btn clay-btn-icon"
        onClick={resetSimulation}
        title="Reset Warehouse Simulation"
        aria-label="Reset Warehouse Simulation"
      >
        <RotateCcw size={16} />
      </button>
    </div>
  );
};
