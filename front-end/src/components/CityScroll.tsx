import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { Suspense, useLayoutEffect, useMemo, useRef } from 'react'
import {
  CanvasTexture,
  Color,
  DoubleSide,
  Object3D,
  PerspectiveCamera,
  SRGBColorSpace,
} from 'three'
import type { Group, InstancedMesh } from 'three'
import { asset } from '../lib/asset'
import { useTheme } from '../context/ThemeContext'

type Block = {
  x: number
  z: number
  h: number
  w: number
  d: number
  color: string
}

type Key = { t: number; p: [number, number, number]; l: [number, number, number] }

const HQ = { x: -14, z: 34 }

const path: Key[] = [
  { t: 0, p: [0, 14, -20], l: [0, 1.2, 8] },
  { t: 0.14, p: [0.15, 3.6, -11], l: [0, 1.35, 2] },
  { t: 0.3, p: [0.4, 2.45, -1], l: [0.2, 1.25, 10] },
  { t: 0.44, p: [0.25, 2.35, 9.2], l: [-5, 1.4, 12] },
  { t: 0.56, p: [-7, 2.35, 12], l: [-16, 1.35, 12] },
  { t: 0.66, p: [-13.6, 2.4, 12.4], l: [-14, 1.7, 22] },
  { t: 0.8, p: [-14, 2.7, 21], l: [-14, 4.2, 31] },
  { t: 0.9, p: [-14, 2.15, 27.2], l: [-14, 2.2, 31] },
  { t: 1, p: [-14, 2.45, 32.6], l: [-14, 3.4, 39.4] },
]

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function samplePath(t: number) {
  const u = Math.min(1, Math.max(0, t))
  let i = 1
  while (i < path.length && path[i].t < u) i += 1
  const a = path[i - 1]
  const b = path[i]
  const k = (u - a.t) / Math.max(0.0001, b.t - a.t)
  const s = k * k * (3 - 2 * k)
  return {
    p: [mix(a.p[0], b.p[0], s), mix(a.p[1], b.p[1], s), mix(a.p[2], b.p[2], s)] as const,
    l: [mix(a.l[0], b.l[0], s), mix(a.l[1], b.l[1], s), mix(a.l[2], b.l[2], s)] as const,
  }
}

function onRoad(x: number, z: number) {
  if (Math.abs(x) < 2.1 && z < 14.5) return true
  if (Math.abs(z - 12) < 2.1 && x < 2.2 && x > -17) return true
  if (Math.abs(x - HQ.x) < 2.1 && z > 10) return true
  if (Math.abs(x - HQ.x) < 5.2 && Math.abs(z - HQ.z) < 7) return true
  return false
}

function makeCity(dark: boolean) {
  const blocks: Block[] = []
  const palettes = dark
    ? ['#1b3358', '#0d2748', '#24486f', '#132033', '#00234e']
    : ['#f3f7fb', '#d7e4f2', '#c3d4e6', '#9bb6d0', '#eef3f8']
  for (let xi = -11; xi <= 8; xi += 1) {
    for (let zi = -14; zi <= 42; zi += 1) {
      const x = xi * 1.7
      const z = zi * 1.65
      if (onRoad(x, z)) continue
      const seed = Math.abs((xi * 47 + zi * 19) * 13) % 100
      if (seed % 11 === 0) continue
      const h = 1.4 + (seed % 16) * 0.42 + (Math.abs(xi) > 6 ? 1.1 : 0)
      blocks.push({
        x,
        z,
        h,
        w: 1.15 + (seed % 4) * 0.12,
        d: 1.15 + ((seed * 5) % 4) * 0.1,
        color: palettes[seed % palettes.length],
      })
    }
  }
  return blocks
}

function makeFacadeTexture(dark: boolean) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = dark ? '#163251' : '#e8eef6'
  ctx.fillRect(0, 0, 256, 512)
  const cols = 4
  const rows = 11
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const lit = (r * 9 + c * 5) % 7 !== 2
      if (dark) {
        ctx.fillStyle = lit ? ((r + c) % 5 === 0 ? '#ff7900' : '#7ec8ff') : '#070d16'
      } else {
        ctx.fillStyle = lit ? '#7ea8c8' : '#cfdcea'
      }
      ctx.fillRect(30 + c * 52, 18 + r * 38, 26, 20)
    }
  }
  ctx.fillStyle = dark ? '#0a1018' : '#31455c'
  ctx.fillRect(96, 428, 64, 84)
  ctx.fillStyle = '#ff7900'
  ctx.fillRect(148, 470, 6, 8)
  const tex = new CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

function Buildings({ dark }: { dark: boolean }) {
  const mesh = useRef<InstancedMesh>(null)
  const blocks = useMemo(() => makeCity(dark), [dark])
  const dummy = useMemo(() => new Object3D(), [])
  const facade = useMemo(() => makeFacadeTexture(dark), [dark])

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
    <instancedMesh ref={mesh} args={[undefined, undefined, blocks.length]}>
      <boxGeometry />
      <meshStandardMaterial
        map={facade}
        metalness={dark ? 0.18 : 0.04}
        roughness={dark ? 0.48 : 0.7}
      />
    </instancedMesh>
  )
}

function Roads({ dark }: { dark: boolean }) {
  const asphalt = dark ? '#1a1f2a' : '#8f9aab'
  const walk = dark ? '#2a3140' : '#c5ced9'
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 14]}>
        <planeGeometry args={[48, 90]} />
        <meshStandardMaterial color={dark ? '#0b1018' : '#c8d6e6'} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[3.4, 36]} />
        <meshStandardMaterial color={asphalt} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-7, 0.02, 12]}>
        <planeGeometry args={[20, 3.4]} />
        <meshStandardMaterial color={asphalt} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[HQ.x, 0.02, 24]}>
        <planeGeometry args={[3.4, 28]} />
        <meshStandardMaterial color={asphalt} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.95, 0.03, 0]}>
        <planeGeometry args={[0.45, 36]} />
        <meshStandardMaterial color={walk} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.95, 0.03, 0]}>
        <planeGeometry args={[0.45, 36]} />
        <meshStandardMaterial color={walk} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <planeGeometry args={[0.08, 36]} />
        <meshStandardMaterial color="#ff7900" emissive="#ff7900" emissiveIntensity={dark ? 0.45 : 0.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[HQ.x, 0.04, 24]}>
        <planeGeometry args={[0.08, 28]} />
        <meshStandardMaterial color="#ff7900" emissive="#ff7900" emissiveIntensity={dark ? 0.45 : 0.2} />
      </mesh>
    </>
  )
}

function Lamps({ dark }: { dark: boolean }) {
  const mesh = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const spots = useMemo(() => {
    const list: [number, number][] = []
    for (let z = -16; z <= 12; z += 4) {
      list.push([-2.15, z], [2.15, z])
    }
    for (let x = -2; x >= -16; x -= 4) {
      list.push([x, 10.15], [x, 13.85])
    }
    for (let z = 14; z <= 30; z += 4) {
      list.push([HQ.x - 2.15, z], [HQ.x + 2.15, z])
    }
    return list
  }, [])

  useLayoutEffect(() => {
    if (!mesh.current) return
    spots.forEach(([x, z], i) => {
      dummy.position.set(x, 1.35, z)
      dummy.scale.set(0.08, 2.7, 0.08)
      dummy.updateMatrix()
      mesh.current!.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  }, [dummy, spots])

  return (
    <>
      <instancedMesh ref={mesh} args={[undefined, undefined, spots.length]}>
        <boxGeometry />
        <meshStandardMaterial color={dark ? '#1c2430' : '#4d5b6c'} />
      </instancedMesh>
      {spots.map(([x, z], i) => (
        <mesh key={`${x}-${z}-${i}`} position={[x, 2.78, z]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial
            color={dark ? '#ffd7a0' : '#fff6d8'}
            emissive={dark ? '#ffb056' : '#fff2c4'}
            emissiveIntensity={dark ? 1.4 : 0.5}
          />
        </mesh>
      ))}
    </>
  )
}

function Cars({ dark }: { dark: boolean }) {
  const group = useRef<Group>(null)
  const cars = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        route: i % 4,
        offset: i * 0.11,
        speed: 0.07 + (i % 3) * 0.02,
        color: i % 3 === 0 ? '#ff7900' : i % 3 === 1 ? '#007bff' : dark ? '#dbe7f4' : '#00234e',
      })),
    [dark],
  )

  useFrame(({ clock }) => {
    const nodes = group.current?.children
    if (!nodes) return
    const t = clock.elapsedTime
    cars.forEach((car, i) => {
      const node = nodes[i]
      if (!node) return
      const u = (t * car.speed + car.offset) % 1
      if (car.route === 0) {
        node.position.set(0.7, 0.28, -16 + u * 30)
        node.rotation.y = 0
      } else if (car.route === 1) {
        node.position.set(-0.7, 0.28, 14 - u * 30)
        node.rotation.y = Math.PI
      } else if (car.route === 2) {
        node.position.set(1 - u * 16, 0.28, 12.7)
        node.rotation.y = Math.PI / 2
      } else {
        node.position.set(HQ.x - 0.65, 0.28, 13 + u * 18)
        node.rotation.y = 0
      }
    })
  })

  return (
    <group ref={group}>
      {cars.map((car) => (
        <group key={car.id}>
          <mesh>
            <boxGeometry args={[0.42, 0.22, 0.9]} />
            <meshStandardMaterial color={car.color} metalness={0.4} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.16, -0.08]}>
            <boxGeometry args={[0.34, 0.16, 0.42]} />
            <meshStandardMaterial color={dark ? '#0b1522' : '#9ec4e6'} metalness={0.6} roughness={0.15} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function HqMarks({ dark }: { dark: boolean }) {
  const tex = useTexture(asset(dark ? '/logos/logo-dark.jpeg' : '/logos/logo-light.jpeg'))
  tex.colorSpace = SRGBColorSpace
  return (
    <group position={[HQ.x, 0, HQ.z]}>
      <mesh position={[0, 9.1, -6.12]}>
        <planeGeometry args={[3.4, 3.4]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <mesh position={[0, 3.6, 5.72]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[4.4, 4.4]} />
        <meshBasicMaterial map={tex} toneMapped={false} side={DoubleSide} />
      </mesh>
    </group>
  )
}

function Headquarters({ dark }: { dark: boolean }) {
  const wall = dark ? '#0a1628' : '#eef4fb'
  const navy = '#00234e'
  return (
    <group position={[HQ.x, 0, HQ.z]}>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8.2, 12.2]} />
        <meshStandardMaterial color={dark ? '#151c28' : '#dbe6f2'} />
      </mesh>
      <mesh position={[0, 6, 5.95]}>
        <boxGeometry args={[8.2, 12, 0.32]} />
        <meshStandardMaterial color={navy} />
      </mesh>
      <mesh position={[-4.05, 6, 0]}>
        <boxGeometry args={[0.32, 12, 12.2]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      <mesh position={[4.05, 6, 0]}>
        <boxGeometry args={[0.32, 12, 12.2]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      <mesh position={[-2.45, 6, -5.95]}>
        <boxGeometry args={[3.3, 12, 0.36]} />
        <meshStandardMaterial color={navy} />
      </mesh>
      <mesh position={[2.45, 6, -5.95]}>
        <boxGeometry args={[3.3, 12, 0.36]} />
        <meshStandardMaterial color={navy} />
      </mesh>
      <mesh position={[0, 8.35, -5.95]}>
        <boxGeometry args={[2.2, 7.3, 0.36]} />
        <meshStandardMaterial color={navy} />
      </mesh>
      <mesh position={[0, 12.15, 0]}>
        <boxGeometry args={[8.6, 0.28, 12.6]} />
        <meshStandardMaterial color="#ff7900" />
      </mesh>
      <mesh position={[0, 1.6, -5.7]}>
        <boxGeometry args={[2.05, 3.2, 0.08]} />
        <meshStandardMaterial color={dark ? '#05070d' : '#1c2a3d'} />
      </mesh>
      <pointLight position={[0, 4.2, 0]} intensity={dark ? 22 : 10} color="#007bff" />
      <pointLight position={[0, 3.2, -2]} intensity={14} color="#ff7900" />
      <Suspense fallback={null}>
        <HqMarks dark={dark} />
      </Suspense>
    </group>
  )
}

function Flight({ progress }: { progress: MotionValue<number> }) {
  useFrame(({ camera }) => {
    const cam = camera as PerspectiveCamera
    const { p, l } = samplePath(progress.get())
    cam.position.set(p[0], p[1], p[2])
    cam.lookAt(l[0], l[1], l[2])
    cam.fov = 46 - progress.get() * 6
    cam.updateProjectionMatrix()
  })
  return null
}

function CityWorld({ progress, dark }: { progress: MotionValue<number>; dark: boolean }) {
  const sky = dark ? '#05070d' : '#c5def6'
  return (
    <>
      <color attach="background" args={[sky]} />
      <fog attach="fog" args={[sky, dark ? 12 : 18, dark ? 42 : 56]} />
      {dark ? (
        <>
          <ambientLight intensity={0.18} />
          <directionalLight position={[10, 16, 6]} intensity={0.85} color="#9ecbff" />
          <pointLight position={[0, 5, 8]} intensity={16} color="#007bff" />
        </>
      ) : (
        <>
          <hemisphereLight args={['#b9d8ff', '#eadcc8', 0.95]} />
          <ambientLight intensity={0.58} />
          <directionalLight position={[16, 24, 10]} intensity={2.05} color="#fff3d6" />
        </>
      )}
      <Roads dark={dark} />
      <Buildings dark={dark} />
      <Lamps dark={dark} />
      <Cars dark={dark} />
      <Headquarters dark={dark} />
      <Flight progress={progress} />
    </>
  )
}

export function CityScroll() {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const { scrollY } = useScroll()
  const raw = useTransform(scrollY, [0, 3200], [0, 1])
  const progress = useSpring(raw, { stiffness: 64, damping: 26, restDelta: 0.001 })

  return (
    <div className={`city-fixed ${dark ? 'is-dark' : 'is-light'}`} aria-hidden="true">
      <div className="city-canvas">
        <Canvas key={theme} camera={{ position: [0, 14, -20], fov: 46 }} dpr={[1, 1.5]}>
          <CityWorld progress={progress} dark={dark} />
        </Canvas>
      </div>
    </div>
  )
}
