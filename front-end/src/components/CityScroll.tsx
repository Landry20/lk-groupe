import { Canvas, useFrame } from '@react-three/fiber'
import { useScroll, useSpring, type MotionValue } from 'framer-motion'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { Color, Object3D, PerspectiveCamera } from 'three'
import type { InstancedMesh } from 'three'
import { useTheme } from '../context/ThemeContext'

type Block = {
  x: number
  z: number
  h: number
  w: number
  d: number
  color: string
}

function makeCity(dark: boolean) {
  const blocks: Block[] = []
  const palettes = dark
    ? ["#00234e", "#0a3a7a", "#123d6b", "#1a4f8c", "#071428"]
    : ["#f4f7fb", "#dbe7f4", "#c5d6ea", "#8fb4d8", "#00234e"]
  for (let x = -9; x <= 9; x += 1) {
    for (let z = -12; z <= 36; z += 1) {
      if (Math.abs(x) <= 1) continue
      if (Math.abs(x) === 5 && z % 4 === 0) continue
      const seed = Math.abs((x * 31 + z * 17) * 13) % 100
      const h = 0.7 + (seed % 18) * 0.38 + (Math.abs(x) > 6 ? 1.4 : 0)
      blocks.push({
        x: x * 1.55,
        z: z * 1.7,
        h,
        w: 1.05 + (seed % 5) * 0.08,
        d: 1.05 + ((seed * 3) % 4) * 0.08,
        color: palettes[seed % palettes.length],
      })
    }
  }
  return blocks
}

function Buildings({ dark }: { dark: boolean }) {
  const mesh = useRef<InstancedMesh>(null)
  const blocks = useMemo(() => makeCity(dark), [dark])
  const dummy = useMemo(() => new Object3D(), [])

  useLayoutEffect(() => {
    if (!mesh.current) return
    blocks.forEach((block, i) => {
      dummy.position.set(block.x, block.h / 2, block.z)
      dummy.scale.set(block.w, block.h, block.d)
      dummy.updateMatrix()
      mesh.current!.setMatrixAt(i, dummy.matrix)
      mesh.current!.setColorAt(i, new Color(block.color))
    })
    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  }, [blocks, dummy])

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, blocks.length]} castShadow>
      <boxGeometry />
      <meshStandardMaterial metalness={dark ? 0.35 : 0.06} roughness={dark ? 0.42 : 0.64} />
    </instancedMesh>
  )
}

function Windows({ dark }: { dark: boolean }) {
  const mesh = useRef<InstancedMesh>(null)
  const lights = useMemo(() => {
    const list: { x: number; y: number; z: number; orange: boolean }[] = []
    for (let i = 0; i < 220; i++) {
      const side = i % 2 === 0 ? 1 : -1
      const col = 2 + (i % 7)
      list.push({
        x: side * col * 1.55,
        y: 0.4 + (i % 12) * 0.55,
        z: -10 + (i * 0.38) % 48,
        orange: i % 5 === 0,
      })
    }
    return list
  }, [])
  const dummy = useMemo(() => new Object3D(), [])

  useLayoutEffect(() => {
    if (!mesh.current) return
    lights.forEach((light, i) => {
      dummy.position.set(light.x, light.y, light.z)
      dummy.scale.set(dark ? 0.12 : 0.14, dark ? 0.16 : 0.18, 0.04)
      dummy.updateMatrix()
      mesh.current!.setMatrixAt(i, dummy.matrix)
      mesh.current!.setColorAt(i, new Color(
        dark
          ? (light.orange ? "#ff7900" : "#4aa4ff")
          : (light.orange ? "#f4d2a8" : "#7aa7d4"),
      ))
    })
    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  }, [dark, dummy, lights])

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, lights.length]}>
      <boxGeometry />
      <meshStandardMaterial
        color={dark ? "#4aa4ff" : "#8eb6d6"}
        emissive={dark ? "#4aa4ff" : "#cfe6ff"}
        emissiveIntensity={dark ? 0.9 : 0.22}
        metalness={dark ? 0.2 : 0.45}
        roughness={dark ? 0.35 : 0.18}
        toneMapped={!dark}
      />
    </instancedMesh>
  )
}

function Ground({ dark }: { dark: boolean }) {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 12]} receiveShadow>
        <planeGeometry args={[42, 80]} />
        <meshStandardMaterial color={dark ? "#070b14" : "#c9d7e8"} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 12]}>
        <planeGeometry args={[2.4, 80]} />
        <meshStandardMaterial color={dark ? "#111827" : "#8fa3bb"} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 12]}>
        <planeGeometry args={[0.08, 80]} />
        <meshStandardMaterial
          color="#ff7900"
          emissive="#ff7900"
          emissiveIntensity={dark ? 0.4 : 0.18}
        />
      </mesh>
    </>
  )
}

function Flight({ progress }: { progress: MotionValue<number> }) {
  useFrame(({ camera }) => {
    const cam = camera as PerspectiveCamera
    const t = progress.get()
    const z = -16 + t * 46
    const y = 11.5 * (1 - t) * (1 - t) + 1.35 + Math.sin(t * Math.PI) * 0.35
    const x = Math.sin(t * Math.PI * 1.6) * (1.15 * (1 - t * 0.35))
    cam.position.set(x, y, z)
    const targetZ = z + 7 + t * 3
    cam.lookAt(Math.sin(t * 2) * 0.3, 1.1 + (1 - t) * 1.4, targetZ)
    cam.fov = 38 + t * 10
    cam.updateProjectionMatrix()
  })

  return null
}

function CityWorld({ progress, dark }: { progress: MotionValue<number>; dark: boolean }) {
  const sky = dark ? "#05070d" : "#cfe4fb"
  const fogFar = dark ? 38 : 52

  return (
    <>
      <color attach="background" args={[sky]} />
      <fog attach="fog" args={[sky, dark ? 10 : 16, fogFar]} />
      {dark ? (
        <>
          <ambientLight intensity={0.22} />
          <directionalLight position={[8, 14, 6]} intensity={1.15} color="#9ecbff" />
          <pointLight position={[0, 4, 8]} intensity={22} color="#007bff" />
          <pointLight position={[-6, 3, 18]} intensity={16} color="#ff7900" />
        </>
      ) : (
        <>
          <hemisphereLight args={["#b7d7ff", "#e7d7c4", 0.95]} />
          <ambientLight intensity={0.62} />
          <directionalLight position={[14, 22, 8]} intensity={2.15} color="#fff4dc" />
          <directionalLight position={[-10, 8, -6]} intensity={0.35} color="#7fb2ff" />
          <pointLight position={[0, 6, 10]} intensity={8} color="#ffffff" />
        </>
      )}
      <Ground dark={dark} />
      <Buildings dark={dark} />
      <Windows dark={dark} />
      <Flight progress={progress} />
    </>
  )
}

export function CityScroll() {
  const { theme } = useTheme()
  const dark = theme === "dark"
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 28, restDelta: 0.001 })

  return (
    <div className={`city-fixed ${dark ? "is-dark" : "is-light"}`} aria-hidden="true">
      <div className="city-canvas">
        <Canvas key={theme} camera={{ position: [0, 12, -16], fov: 42 }} dpr={[1, 1.5]}>
          <CityWorld progress={progress} dark={dark} />
        </Canvas>
      </div>
    </div>
  )
}
