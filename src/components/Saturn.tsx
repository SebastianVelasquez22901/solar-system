import { useRef, useMemo, useEffect } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'

interface SaturnoProps {
  alHacerClick: (e: ThreeEvent<MouseEvent>) => void;
  activo: boolean;
}

function crearTexturaAnillos(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 4
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createLinearGradient(0, 0, 512, 0)
  grad.addColorStop(0,    'rgba(180, 148, 80, 0)')
  grad.addColorStop(0.04, 'rgba(190, 155, 80, 0.6)')
  grad.addColorStop(0.12, 'rgba(220, 190, 120, 0.9)')
  grad.addColorStop(0.22, 'rgba(200, 170, 100, 0.75)')
  grad.addColorStop(0.35, 'rgba(170, 138, 68, 0.4)')
  grad.addColorStop(0.48, 'rgba(215, 182, 108, 0.88)')
  grad.addColorStop(0.62, 'rgba(195, 162, 90, 0.6)')
  grad.addColorStop(0.75, 'rgba(208, 175, 105, 0.82)')
  grad.addColorStop(0.88, 'rgba(185, 152, 78, 0.45)')
  grad.addColorStop(0.96, 'rgba(195, 160, 82, 0.2)')
  grad.addColorStop(1,    'rgba(180, 148, 80, 0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 512, 4)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

export function Saturno({ alHacerClick, activo }: SaturnoProps) {
  const orbitaRef = useRef<THREE.Group>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)
  const ringTexture = useMemo(crearTexturaAnillos, [])

  useEffect(() => () => ringTexture.dispose(), [ringTexture])

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
            <meshStandardMaterial color="#e8d4a8" roughness={0.6} />
          </mesh>
          {/* Anillos en el plano ecuatorial (perpendicular al eje del planeta) */}
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
