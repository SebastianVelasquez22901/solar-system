import { useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { resizeTexture } from '../utils/resizeTexture'
import * as THREE from 'three'

interface JupiterProps {
  alHacerClick: (e: ThreeEvent<MouseEvent>) => void;
  activo: boolean;
}

export function Jupiter({ alHacerClick, activo }: JupiterProps) {
  const orbitaRef = useRef<THREE.Group>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)
  const texture = useTexture('./textures/8k_jupiter.jpg', (t) => {
    resizeTexture(t as THREE.Texture, 2048)
  })

  useFrame((_state, delta) => {
    if (orbitaRef.current) {
      if (activo) {
        orbitaRef.current.rotation.y = THREE.MathUtils.lerp(
          orbitaRef.current.rotation.y, 0, 1 - Math.exp(-3 * delta)
        )
      } else {
        orbitaRef.current.rotation.y += 0.06 * delta
      }
    }
    if (meshRef.current) meshRef.current.rotation.y += 0.36 * delta
  })

  return (
    <group ref={orbitaRef}>
      <mesh ref={meshRef} position={[145, 0, 0]} scale={4.5} onClick={alHacerClick}>
        <sphereGeometry args={[1, 28, 28]} />
        <meshStandardMaterial map={texture} roughness={0.7} />
      </mesh>
    </group>
  )
}
