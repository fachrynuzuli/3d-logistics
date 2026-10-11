import React from 'react';
import { Bot } from 'lucide-react';
import { useLogisticsStore } from '../../store/useLogisticsStore';

export const FleetStatusPanel: React.FC = () => {
  const agvs = useLogisticsStore((s) => s.agvs);
  const followedAgvId = useLogisticsStore((s) => s.followedAgvId);
  const setFollowedAgvId = useLogisticsStore((s) => s.setFollowedAgvId);
  const setSelectedEntity = useLogisticsStore((s) => s.setSelectedEntity);

  return (
    <div className="clay-card" style={{ width: 260 }} aria-label="AGV Fleet Overview">
      <div className="card-header" style={{ paddingBottom: 6 }}>
        <div className="card-title" style={{ fontSize: '0.88rem' }}>
          <Bot size={16} color="#3b82f6" />
          <span>Autonomous Fleet</span>
        </div>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10b981' }}>
          ONLINE
        </span>
      </div>

      <div className="fleet-strip">
        {agvs.map((agv) => {
          const isSelected = followedAgvId === agv.id;
          const batteryColor = agv.battery > 60 ? '#10b981' : (agv.battery > 25 ? '#f59e0b' : '#ef4444');

          return (
            <div
              key={agv.id}
              className={`agv-pill ${isSelected ? 'active' : ''}`}
              onClick={() => {
                setSelectedEntity({ type: 'agv', id: agv.id });
                setFollowedAgvId(agv.id);
              }}
              title={`Click to focus camera on ${agv.name} (${agv.status})`}
            >
              <div 
                className="agv-pill-dot" 
                style={{ background: agv.color }} 
              />
              <span className="agv-pill-name">{agv.name.split('-')[1]}</span>
              <span className="agv-pill-batt" style={{ color: batteryColor }}>
                {agv.battery}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
