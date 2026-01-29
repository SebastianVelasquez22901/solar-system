import { useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface MarteProps {
  alHacerClick: (e: ThreeEvent<MouseEvent>) => void;
  activo: boolean;
}

export function Marte({ alHacerClick, activo }: MarteProps) {
  const orbitaRef = useRef<THREE.Group>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)
  const colorMap = useTexture('./textures/mars.webp')

  useFrame(() => {
    if (orbitaRef.current) {
      if (activo) {
        orbitaRef.current.rotation.y = THREE.MathUtils.lerp(orbitaRef.current.rotation.y, 0, 0.05)
      } else {
        orbitaRef.current.rotation.y += 0.0015 
      }
    }
    if (meshRef.current) meshRef.current.rotation.y += 0.004
  })

  return (
    <group ref={orbitaRef}>
      {/* ¡IMPORTANTE! Posición 100 */}
      <mesh ref={meshRef} position={[100, 0, 0]} scale={1.8} onClick={alHacerClick}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial map={colorMap} roughness={0.7} />
      </mesh>
    </group>
  )
}