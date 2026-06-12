import { useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { resizeTexture } from '../utils/resizeTexture'
import * as THREE from 'three'

interface SaturnoProps {
  alHacerClick: (e: ThreeEvent<MouseEvent>) => void;
  activo: boolean;
}

export function Saturno({ alHacerClick, activo }: SaturnoProps) {
  const orbitaRef = useRef<THREE.Group>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)
  const [planetTexture, ringTexture] = useTexture(
    ['./textures/8k_saturn.jpg', './textures/8k_saturn_ring_alpha.png'],
    (textures) => {
      const [planet, ring] = textures as THREE.Texture[]
      resizeTexture(planet, 2048)
      resizeTexture(ring, 1024)
    }
  )

  useFrame((_state, delta) => {
    if (orbitaRef.current) {
      if (activo) {
        orbitaRef.current.rotation.y = THREE.MathUtils.lerp(
          orbitaRef.current.rotation.y, 0, 1 - Math.exp(-3 * delta)
        )
      } else {
        orbitaRef.current.rotation.y += 0.045 * delta
      }
    }
    if (meshRef.current) meshRef.current.rotation.y += 0.30 * delta
  })

  return (
    <group ref={orbitaRef}>
      <group position={[195, 0, 0]}>
        {/* Inclinación axial de Saturno ~27° */}
        <group rotation={[0, 0, 0.47]} onClick={alHacerClick}>
          <mesh ref={meshRef} scale={3.8}>
            <sphereGeometry args={[1, 28, 28]} />
            <meshStandardMaterial map={planetTexture} roughness={0.6} />
          </mesh>
          {/* Anillos en el plano ecuatorial */}
          <mesh scale={3.8} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.35, 2.28, 80]} />
            <meshStandardMaterial
              map={ringTexture}
              side={THREE.DoubleSide}
              transparent
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>
    </group>
  )
}
