import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { BoxItem } from '../../types/logistics';
import { useLogisticsStore } from '../../store/useLogisticsStore';
import { getHeatmapColor } from '../../utils/clayMaterials';

interface ClayBoxProps {
  box: BoxItem;
}

export const ClayBox: React.FC<ClayBoxProps> = ({ box }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const selectedEntity = useLogisticsStore((s) => s.selectedEntity);
  const setSelectedEntity = useLogisticsStore((s) => s.setSelectedEntity);
  const heatmapMode = useLogisticsStore((s) => s.heatmapMode);

  const isSelected = selectedEntity?.type === 'box' && selectedEntity.id === box.id;

  // Juicy squash and stretch animation on hover or selection
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetScale = isSelected ? 1.15 : (hovered ? 1.08 : 1.0);
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale), 
      delta * 12
    );
  });

  if (box.isPicked) return null; // Box is in transit or picked

  // Heatmap color evaluation
  let displayColor = box.color;
  if (heatmapMode === 'occupancy') {
    displayColor = '#10b981'; // Green for in-stock
  } else if (heatmapMode === 'activity') {
    displayColor = getHeatmapColor(Math.min(1.0, box.pickCount / 5));
  }

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setSelectedEntity({ type: 'box', id: box.id });
  };

  return (
    <group 
      ref={meshRef} 
      position={box.position}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main Rounded Clay Box Mesh */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.75, 0.6, 0.75]} />
        <meshStandardMaterial 
          color={displayColor} 
          roughness={0.88} 
          metalness={0.03}
        />
      </mesh>

      {/* Stylized Clay Sealing Tape */}
      <mesh position={[0, 0.305, 0]}>
        <boxGeometry args={[0.22, 0.015, 0.77]} />
        <meshStandardMaterial 
          color="#d97706" 
          roughness={0.9} 
          metalness={0.02} 
        />
      </mesh>

      {/* Stylized White Shipping Label */}
      <mesh position={[0, 0.05, 0.38]}>
        <planeGeometry args={[0.32, 0.22]} />
        <meshStandardMaterial 
          color="#f8fafc" 
          roughness={0.95} 
          metalness={0.01} 
        />
      </mesh>

      {/* Tiny Clay Barcode Lines on Label */}
      <mesh position={[0, 0.02, 0.385]}>
        <planeGeometry args={[0.22, 0.06]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>

      {/* Selection Halo Indicator */}
      {isSelected && (
        <mesh position={[0, -0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.65, 32]} />
          <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};
