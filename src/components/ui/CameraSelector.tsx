import React from 'react';
import { Eye, Compass, Video } from 'lucide-react';
import { useLogisticsStore } from '../../store/useLogisticsStore';
import type { CameraMode } from '../../types/logistics';

export const CameraSelector: React.FC = () => {
  const cameraMode = useLogisticsStore((s) => s.cameraMode);
  const setCameraMode = useLogisticsStore((s) => s.setCameraMode);
  const followedAgvId = useLogisticsStore((s) => s.followedAgvId);
  const setFollowedAgvId = useLogisticsStore((s) => s.setFollowedAgvId);
  const agvs = useLogisticsStore((s) => s.agvs);

  const handleModeChange = (mode: CameraMode) => {
    if (mode === 'followAgv' && !followedAgvId) {
      setFollowedAgvId(agvs[0]?.id || null);
    }
    setCameraMode(mode);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
      {/* Bot Selector Pill Strip (visible when in follow mode) */}
      {cameraMode === 'followAgv' && (
        <div style={{
          display: 'flex',
          gap: 6,
          background: 'rgba(247, 244, 238, 0.92)',
          backdropFilter: 'blur(10px)',
          padding: '6px 10px',
          borderRadius: '16px',
          boxShadow: 'var(--clay-shadow-sm)',
          border: '1px solid var(--clay-border)',
        }}>
          {agvs.map((agv) => (
            <button
              key={agv.id}
              onClick={() => setFollowedAgvId(agv.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-main)',
                fontSize: '0.78rem',
                fontWeight: 700,
                background: followedAgvId === agv.id ? agv.color : 'transparent',
                color: followedAgvId === agv.id ? '#0f172a' : '#64748b',
                boxShadow: followedAgvId === agv.id ? 'var(--clay-shadow-sm)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: agv.color }} />
              <span>{agv.name.split('-')[1]}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Camera Switcher Bar */}
      <div 
        style={{
          display: 'flex',
          gap: 6,
          background: 'rgba(247, 244, 238, 0.92)',
          backdropFilter: 'blur(12px)',
          padding: '8px 12px',
          borderRadius: '22px',
          border: '1px solid var(--clay-border)',
          boxShadow: 'var(--clay-shadow-md)',
        }}
        role="group"
        aria-label="Camera Views"
      >
        <button
          className={`clay-btn ${cameraMode === 'orbit' ? 'active' : ''}`}
          onClick={() => handleModeChange('orbit')}
          title="3D Orbit View"
        >
          <Compass size={16} />
          <span>3D Orbit</span>
        </button>

        <button
          className={`clay-btn ${cameraMode === 'topDown' ? 'active' : ''}`}
          onClick={() => handleModeChange('topDown')}
          title="2D Top-Down Floorplan"
        >
          <Eye size={16} />
          <span>Top-Down 2D</span>
        </button>

        <button
          className={`clay-btn ${cameraMode === 'followAgv' ? 'active' : ''}`}
          onClick={() => handleModeChange('followAgv')}
          title="Follow AGV Camera"
        >
          <Video size={16} />
          <span>Follow AGV</span>
        </button>
      </div>
    </div>
  );
};
