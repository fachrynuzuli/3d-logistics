import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useLogisticsStore } from '../../store/useLogisticsStore';

export const ConveyorBelt: React.FC = () => {
  const isPlaying = useLogisticsStore((s) => s.isPlaying);
  const speedMultiplier = useLogisticsStore((s) => s.speedMultiplier);

  const rollersRef = useRef<THREE.Group>(null);
  const parcelsGroupRef = useRef<THREE.Group>(null);

  // Moving parcels state along conveyor
  const parcels = React.useMemo(() => [
    { id: 'cv-1', color: '#fbbf24', offset: 0.1 },
    { id: 'cv-2', color: '#38bdf8', offset: 0.35 },
    { id: 'cv-3', color: '#f43f5e', offset: 0.6 },
    { id: 'cv-4', color: '#34d399', offset: 0.85 },
  ], []);

  useFrame((_, delta) => {
    if (!isPlaying) return;
    const speed = delta * 1.5 * speedMultiplier;

    // Spin rollers
    if (rollersRef.current) {
      rollersRef.current.children.forEach((roller) => {
        roller.rotation.x += speed * 4;
      });
    }

    // Move parcels along the belt
    if (parcelsGroupRef.current) {
      parcelsGroupRef.current.children.forEach((child) => {
        child.position.z += speed * 2.2;
        // Loop back when reaching end of conveyor
        if (child.position.z > 8.0) {
          child.position.z = -7.0;
        }
      });
    }
  });

  return (
    <group position={[13, 0, 0]}>
      {/* Conveyor Bed Frame */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.2, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>

      {/* Conveyor Belt Surface (Dark Matte Rubber Clay) */}
      <mesh position={[0, 0.81, 0]} receiveShadow>
        <boxGeometry args={[1.2, 0.04, 15.8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.95} />
      </mesh>

      {/* Safety Guard Rails (Clay Yellow) */}
      <mesh position={[-0.7, 0.95, 0]}>
        <boxGeometry args={[0.08, 0.3, 16]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.7} />
      </mesh>
      <mesh position={[0.7, 0.95, 0]}>
        <boxGeometry args={[0.08, 0.3, 16]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.7} />
      </mesh>

      {/* Support Legs */}
      {[-7, -3.5, 0, 3.5, 7].map((lz, idx) => (
        <group key={`leg-${idx}`} position={[0, 0.35, lz]}>
          <mesh position={[-0.6, 0, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.7, 12]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </mesh>
          <mesh position={[0.6, 0, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.7, 12]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </mesh>
          {/* Cross brace */}
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[1.2, 0.05, 0.05]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Cylindrical Rollers */}
      <group ref={rollersRef}>
        {Array.from({ length: 18 }).map((_, i) => (
          <mesh 
            key={`rol-${i}`} 
            position={[0, 0.83, -7 + i * 0.85]} 
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.04, 0.04, 1.25, 12]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Moving Parcels */}
      <group ref={parcelsGroupRef}>
        {parcels.map((p, idx) => (
          <group 
            key={p.id} 
            position={[0, 1.15, -7 + idx * 3.8]}
          >
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.65, 0.5, 0.65]} />
              <meshStandardMaterial color={p.color} roughness={0.85} />
            </mesh>
            {/* Parcel Tape */}
            <mesh position={[0, 0.255, 0]}>
              <boxGeometry args={[0.18, 0.015, 0.67]} />
              <meshStandardMaterial color="#d97706" roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Parcel Transfer Sensor / Scanner Arch */}
      <group position={[0, 1.3, 0]}>
        <mesh position={[-0.75, 0, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1.0, 12]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        <mesh position={[0.75, 0, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1.0, 12]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.55, 0.1, 0.2]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {/* Optical Sensor Eye */}
        <mesh position={[0, 0.42, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial 
            color="#ef4444" 
            emissive="#ef4444" 
            emissiveIntensity={0.8} 
          />
        </mesh>
      </group>
    </group>
  );
};
