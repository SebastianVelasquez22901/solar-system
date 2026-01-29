import { useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface SolProps {
  alHacerClick: (e: ThreeEvent<MouseEvent>) => void;
}

export function Sol({ alHacerClick }: SolProps) {
  const solRef = useRef<THREE.Mesh>(null!)
  // Asegúrate de tener la textura 'sun.jpg'
  const colorMap = useTexture('/textures/sun.webp')

  useFrame(() => {
    if (solRef.current) {
      solRef.current.rotation.y += 0.0005 
    }
  })

  return (
    <group>
      {/* Luz que emite el sol */}
      <pointLight intensity={2} decay={0} distance={300} color="#ffaa00" />
      <ambientLight intensity={0.1} />

      <mesh 
        ref={solRef} 
        scale={5} 
        onClick={alHacerClick}
        // Posición 0,0,0 (Centro)
        position={[0, 0, 0]}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial map={colorMap} /> 
      </mesh>
    </group>
  )
}