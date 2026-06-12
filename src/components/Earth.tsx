import { useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { resizeTexture } from '../utils/resizeTexture'
import * as THREE from 'three'
import { Luna } from './Moon'

interface TierraProps {
  alHacerClick: (e: ThreeEvent<MouseEvent>) => void;
  alHacerClickLuna: (e: ThreeEvent<MouseEvent>) => void;
  activo: boolean;
  lunaActiva: boolean;
}

export function Tierra({ alHacerClick, alHacerClickLuna, activo, lunaActiva }: TierraProps) {
  const orbitaRef = useRef<THREE.Group>(null!)
  const planetaRef = useRef<THREE.Group>(null!)
  const [colorMap, cloudsMap] = useTexture(
    ['./textures/earth.webp', './textures/earth_clouds.webp'],
    (textures) => {
      const [color, clouds] = textures as THREE.Texture[]
      resizeTexture(color, 2048)
      resizeTexture(clouds, 1024)
    }
  )

  useFrame((_state, delta) => {
    if (orbitaRef.current) {
      if (activo || lunaActiva) {
        orbitaRef.current.rotation.y = THREE.MathUtils.lerp(
          orbitaRef.current.rotation.y, 0, 1 - Math.exp(-3 * delta)
        )
      } else {
        orbitaRef.current.rotation.y += 0.12 * delta
      }
    }
    if (planetaRef.current) planetaRef.current.rotation.y += 0.12 * delta
  })

  return (
    <group ref={orbitaRef}>
      {/* ¡IMPORTANTE! Posición 70 */}
      <group position={[70, 0, 0]}>
        <group ref={planetaRef} onClick={alHacerClick}>
          <mesh scale={2.5}><sphereGeometry args={[1, 32, 32]} /><meshPhongMaterial map={colorMap} shininess={5} /></mesh>
          <mesh scale={2.53}><sphereGeometry args={[1, 24, 24]} /><meshStandardMaterial map={cloudsMap} transparent opacity={0.6} depthWrite={false} /></mesh>
        </group>
        <Luna alHacerClick={alHacerClickLuna} activo={lunaActiva} />
      </group>
    </group>
  )
}
