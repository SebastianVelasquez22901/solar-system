import { useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { Luna } from './Moon' // Ojo con la ruta de tu archivo Luna

interface TierraProps {
  alHacerClick: (e: ThreeEvent<MouseEvent>) => void;
  alHacerClickLuna: (e: ThreeEvent<MouseEvent>) => void;
  activo: boolean;
  lunaActiva: boolean;
}

export function Tierra({ alHacerClick, alHacerClickLuna, activo, lunaActiva }: TierraProps) {
  const orbitaRef = useRef<THREE.Group>(null!)
  const planetaRef = useRef<THREE.Group>(null!)
  const [colorMap, cloudsMap] = useTexture(['/textures/earth.webp', '/textures/earth_clouds.webp'])

  useFrame(() => {
    if (orbitaRef.current) {
      if (activo || lunaActiva) {
        orbitaRef.current.rotation.y = THREE.MathUtils.lerp(orbitaRef.current.rotation.y, 0, 0.05)
      } else {
        orbitaRef.current.rotation.y += 0.002
      }
    }
    if (planetaRef.current) planetaRef.current.rotation.y += 0.002
  })

  return (
    <group ref={orbitaRef}>
      {/* ¡IMPORTANTE! Posición 70 */}
      <group position={[70, 0, 0]}>
        <group ref={planetaRef} onClick={alHacerClick}>
          <mesh scale={2.5}><sphereGeometry args={[1, 32, 32]} /><meshPhongMaterial map={colorMap} shininess={5} /></mesh>
          <mesh scale={2.53}><sphereGeometry args={[1, 32, 32]} /><meshStandardMaterial map={cloudsMap} transparent opacity={0.8} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} /></mesh>
        </group>
        <Luna alHacerClick={alHacerClickLuna} activo={lunaActiva} />
      </group>
    </group>
  )
}