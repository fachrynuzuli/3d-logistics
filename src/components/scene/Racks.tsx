import React from 'react';
import { useLogisticsStore } from '../../store/useLogisticsStore';
import { ClayBox } from './ClayBox';

export const Racks: React.FC = () => {
  const racks = useLogisticsStore((s) => s.racks);
  const boxes = useLogisticsStore((s) => s.boxes);
  const setSelectedEntity = useLogisticsStore((s) => s.setSelectedEntity);
  const selectedEntity = useLogisticsStore((s) => s.selectedEntity);

  return (
    <group position={[0, 0, 0]}>
      {racks.map((rack) => {
        const isRackSelected = selectedEntity?.type === 'rack' && selectedEntity.id === rack.id;

        return (
          <group 
            key={rack.id} 
            position={rack.position}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedEntity({ type: 'rack', id: rack.id });
            }}
          >
            {/* 4 Vertical Clay Upright Columns */}
            {[
              [-0.9, -0.9],
              [-0.9, 0.9],
              [0.9, -0.9],
              [0.9, 0.9],
            ].map(([cx, cz], pIdx) => (
              <mesh key={`post-${pIdx}`} position={[cx, 2.3, cz]} castShadow receiveShadow>
                <boxGeometry args={[0.16, 4.6, 0.16]} />
                <meshStandardMaterial 
                  color={isRackSelected ? '#0284c7' : '#334155'} 
                  roughness={0.85} 
                  metalness={0.05} 
                />
              </mesh>
            ))}

            {/* Shelf Levels (3 Tiers) */}
            {[0.6, 1.75, 2.95].map((shelfY, sIdx) => (
              <group key={`shelf-${sIdx}`}>
                {/* Horizontal Safety Beams (Orange Clay) */}
                <mesh position={[0, shelfY, -0.9]} castShadow>
                  <boxGeometry args={[1.9, 0.14, 0.12]} />
                  <meshStandardMaterial color="#ea580c" roughness={0.8} />
                </mesh>
                <mesh position={[0, shelfY, 0.9]} castShadow>
                  <boxGeometry args={[1.9, 0.14, 0.12]} />
                  <meshStandardMaterial color="#ea580c" roughness={0.8} />
                </mesh>

                {/* Wire Mesh / Wood Shelf Base Plate */}
                <mesh position={[0, shelfY + 0.05, 0]} receiveShadow>
                  <boxGeometry args={[1.75, 0.06, 1.7]} />
                  <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
                </mesh>

                {/* Wooden Clay Pallets */}
                {[-0.45, 0.45].map((px, palletIdx) => (
                  <mesh key={`pal-${palletIdx}`} position={[px, shelfY + 0.12, 0]} castShadow>
                    <boxGeometry args={[0.8, 0.08, 0.8]} />
                    <meshStandardMaterial color="#b48854" roughness={0.92} />
                  </mesh>
                ))}
              </group>
            ))}

            {/* Aisle Sign Plate on Top of Rack */}
            <mesh position={[0, 4.65, 0]} castShadow>
              <boxGeometry args={[0.9, 0.35, 0.08]} />
              <meshStandardMaterial color="#0284c7" roughness={0.8} />
            </mesh>

            {/* Render Boxes belonging to this rack */}
            {rack.boxIds.map((boxId) => {
              const box = boxes[boxId];
              return box ? <ClayBox key={box.id} box={box} /> : null;
            })}
          </group>
        );
      })}
    </group>
  );
};
