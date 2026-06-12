import { useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface NeptunoProps {
  alHacerClick: (e: ThreeEvent<MouseEvent>) => void;
  activo: boolean;
}

export function Neptuno({ alHacerClick, activo }: NeptunoProps) {
  const orbitaRef = useRef<THREE.Group>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)
  const texture = useTexture('./textures/2k_neptune.jpg')

  useFrame((_state, delta) => {
    if (orbitaRef.current) {
      if (activo) {
        orbitaRef.current.rotation.y = THREE.MathUtils.lerp(
          orbitaRef.current.rotation.y, 0, 1 - Math.exp(-3 * delta)
        )
      } else {
        orbitaRef.current.rotation.y += 0.024 * delta
      }
    }
    if (meshRef.current) meshRef.current.rotation.y += 0.15 * delta
  })

  return (
    <group ref={orbitaRef}>
      <mesh ref={meshRef} position={[290, 0, 0]} scale={2.7} onClick={alHacerClick}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial map={texture} roughness={0.4} metalness={0.1} />
      </mesh>
    </group>
  )
}
