/* eslint-disable react/no-unknown-property */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';

// ============================================
// To swap in a real .glb model later:
// import { useGLTF } from '@react-three/drei';
// function CampusBuildings() {
//   const { scene } = useGLTF('/campus.glb');
//   return <primitive object={scene} scale={1} />;
// }
// ============================================

function CampusBuildings() {
  return (
    <group>
      {/* Main Building */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[4, 3, 6]} />
        <meshStandardMaterial color="#c8c8c8" roughness={0.7} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 3.15, 0]}>
        <boxGeometry args={[4.4, 0.3, 6.4]} />
        <meshStandardMaterial color="#909090" roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Left Wing */}
      <mesh position={[-3.25, 1, 0]}>
        <boxGeometry args={[2.5, 2, 3]} />
        <meshStandardMaterial color="#d0d0d0" roughness={0.7} />
      </mesh>
      <mesh position={[-3.25, 2.1, 0]}>
        <boxGeometry args={[2.9, 0.2, 3.4]} />
        <meshStandardMaterial color="#909090" roughness={0.5} />
      </mesh>

      {/* Right Wing */}
      <mesh position={[3.25, 1, 0]}>
        <boxGeometry args={[2.5, 2, 3]} />
        <meshStandardMaterial color="#d0d0d0" roughness={0.7} />
      </mesh>
      <mesh position={[3.25, 2.1, 0]}>
        <boxGeometry args={[2.9, 0.2, 3.4]} />
        <meshStandardMaterial color="#909090" roughness={0.5} />
      </mesh>

      {/* Columns (4x at entrance) */}
      {[-1.2, -0.4, 0.4, 1.2].map((x) => (
        <mesh key={x} position={[x, 1.4, 3.05]}>
          <cylinderGeometry args={[0.12, 0.12, 2.8, 8]} />
          <meshStandardMaterial color="#e0e0e0" roughness={0.3} />
        </mesh>
      ))}

      {/* Entrance Steps */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.06 + i * 0.12, 3.5 + i * 0.3]}>
          <boxGeometry args={[3, 0.12, 0.5]} />
          <meshStandardMaterial color="#b0b0b0" roughness={0.6} />
        </mesh>
      ))}

      {/* Ground Plane */}
      <mesh position={[0, -0.025, 0]}>
        <boxGeometry args={[12, 0.05, 10]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.9} />
      </mesh>
    </group>
  );
}

function RotatingCampus({ progressRef }) {
  const groupRef = useRef();

  useFrame(() => {
    if (!groupRef.current || progressRef.current === undefined) return;
    const rotationProgress = Math.min(progressRef.current / 0.7, 1);
    const eased = rotationProgress < 0.5
      ? 2 * rotationProgress * rotationProgress
      : 1 - (-2 * rotationProgress + 2) ** 2 / 2;
    groupRef.current.rotation.y = eased * Math.PI * 2;
  });

  return (
    <group ref={groupRef}>
      <CampusBuildings />
    </group>
  );
}

export default function CampusScene({ progressRef }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1} />
      <directionalLight position={[-3, 4, -2]} intensity={0.3} />
      <RotatingCampus progressRef={progressRef} />
      <Environment preset="city" />
    </>
  );
}
