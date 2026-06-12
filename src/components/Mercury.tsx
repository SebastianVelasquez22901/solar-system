import { useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface MercurioProps {
  alHacerClick: (e: ThreeEvent<MouseEvent>) => void;
  activo: boolean;
}

export function Mercurio({ alHacerClick, activo }: MercurioProps) {
  const orbitaRef = useRef<THREE.Group>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)
  const colorMap = useTexture('./textures/mercury.webp')

  useFrame((_state, delta) => {
    if (orbitaRef.current) {
      if (activo) {
        orbitaRef.current.rotation.y = THREE.MathUtils.lerp(
          orbitaRef.current.rotation.y, 0, 1 - Math.exp(-3 * delta)
        )
      } else {
        orbitaRef.current.rotation.y += 0.24 * delta
      }
    }
    if (meshRef.current) meshRef.current.rotation.y += 0.06 * delta
  })

  return (
    <group ref={orbitaRef}>
      {/* ¡IMPORTANTE! Posición 25 para coincidir con App.tsx */}
      <mesh ref={meshRef} position={[25, 0, 0]} scale={0.8} onClick={alHacerClick}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial map={colorMap} roughness={0.9} metalness={0.1} />
      </mesh>
    </group>
  )
}