import { useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { resizeTexture } from '../utils/resizeTexture'
import * as THREE from 'three'

interface MarteProps {
  alHacerClick: (e: ThreeEvent<MouseEvent>) => void;
  activo: boolean;
}

export function Marte({ alHacerClick, activo }: MarteProps) {
  const orbitaRef = useRef<THREE.Group>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)
  const colorMap = useTexture('./textures/mars.webp', (t) => {
    resizeTexture(t as THREE.Texture, 2048)
  })

  useFrame((_state, delta) => {
    if (orbitaRef.current) {
      if (activo) {
        orbitaRef.current.rotation.y = THREE.MathUtils.lerp(
          orbitaRef.current.rotation.y, 0, 1 - Math.exp(-3 * delta)
        )
      } else {
        orbitaRef.current.rotation.y += 0.09 * delta
      }
    }
    if (meshRef.current) meshRef.current.rotation.y += 0.24 * delta
  })

  return (
    <group ref={orbitaRef}>
      {/* ¡IMPORTANTE! Posición 100 */}
      <mesh ref={meshRef} position={[100, 0, 0]} scale={1.8} onClick={alHacerClick}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshStandardMaterial map={colorMap} roughness={0.7} />
      </mesh>
    </group>
  )
}
