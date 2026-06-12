import { useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface UranoProps {
  alHacerClick: (e: ThreeEvent<MouseEvent>) => void;
  activo: boolean;
}

export function Urano({ alHacerClick, activo }: UranoProps) {
  const orbitaRef = useRef<THREE.Group>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)
  const texture = useTexture('./textures/2k_uranus.jpg')

  useFrame((_state, delta) => {
    if (orbitaRef.current) {
      if (activo) {
        orbitaRef.current.rotation.y = THREE.MathUtils.lerp(
          orbitaRef.current.rotation.y, 0, 1 - Math.exp(-3 * delta)
        )
      } else {
        orbitaRef.current.rotation.y += 0.032 * delta
      }
    }
    if (meshRef.current) meshRef.current.rotation.y += 0.15 * delta
  })

  return (
    <group ref={orbitaRef}>
      {/* Urano tiene una inclinación axial de ~98°, gira de costado */}
      <group position={[240, 0, 0]} rotation={[0, 0, 1.71]} onClick={alHacerClick}>
        <mesh ref={meshRef} scale={2.8}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial map={texture} roughness={0.3} metalness={0.05} />
        </mesh>
        {/* Anillos finos en el plano ecuatorial */}
        <mesh scale={2.8} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.28, 1.55, 64]} />
          <meshStandardMaterial
            color="#a8f0ec"
            side={THREE.DoubleSide}
            transparent
            opacity={0.28}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  )
}
