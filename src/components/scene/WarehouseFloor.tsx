import React from 'react';
import { useLogisticsStore } from '../../store/useLogisticsStore';
import { getHeatmapColor } from '../../utils/clayMaterials';

export const WarehouseFloor: React.FC = () => {
  const heatmapMode = useLogisticsStore((s) => s.heatmapMode);
  const boxes = useLogisticsStore((s) => s.boxes);

  // Generate heatmap grid cells (e.g. 10x8 grid across warehouse floor)
  const gridCells = React.useMemo(() => {
    const cells = [];
    for (let x = -20; x <= 20; x += 4) {
      for (let z = -15; z <= 15; z += 3.5) {
        // Calculate heat intensity based on nearby boxes picking activity
        let heat = 0.1;
        Object.values(boxes).forEach((box) => {
          const d = Math.hypot(box.position[0] - x, box.position[2] - z);
          if (d < 4) {
            heat += heatmapMode === 'activity' ? box.pickCount * 0.15 : (box.isPicked ? 0.05 : 0.25);
          }
        });
        cells.push({
          x,
          z,
          intensity: Math.min(1.0, heat),
        });
      }
    }
    return cells;
  }, [boxes, heatmapMode]);

  return (
    <group position={[0, 0, 0]}>
      {/* Main Clay Concrete Floor Slab */}
      <mesh receiveShadow position={[0, -0.2, 0]}>
        <boxGeometry args={[46, 0.4, 34]} />
        <meshStandardMaterial 
          color="#e8e4db" 
          roughness={0.92} 
          metalness={0.02} 
        />
      </mesh>

      {/* Decorative Beveled Outer Base Border */}
      <mesh receiveShadow position={[0, -0.4, 0]}>
        <boxGeometry args={[47.5, 0.2, 35.5]} />
        <meshStandardMaterial 
          color="#cfc9bd" 
          roughness={0.95} 
          metalness={0.02} 
        />
      </mesh>

      {/* Aisle Safety Markings (Clay Yellow Tape) */}
      {/* North Corridor Line */}
      <mesh position={[0, 0.01, -13.5]}>
        <planeGeometry args={[38, 0.25]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.8} />
      </mesh>
      {/* South Corridor Line */}
      <mesh position={[0, 0.01, 12.5]}>
        <planeGeometry args={[38, 0.25]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.8} />
      </mesh>

      {/* Aisle Guide Stripes */}
      {[-8, -1, 6].map((aisleX, idx) => (
        <group key={`stripe-${idx}`}>
          <mesh position={[aisleX - 1.8, 0.01, 0]}>
            <planeGeometry args={[0.15, 24]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
          </mesh>
          <mesh position={[aisleX + 1.8, 0.01, 0]}>
            <planeGeometry args={[0.15, 24]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Interactive Heatmap Floor Overlay */}
      {heatmapMode !== 'none' && (
        <group position={[0, 0.02, 0]}>
          {gridCells.map((cell, idx) => (
            <mesh key={`heat-${idx}`} position={[cell.x, 0, cell.z]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[3.8, 3.3]} />
              <meshStandardMaterial 
                color={getHeatmapColor(cell.intensity)} 
                transparent 
                opacity={0.45} 
                roughness={0.9} 
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};
