import React from 'react';
import { CHARGING_PADS } from '../../utils/pathfinding';
import { useLogisticsStore } from '../../store/useLogisticsStore';

export const ChargingStation: React.FC = () => {
  const agvs = useLogisticsStore((s) => s.agvs);

  return (
    <group position={[0, 0, 0]}>
      {CHARGING_PADS.map(([px, , pz], idx) => {
        // Check if an AGV is currently near this pad
        const occupiedAgv = agvs.find(
          (a) => Math.hypot(a.position[0] - px, a.position[2] - pz) < 1.2
        );
        const isCharging = occupiedAgv && (occupiedAgv.status === 'charging' || occupiedAgv.status === 'idle');

        return (
          <group key={`chg-${idx}`} position={[px, 0, pz]}>
            {/* Ground Induction Plate */}
            <mesh position={[0, 0.02, 0]} receiveShadow>
              <cylinderGeometry args={[0.9, 0.95, 0.04, 32]} />
              <meshStandardMaterial color="#475569" roughness={0.8} />
            </mesh>

            {/* Glowing Clay Charging Ring */}
            <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.65, 0.8, 32]} />
              <meshBasicMaterial 
                color={isCharging ? '#10b981' : '#64748b'} 
              />
            </mesh>

            {/* Charging Pylon Post */}
            <group position={[0, 0, -1.2]}>
              {/* Pillar */}
              <mesh position={[0, 0.8, 0]} castShadow>
                <boxGeometry args={[0.3, 1.6, 0.25]} />
                <meshStandardMaterial color="#334155" roughness={0.7} />
              </mesh>

              {/* Status Indicator Screen */}
              <mesh position={[0, 1.25, 0.13]}>
                <planeGeometry args={[0.22, 0.3]} />
                <meshStandardMaterial 
                  color={isCharging ? '#10b981' : '#f59e0b'} 
                  emissive={isCharging ? '#10b981' : '#f59e0b'} 
                  emissiveIntensity={0.8} 
                />
              </mesh>

              {/* Energy Bolt / Lightning Icon Clay Accent */}
              <mesh position={[0, 1.45, 0.14]}>
                <boxGeometry args={[0.06, 0.14, 0.02]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
};
