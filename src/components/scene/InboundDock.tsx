import React from 'react';
import { useLogisticsStore } from '../../store/useLogisticsStore';

export const InboundDock: React.FC = () => {
  const setSelectedEntity = useLogisticsStore((s) => s.setSelectedEntity);
  const selectedEntity = useLogisticsStore((s) => s.selectedEntity);

  const isSelected = selectedEntity?.type === 'zone' && selectedEntity.id === 'inbound-dock';

  return (
    <group 
      position={[-18, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedEntity({ type: 'zone', id: 'inbound-dock' });
      }}
    >
      {/* Dock Platform Elevation */}
      <mesh position={[2, 0.4, 0]} receiveShadow castShadow>
        <boxGeometry args={[4.5, 0.8, 14]} />
        <meshStandardMaterial 
          color={isSelected ? '#0284c7' : '#94a3b8'} 
          roughness={0.9} 
        />
      </mesh>

      {/* Yellow Safety Hazard Stripes along Dock Edge */}
      <mesh position={[4.26, 0.79, 0]}>
        <boxGeometry args={[0.08, 0.04, 14]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.8} />
      </mesh>

      {/* Safety Bollards */}
      {[-6, -2, 2, 6].map((bz, idx) => (
        <group key={`boll-${idx}`} position={[4.1, 0.8, bz]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.8, 12]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.105, 0.105, 0.15, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Dock Roll-up Door Wall Frame */}
      <mesh position={[-0.5, 2.5, 0]} castShadow>
        <boxGeometry args={[0.3, 4.2, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      {/* Roll-up Shutter (Partially Open) */}
      <mesh position={[-0.3, 3.4, 0]}>
        <boxGeometry args={[0.1, 2.0, 7.2]} />
        <meshStandardMaterial color="#64748b" roughness={0.8} />
      </mesh>

      {/* Stylized Cartoon Clay Delivery Truck */}
      <group position={[-5.8, 0, 0]}>
        {/* Truck Trailer Box */}
        <mesh position={[0, 1.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[7, 2.8, 3.2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.85} />
        </mesh>
        {/* Trailer Accent Stripe */}
        <mesh position={[0, 1.8, 1.61]}>
          <planeGeometry args={[6.8, 0.35]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.8} />
        </mesh>

        {/* Truck Cab (Blue Clay) */}
        <mesh position={[-4.5, 1.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 2.0, 3.0]} />
          <meshStandardMaterial color="#2563eb" roughness={0.8} />
        </mesh>
        {/* Cab Windshield (Cyan Clay Glass) */}
        <mesh position={[-5.76, 1.6, 0]}>
          <boxGeometry args={[0.1, 0.8, 2.6]} />
          <meshStandardMaterial 
            color="#38bdf8" 
            roughness={0.2} 
            metalness={0.1} 
          />
        </mesh>
        {/* Truck Bumper & Grille */}
        <mesh position={[-5.8, 0.5, 0]} castShadow>
          <boxGeometry args={[0.2, 0.5, 2.8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>

        {/* Chunky Truck Wheels */}
        {[
          [-4.5, 0.45, 1.6],
          [-4.5, 0.45, -1.6],
          [1.5, 0.45, 1.6],
          [1.5, 0.45, -1.6],
          [2.8, 0.45, 1.6],
          [2.8, 0.45, -1.6],
        ].map(([wx, wy, wz], wIdx) => (
          <mesh key={`tw-${wIdx}`} position={[wx, wy, wz]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.35, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.95} />
          </mesh>
        ))}
      </group>

      {/* Staged Pallets & Arrived Boxes on Dock */}
      {[
        { x: 1.8, z: -3.5, color: '#f59e0b' },
        { x: 1.8, z: -2.0, color: '#10b981' },
        { x: 2.2, z: 2.5, color: '#6366f1' },
        { x: 2.2, z: 4.0, color: '#ec4899' },
      ].map((item, idx) => (
        <group key={`inbox-${idx}`} position={[item.x, 0.8, item.z]}>
          {/* Pallet */}
          <mesh position={[0, 0.05, 0]} castShadow>
            <boxGeometry args={[0.9, 0.1, 0.9]} />
            <meshStandardMaterial color="#c29b68" roughness={0.9} />
          </mesh>
          {/* Box */}
          <mesh position={[0, 0.42, 0]} castShadow>
            <boxGeometry args={[0.7, 0.55, 0.7]} />
            <meshStandardMaterial color={item.color} roughness={0.88} />
          </mesh>
        </group>
      ))}

      {/* Inbound Area Sign */}
      <mesh position={[2, 3.5, 6.5]} castShadow>
        <boxGeometry args={[1.6, 0.5, 0.1]} />
        <meshStandardMaterial color="#0284c7" roughness={0.8} />
      </mesh>
    </group>
  );
};
