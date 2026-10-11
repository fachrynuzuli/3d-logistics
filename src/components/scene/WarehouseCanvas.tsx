import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useLogisticsStore } from '../../store/useLogisticsStore';
import { WarehouseFloor } from './WarehouseFloor';
import { Racks } from './Racks';
import { AgvFleet } from './AgvFleet';
import { ConveyorBelt } from './ConveyorBelt';
import { InboundDock } from './InboundDock';
import { OutboundDispatch } from './OutboundDispatch';
import { ChargingStation } from './ChargingStation';

/**
 * Camera Controller handling Orbit, Top-Down, and Follow AGV tracking
 */
const CameraManager: React.FC = () => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  
  const cameraMode = useLogisticsStore((s) => s.cameraMode);
  const followedAgvId = useLogisticsStore((s) => s.followedAgvId);
  const agvs = useLogisticsStore((s) => s.agvs);
  const tickSimulation = useLogisticsStore((s) => s.tickSimulation);

  useFrame((_, delta) => {
    // Tick the central logistics simulation engine
    tickSimulation(delta);

    if (cameraMode === 'followAgv' && followedAgvId) {
      const targetAgv = agvs.find((a) => a.id === followedAgvId);
      if (targetAgv) {
        // Calculate smooth chase camera behind the AGV
        const dist = 5.5;
        const height = 3.8;
        const camX = targetAgv.position[0] - Math.sin(targetAgv.rotation) * dist;
        const camZ = targetAgv.position[2] - Math.cos(targetAgv.rotation) * dist;
        const camY = targetAgv.position[1] + height;

        camera.position.lerp(new THREE.Vector3(camX, camY, camZ), delta * 4);
        
        if (controlsRef.current) {
          controlsRef.current.target.lerp(
            new THREE.Vector3(targetAgv.position[0], 0.8, targetAgv.position[2]),
            delta * 6
          );
          controlsRef.current.update();
        }
      }
    } else if (cameraMode === 'topDown') {
      // Smoothly transition camera directly above warehouse
      camera.position.lerp(new THREE.Vector3(0, 36, 0.01), delta * 3.5);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), delta * 5);
        controlsRef.current.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={cameraMode === 'topDown' ? 0.05 : Math.PI / 2 - 0.05}
      minDistance={6}
      maxDistance={60}
      target={[0, 0, 0]}
    />
  );
};

export const WarehouseCanvas: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        shadows
        camera={{ position: [0, 24, 28], fov: 42 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        {/* Soft Clay Studio Background */}
        <color attach="background" args={['#ece7de']} />
        <fog attach="fog" args={['#ece7de', 45, 95]} />

        {/* Studio Lighting System */}
        <ambientLight color="#fff7ed" intensity={0.7} />
        
        {/* Main Sun / Key Light */}
        <directionalLight
          position={[-18, 28, 22]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={1}
          shadow-camera-far={70}
          shadow-camera-left={-28}
          shadow-camera-right={28}
          shadow-camera-top={24}
          shadow-camera-bottom={-24}
          shadow-bias={-0.0003}
        />

        {/* Soft Fill Light from opposite angle */}
        <directionalLight
          position={[22, 16, -18]}
          intensity={0.45}
          color="#dbeafe"
        />

        {/* Subtle Rim / Overhead Light */}
        <hemisphereLight
          color="#ffffff"
          groundColor="#cbd5e1"
          intensity={0.4}
        />

        {/* Warehouse Scene Objects */}
        <group position={[0, 0, 0]}>
          <WarehouseFloor />
          <Racks />
          <AgvFleet />
          <ConveyorBelt />
          <InboundDock />
          <OutboundDispatch />
          <ChargingStation />
        </group>

        {/* Interactive Camera Controller */}
        <CameraManager />
      </Canvas>
    </div>
  );
};
