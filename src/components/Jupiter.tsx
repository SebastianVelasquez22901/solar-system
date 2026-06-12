import { useRef, useMemo, useEffect } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'

interface JupiterProps {
  alHacerClick: (e: ThreeEvent<MouseEvent>) => void;
  activo: boolean;
}

function crearTexturaJupiter(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  const bandas = [
    '#c88840', '#e8d4a0', '#c07030', '#f0e0b0',
    '#b86820', '#e8c878', '#d09050', '#f8e8c0',
    '#c88840', '#e0cc90', '#b86820', '#f0ddb0',
    '#d09050', '#e8c878', '#c88840', '#e8d4a0',
  ]
  const h = canvas.height / bandas.length
  bandas.forEach((color, i) => {
    ctx.fillStyle = color
    ctx.fillRect(0, Math.floor(i * h), canvas.width, Math.ceil(h) + 1)
  })
  // Gran Mancha Roja aproximada
  ctx.fillStyle = 'rgba(180, 80, 40, 0.7)'
  ctx.beginPath()
  ctx.ellipse(180, 155, 35, 20, 0, 0, Math.PI * 2)
  ctx.fill()
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  return tex
}

export function Jupiter({ alHacerClick, activo }: JupiterProps) {
  const orbitaRef = useRef<THREE.Group>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)
  const texture = useMemo(crearTexturaJupiter, [])

  useEffect(() => () => texture.dispose(), [texture])

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
