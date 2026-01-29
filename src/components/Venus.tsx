import { useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface VenusProps {
  alHacerClick: (e: ThreeEvent<MouseEvent>) => void;
  activo: boolean;
}

export function Venus({ alHacerClick, activo }: VenusProps) {
  const orbitaRef = useRef<THREE.Group>(null!)
  const planetaRef = useRef<THREE.Group>(null!)
  const [surfaceMap, atmosphereMap] = useTexture(['./textures/venus_surface.webp', './textures/venus_atmosphere.webp'])

  useFrame(() => {
    if (orbitaRef.current) {
      if (activo) {
        orbitaRef.current.rotation.y = THREE.MathUtils.lerp(orbitaRef.current.rotation.y, 0, 0.05)
      } else {
        orbitaRef.current.rotation.y += 0.003 
      }
    }
    if (planetaRef.current) planetaRef.current.rotation.y -= 0.001 
  })

  return (
    <group ref={orbitaRef}>
      {/* ¡IMPORTANTE! Posición 45 */}
      <group position={[45, 0, 0]} ref={planetaRef} onClick={alHacerClick}>
        <mesh scale={2.2}><sphereGeometry args={[1, 32, 32]} /><meshStandardMaterial map={surfaceMap} /></mesh>
        <mesh scale={2.25}><sphereGeometry args={[1, 32, 32]} /><meshStandardMaterial map={atmosphereMap} transparent opacity={0.9} side={THREE.DoubleSide} /></mesh>
      </group>
    </group>
  )
}