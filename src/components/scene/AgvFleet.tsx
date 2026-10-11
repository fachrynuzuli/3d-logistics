import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useLogisticsStore } from '../../store/useLogisticsStore';
import type { AGV, BoxItem } from '../../types/logistics';

export const AgvFleet: React.FC = () => {
  const agvs = useLogisticsStore((s) => s.agvs);
  const boxes = useLogisticsStore((s) => s.boxes);
  const selectedEntity = useLogisticsStore((s) => s.selectedEntity);
  const setSelectedEntity = useLogisticsStore((s) => s.setSelectedEntity);
  const setFollowedAgvId = useLogisticsStore((s) => s.setFollowedAgvId);

  return (
    <group position={[0, 0, 0]}>
      {agvs.map((agv) => (
        <SingleAgvBot
          key={agv.id}
          agv={agv}
          carriedBox={agv.carriedBoxId ? boxes[agv.carriedBoxId] : undefined}
          isSelected={selectedEntity?.type === 'agv' && selectedEntity.id === agv.id}
          onSelect={() => {
            setSelectedEntity({ type: 'agv', id: agv.id });
            setFollowedAgvId(agv.id);
          }}
        />
      ))}
    </group>
  );
};

interface SingleAgvProps {
  agv: AGV;
  carriedBox?: BoxItem;
  isSelected: boolean;
  onSelect: () => void;
}

const SingleAgvBot: React.FC<SingleAgvProps> = ({ agv, carriedBox, isSelected, onSelect }) => {
  const antennaRef = useRef<THREE.Group>(null);
  const liftPlatformRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group>(null);

  // Animation loop for antenna bobbing, wheel rotation, and lift platform raising
  useFrame((state, delta) => {
    const isMoving = agv.status === 'moving_to_pick' || agv.status === 'carrying' || agv.status === 'dropping';

    // Antenna bounce & tilt
    if (antennaRef.current) {
      if (isMoving) {
        antennaRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 10) * 0.12;
        antennaRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 8) * 0.08;
      } else {
        antennaRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.04;
      }
    }

    // Wheel spin when driving
    if (wheelsRef.current && isMoving) {
      wheelsRef.current.children.forEach((wheel) => {
        wheel.rotation.x += delta * 12;
      });
    }

    // Smooth scissor lift raising
    if (liftPlatformRef.current) {
      const targetLiftY = agv.carriedBoxId ? 0.35 : 0.05;
      liftPlatformRef.current.position.y = THREE.MathUtils.lerp(
        liftPlatformRef.current.position.y,
        targetLiftY,
        delta * 6
      );
    }
  });

  return (
    <group
      position={agv.position}
      rotation={[0, agv.rotation, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* AGV Main Rounded Clay Chassis */}
      <mesh castShadow receiveShadow position={[0, 0.28, 0]}>
        <boxGeometry args={[1.3, 0.35, 1.7]} />
        <meshStandardMaterial 
          color={agv.color} 
          roughness={0.85} 
          metalness={0.04} 
        />
      </mesh>

      {/* Safety Bumper Rim (Dark Clay Band) */}
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[1.36, 0.12, 1.76]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      {/* Expressive Twin Headlights / LED Eyes */}
      <mesh position={[-0.35, 0.3, 0.86]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
        <meshStandardMaterial 
          color="#38bdf8" 
          emissive="#38bdf8" 
          emissiveIntensity={0.8} 
          roughness={0.3} 
        />
      </mesh>
      <mesh position={[0.35, 0.3, 0.86]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
        <meshStandardMaterial 
          color="#38bdf8" 
          emissive="#38bdf8" 
          emissiveIntensity={0.8} 
          roughness={0.3} 
        />
      </mesh>

      {/* Taillights (Red LED Clay) */}
      <mesh position={[-0.35, 0.3, -0.86]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
        <meshStandardMaterial 
          color="#ef4444" 
          emissive="#ef4444" 
          emissiveIntensity={0.6} 
          roughness={0.3} 
        />
      </mesh>
      <mesh position={[0.35, 0.3, -0.86]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
        <meshStandardMaterial 
          color="#ef4444" 
          emissive="#ef4444" 
          emissiveIntensity={0.6} 
          roughness={0.3} 
        />
      </mesh>

      {/* Cute Bobbing Clay Antenna */}
      <group ref={antennaRef} position={[0.42, 0.45, -0.5]}>
        {/* Antenna Mast */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
          <meshStandardMaterial color="#475569" roughness={0.7} />
        </mesh>
        {/* Glowing Beacon Sphere */}
        <mesh position={[0, 0.52, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial 
            color={agv.status === 'charging' ? '#10b981' : '#f59e0b'} 
            emissive={agv.status === 'charging' ? '#10b981' : '#f59e0b'} 
            emissiveIntensity={0.9} 
          />
        </mesh>
      </group>

      {/* 4 Chunky Clay Wheels */}
      <group ref={wheelsRef}>
        {[
          [-0.65, 0.15, 0.55],
          [0.65, 0.15, 0.55],
          [-0.65, 0.15, -0.55],
          [0.65, 0.15, -0.55],
        ].map(([wx, wy, wz], idx) => (
          <mesh key={`wh-${idx}`} position={[wx, wy, wz]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.16, 18]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Scissor Lift Platform & Carried Box */}
      <group ref={liftPlatformRef} position={[0, 0.05, 0]}>
        {/* Metal Plate */}
        <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.05, 0.06, 1.3]} />
          <meshStandardMaterial color="#64748b" roughness={0.7} />
        </mesh>

        {/* Render Carried Box if present */}
        {carriedBox && (
          <group position={[0, 0.85, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.75, 0.6, 0.75]} />
              <meshStandardMaterial color={carriedBox.color} roughness={0.88} />
            </mesh>
            {/* Box Tape */}
            <mesh position={[0, 0.305, 0]}>
              <boxGeometry args={[0.22, 0.015, 0.77]} />
              <meshStandardMaterial color="#d97706" roughness={0.9} />
            </mesh>
          </group>
        )}
      </group>

      {/* Active Selection Ring */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.1, 1.3, 32]} />
          <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};
