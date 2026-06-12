import { useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface LunaProps {
  alHacerClick: (e: ThreeEvent<MouseEvent>) => void;
  activo: boolean;
}

export function Luna({ alHacerClick, activo }: LunaProps) {
  const orbitaRef = useRef<THREE.Group>(null!)
  const lunaMeshRef = useRef<THREE.Mesh>(null!)
  const colorMap = useTexture('./textures/moon.webp')

  useFrame((_state, delta) => {
    if (orbitaRef.current) {
      if (activo) {
        orbitaRef.current.rotation.y = THREE.MathUtils.lerp(
          orbitaRef.current.rotation.y, 0, 1 - Math.exp(-3 * delta)
        )
      } else {
        orbitaRef.current.rotation.y += 0.3 * delta
      }
    }
    if (lunaMeshRef.current) lunaMeshRef.current.rotation.y += 0.06 * delta
  })

  return (
    <group ref={orbitaRef}>
      {/* Esta posición [5, 0, 0] es la que sumada a la tierra da 75 */}
      <mesh ref={lunaMeshRef} position={[5, 0, 0]} scale={0.7} onClick={alHacerClick}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial map={colorMap} roughness={0.9} metalness={0.1} />
      </mesh>
    </group>
  )
}