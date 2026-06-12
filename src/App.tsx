import { useState, useEffect, Suspense } from 'react'
import { Canvas, useThree, type ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Stars, useProgress, AdaptiveDpr } from '@react-three/drei'
import { Tierra } from './components/Earth'
import { Venus } from './components/Venus'
import { Marte } from './components/Mars'
import { Mercurio } from './components/Mercury'
import { Sol } from './components/Sun'
import { Jupiter } from './components/Jupiter'
import { Saturno } from './components/Saturn'
import { Urano } from './components/Uranus'
import { Neptuno } from './components/Neptune'
import datosPlanetas from './data/planetas.json'
import gsap from 'gsap'
import * as THREE from 'three'

// --- DETECTAR SI ES MÓVIL ---
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(timer)
      timer = setTimeout(() => setIsMobile(window.innerWidth < 768), 150)
    }
    window.addEventListener('resize', handleResize)
    return () => { window.removeEventListener('resize', handleResize); clearTimeout(timer) }
  }, [])
  return isMobile
}

// --- PANTALLA DE CARGA ---
function PantallaCarga() {
  const { progress, active } = useProgress()
  const [terminado, setTerminado] = useState(false)
  
  useEffect(() => {
    if (!active && progress === 100) setTimeout(() => setTerminado(true), 500)
    else setTerminado(false)
  }, [active, progress])

  if (terminado) return null

  return (
    <div className={`absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ease-out ${!active && progress === 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-8 animate-pulse">
        EXPLORANDO...
      </div>
      <div className="w-64 md:w-96 h-1 bg-gray-800 rounded-full overflow-hidden relative">
        <div className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

// --- CONTROLADOR DE CÁMARA INTELIGENTE ---
function ControladorCamara({ objetivo, isMobile }: { objetivo: any, isMobile: boolean }) {
  const { camera, controls } = useThree<any>()

  useEffect(() => {
    // COORDENADAS: Deben coincidir con los archivos de tus componentes
    const X_PLANETAS: any = {
      sol: 0,
      mercurio: 25,
      venus: 45,
      tierra: 70,
      luna: 75,
      marte: 100,
      jupiter: 145,
      saturno: 195,
      urano: 240,
      neptuno: 290,
    }

    if (objetivo) {
      const idLimpio = objetivo.id.toLowerCase().trim()
      const targetX = X_PLANETAS[idLimpio]

      if (targetX === undefined) return

      // Configuración de Zoom por defecto
      let distZ = 12 
      let heightY = 4 
      let fov = 35

      // Ajustes específicos por planeta
      if (idLimpio === 'mercurio') { distZ = 8;  heightY = 2;  fov = 30; }
      if (idLimpio === 'venus')    { distZ = 12; heightY = 3;  fov = 30; }
      if (idLimpio === 'luna')     { distZ = 6;  heightY = 1;  fov = 25; }
      if (idLimpio === 'tierra')   { distZ = 14; heightY = 4;  fov = 35; }
      if (idLimpio === 'sol')      { distZ = 60; heightY = 10; fov = 45; }
      if (idLimpio === 'jupiter')  { distZ = 28; heightY = 10; fov = 40; }
      if (idLimpio === 'saturno')  { distZ = 40; heightY = 14; fov = 40; }
      if (idLimpio === 'urano')    { distZ = 22; heightY = 8;  fov = 35; }
      if (idLimpio === 'neptuno')  { distZ = 22; heightY = 8;  fov = 35; }

      if (isMobile) {
        distZ += 8
        heightY += 4
      }

      // Matar tweens anteriores para evitar solapamiento
      gsap.killTweensOf(camera.position)
      gsap.killTweensOf(camera)
      if (controls) gsap.killTweensOf(controls.target)

      // 1. ANIMAR OBJETIVO DE CONTROLES (El pivote de rotación)
      if (controls) {
        gsap.to(controls.target, {
          duration: 1.5,
          x: targetX,
          y: 0,
          z: 0,
          ease: "power2.out"
        })
      }

      // 2. ANIMAR POSICIÓN DE LA CÁMARA
      gsap.to(camera.position, {
        duration: 1.5,
        x: targetX,
        y: heightY,
        z: distZ,
        ease: "power2.out",
        onUpdate: () => {
          camera.fov = THREE.MathUtils.lerp(camera.fov, fov, 0.1)
          camera.updateProjectionMatrix()
        }
      })

    } else {
      // RESET A VISTA GENERAL
      gsap.killTweensOf(camera.position)
      gsap.killTweensOf(camera)
      if (controls) {
        gsap.killTweensOf(controls.target)
        gsap.to(controls.target, { duration: 2, x: 0, y: 0, z: 0 })
      }

      gsap.to(camera.position, {
        duration: 2,
        x: 0, y: 100, z: 200,
        ease: "power3.inOut",
        onUpdate: () => {
          camera.fov = THREE.MathUtils.lerp(camera.fov, 45, 0.1)
          camera.updateProjectionMatrix()
        }
      })
    }

    return () => {
      gsap.killTweensOf(camera.position)
      gsap.killTweensOf(camera)
      if (controls) gsap.killTweensOf(controls.target)
    }
  }, [objetivo, isMobile, camera, controls])

  return null
}

function App() {
  const [planetaActivo, setPlanetaActivo] = useState<any>(null)
  const isMobile = useIsMobile()

  const activar = (id: string, e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    const datos = datosPlanetas.find(p => p.id === id)
    setPlanetaActivo(datos)
  }

  return (
    <div className="h-screen w-full bg-black relative overflow-hidden font-sans">
      <PantallaCarga />
      
      <Canvas
        camera={{ position: [0, 100, 200], fov: 50 }}
        gl={{ powerPreference: "high-performance", antialias: !isMobile }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.15} />
        <AdaptiveDpr pixelated />

        <Suspense fallback={null}>
          <Sol alHacerClick={(e) => activar('sol', e)} />
          <Mercurio alHacerClick={(e) => activar('mercurio', e)} activo={planetaActivo?.id === 'mercurio'} />
          <Venus alHacerClick={(e) => activar('venus', e)} activo={planetaActivo?.id === 'venus'} />
          <Tierra 
            alHacerClick={(e) => activar('tierra', e)} 
            alHacerClickLuna={(e) => activar('luna', e)} 
            activo={planetaActivo?.id === 'tierra'} 
            lunaActiva={planetaActivo?.id === 'luna'} 
          />
          <Marte alHacerClick={(e) => activar('marte', e)} activo={planetaActivo?.id === 'marte'} />
          <Jupiter alHacerClick={(e) => activar('jupiter', e)} activo={planetaActivo?.id === 'jupiter'} />
          <Saturno alHacerClick={(e) => activar('saturno', e)} activo={planetaActivo?.id === 'saturno'} />
          <Urano alHacerClick={(e) => activar('urano', e)} activo={planetaActivo?.id === 'urano'} />
          <Neptuno alHacerClick={(e) => activar('neptuno', e)} activo={planetaActivo?.id === 'neptuno'} />

          <Stars radius={500} count={6000} factor={4} fade speed={0.5} />
        </Suspense>

        <OrbitControls makeDefault enablePan={false} minDistance={3} maxDistance={600} enableDamping dampingFactor={0.05} regress />
        
        <ControladorCamara objetivo={planetaActivo} isMobile={isMobile} />
      </Canvas>

      {/* PANEL DE DATOS */}
      {planetaActivo && (
        <div className={`
          absolute z-50 bg-black/80 backdrop-blur-md border border-white/10 text-white 
          transition-all duration-500 animate-in fade-in slide-in-from-bottom-10 
          bottom-0 left-0 w-full rounded-t-3xl p-6 shadow-2xl 
          md:top-10 md:right-10 md:bottom-auto md:left-auto md:w-80 md:rounded-2xl md:slide-in-from-right-10
        `}>
          <button onClick={() => setPlanetaActivo(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">✕</button>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-200 to-orange-500 bg-clip-text text-transparent">
            {planetaActivo.nombre}
          </h2>
          <div className="max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-gray-300 text-sm leading-relaxed mb-4">{planetaActivo.descripcion}</p>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <h3 className="text-xs font-bold text-orange-300 uppercase tracking-widest mb-2">Datos Clave</h3>
              <ul className="space-y-2">
                {planetaActivo.datosCuriosos?.map((dato: string, i: number) => (
                  <li key={i} className="text-xs text-gray-300 pl-3 border-l border-orange-500/50">{dato}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {!planetaActivo && (
        <div className="absolute bottom-8 w-full text-center pointer-events-none animate-pulse z-40">
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase">Selecciona un planeta</p>
        </div>
      )}
    </div>
  )
}

export default App