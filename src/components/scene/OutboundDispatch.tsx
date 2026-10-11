import React from 'react';
import { useLogisticsStore } from '../../store/useLogisticsStore';

export const OutboundDispatch: React.FC = () => {
  const setSelectedEntity = useLogisticsStore((s) => s.setSelectedEntity);
  const selectedEntity = useLogisticsStore((s) => s.selectedEntity);

  const isSelected = selectedEntity?.type === 'zone' && selectedEntity.id === 'outbound-dispatch';

  return (
    <group 
      position={[18, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedEntity({ type: 'zone', id: 'outbound-dispatch' });
      }}
    >
      {/* Packaging Workbench Table */}
      <group position={[0, 0, -4]}>
        {/* Table Top */}
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.1, 1.2]} />
          <meshStandardMaterial 
            color={isSelected ? '#0284c7' : '#475569'} 
            roughness={0.8} 
          />
        </mesh>
        {/* Table Legs */}
        {[
          [-1.0, -0.45],
          [1.0, -0.45],
          [-1.0, 0.45],
          [1.0, 0.45],
        ].map(([lx, lz], idx) => (
          <mesh key={`tbl-${idx}`} position={[lx, 0.4, lz]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.8, 12]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
        ))}

        {/* Packing Computer Terminal */}
        <mesh position={[-0.6, 1.1, 0]} castShadow>
          <boxGeometry args={[0.5, 0.45, 0.08]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} />
        </mesh>
        {/* Glowing Screen */}
        <mesh position={[-0.6, 1.1, 0.05]}>
          <planeGeometry args={[0.42, 0.35]} />
          <meshStandardMaterial 
            color="#38bdf8" 
            emissive="#38bdf8" 
            emissiveIntensity={0.6} 
          />
        </mesh>
        {/* Barcode Scanner Gun */}
        <mesh position={[0.2, 0.9, 0.2]} rotation={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[0.12, 0.2, 0.25]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.8} />
        </mesh>
      </group>

      {/* Finished Pallet Stacks Ready for Dispatch */}
      {[
        { x: 0, z: 2.5, count: 4 },
        { x: 0, z: 5.5, count: 6 },
      ].map((stack, sIdx) => (
        <group key={`stk-${sIdx}`} position={[stack.x, 0, stack.z]}>
          {/* Wooden Pallet */}
          <mesh position={[0, 0.07, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.12, 1.5]} />
            <meshStandardMaterial color="#b48854" roughness={0.9} />
          </mesh>

          {/* Stacked Cargo Boxes */}
          <mesh position={[-0.35, 0.42, -0.35]} castShadow>
            <boxGeometry args={[0.65, 0.55, 0.65]} />
            <meshStandardMaterial color="#d97706" roughness={0.88} />
          </mesh>
          <mesh position={[0.35, 0.42, -0.35]} castShadow>
            <boxGeometry args={[0.65, 0.55, 0.65]} />
            <meshStandardMaterial color="#10b981" roughness={0.88} />
          </mesh>
          <mesh position={[-0.35, 0.42, 0.35]} castShadow>
            <boxGeometry args={[0.65, 0.55, 0.65]} />
            <meshStandardMaterial color="#3b82f6" roughness={0.88} />
          </mesh>
          <mesh position={[0.35, 0.42, 0.35]} castShadow>
            <boxGeometry args={[0.65, 0.55, 0.65]} />
            <meshStandardMaterial color="#8b5cf6" roughness={0.88} />
          </mesh>

          {/* Second Layer of Stack */}
          {stack.count > 4 && (
            <>
              <mesh position={[0, 0.95, -0.2]} castShadow>
                <boxGeometry args={[0.7, 0.5, 0.7]} />
                <meshStandardMaterial color="#ec4899" roughness={0.88} />
              </mesh>
              <mesh position={[0, 0.95, 0.3]} castShadow>
                <boxGeometry args={[0.6, 0.5, 0.6]} />
                <meshStandardMaterial color="#f59e0b" roughness={0.88} />
              </mesh>
            </>
          )}

          {/* Transparent Stretch Wrap Effect */}
          <mesh position={[0, 0.65, 0]}>
            <boxGeometry args={[1.52, 1.1, 1.52]} />
            <meshStandardMaterial 
              color="#ffffff" 
              transparent 
              opacity={0.15} 
              roughness={0.2} 
            />
          </mesh>
        </group>
      ))}

      {/* Cute Hand Pallet Jack (Yellow Clay) */}
      <group position={[1.8, 0, 0]} rotation={[0, -0.6, 0]}>
        {/* Forks */}
        <mesh position={[0, 0.08, 0.4]} castShadow>
          <boxGeometry args={[0.55, 0.06, 1.1]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.8} />
        </mesh>
        {/* Hydraulic Pump Chassis */}
        <mesh position={[0, 0.25, -0.2]} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.35]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.8} />
        </mesh>
        {/* Handle Steer Bar */}
        <mesh position={[0, 0.75, -0.35]} rotation={[-0.3, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.9, 8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        {/* Handle Grip */}
        <mesh position={[0, 1.15, -0.5]}>
          <boxGeometry args={[0.3, 0.04, 0.04]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};
