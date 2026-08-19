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

const ROAD_X = [-21, -14, -7, 0, 7, 14]
const ROAD_Z = [-14, -7, 0, 7, 14, 21, 28]
const HQ = { x: -14, z: 35 }
const ROAD = 1.55
const WALK = 2.15

type Key = { t: number; p: [number, number, number]; l: [number, number, number] }
type Lot = { x: number; z: number; seed: number; kind: 'house' | 'apt' | 'park' }

const path: Key[] = [
  { t: 0, p: [0, 12.5, -18], l: [0, 1.1, 6] },
  { t: 0.12, p: [0.1, 3.1, -10], l: [0, 1.2, 2] },
  { t: 0.28, p: [0.25, 1.85, -1], l: [0.1, 1.15, 8] },
  { t: 0.42, p: [0.2, 1.75, 11], l: [-6, 1.2, 14] },
  { t: 0.55, p: [-7, 1.75, 14], l: [-16, 1.2, 14] },
  { t: 0.66, p: [-13.7, 1.8, 14.3], l: [-14, 1.35, 22] },
  { t: 0.8, p: [-14, 2.05, 24], l: [-14, 2.1, 32] },
  { t: 0.9, p: [-14, 1.55, 30.2], l: [-14, 1.5, 33.2] },
  { t: 0.95, p: [-14, 1.5, 32.1], l: [-14, 1.45, 35] },
  { t: 1, p: [-14, 1.55, 34.4], l: [-14, 1.5, 39.2] },
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

function onRoad(x: number, z: number, pad = ROAD + 0.35) {
  return ROAD_X.some((cx) => Math.abs(x - cx) < pad) || ROAD_Z.some((cz) => Math.abs(z - cz) < pad)
}

function nearHq(x: number, z: number) {
  return Math.abs(x - HQ.x) < 5.5 && Math.abs(z - HQ.z) < 6.2
}

function makeLots() {
  const lots: Lot[] = []
  for (let xi = 0; xi < ROAD_X.length - 1; xi += 1) {
    for (let zi = 0; zi < ROAD_Z.length - 1; zi += 1) {
      const x = (ROAD_X[xi] + ROAD_X[xi + 1]) / 2
      const z = (ROAD_Z[zi] + ROAD_Z[zi + 1]) / 2
      if (nearHq(x, z)) continue
      const seed = Math.abs((xi * 31 + zi * 17) * 13) % 100
      lots.push({
        x,
        z,
        seed,
        kind: seed % 5 === 0 ? 'park' : seed % 3 === 0 ? 'apt' : 'house',
      })
    }
  }
  return lots
}

function makeFacade(dark: boolean, kind: 'house' | 'apt') {
  const canvas = document.createElement('canvas')
  const glow = document.createElement('canvas')
  canvas.width = glow.width = 256
  canvas.height = glow.height = kind === 'house' ? 256 : 512
  const ctx = canvas.getContext('2d')!
  const gx = glow.getContext('2d')!
  ctx.fillStyle = kind === 'house' ? (dark ? '#6a4a32' : '#e8d5bc') : (dark ? '#1a3358' : '#d7e3f0')
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  gx.fillStyle = '#000'
  gx.fillRect(0, 0, glow.width, glow.height)
  const rows = kind === 'house' ? 2 : 8
  const cols = kind === 'house' ? 3 : 4
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const lit = (r * 7 + c * 5) % 4 !== 1
      const x = 28 + c * (kind === 'house' ? 72 : 52)
      const y = 22 + r * (kind === 'house' ? 70 : 48)
      ctx.fillStyle = dark
        ? (lit ? ((r + c) % 3 === 0 ? '#ffb056' : '#ffe08a') : '#0b1018')
        : '#8fb6d2'
      ctx.fillRect(x, y, kind === 'house' ? 38 : 26, kind === 'house' ? 32 : 22)
      if (dark && lit) {
        gx.fillStyle = (r + c) % 3 === 0 ? '#ff7900' : '#ffe08a'
        gx.fillRect(x, y, kind === 'house' ? 38 : 26, kind === 'house' ? 32 : 22)
      }
    }
  }
  ctx.fillStyle = dark ? '#1a140e' : '#4a3728'
  ctx.fillRect(canvas.width / 2 - 28, canvas.height - 70, 56, 70)
  ctx.fillStyle = '#ff7900'
  ctx.fillRect(canvas.width / 2 + 16, canvas.height - 38, 5, 7)
  const map = new CanvasTexture(canvas)
  const emissive = new CanvasTexture(glow)
  map.colorSpace = SRGBColorSpace
  map.anisotropy = 8
  emissive.anisotropy = 8
  return { map, emissive }
}

function Ground({ dark }: { dark: boolean }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 8]} receiveShadow>
      <planeGeometry args={[64, 86]} />
      <meshStandardMaterial color={dark ? '#1c3a24' : '#5ea85a'} />
    </mesh>
  )
}

function Roads({ dark }: { dark: boolean }) {
  const asphalt = dark ? '#2a3038' : '#6f7682'
  const walk = dark ? '#3a414c' : '#c9c2b2'
  const line = '#ff7900'
  return (
    <>
      {ROAD_X.map((x) => (
        <group key={`vx-${x}`}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, 7]}>
            <planeGeometry args={[ROAD * 2, 52]} />
            <meshStandardMaterial color={asphalt} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.035, 7]}>
            <planeGeometry args={[0.07, 52]} />
            <meshStandardMaterial color={line} emissive={line} emissiveIntensity={dark ? 0.55 : 0.18} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x - WALK, 0.03, 7]}>
            <planeGeometry args={[0.7, 52]} />
            <meshStandardMaterial color={walk} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x + WALK, 0.03, 7]}>
            <planeGeometry args={[0.7, 52]} />
            <meshStandardMaterial color={walk} />
          </mesh>
        </group>
      ))}
      {ROAD_Z.map((z) => (
        <group key={`hz-${z}`}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.5, 0.025, z]}>
            <planeGeometry args={[42, ROAD * 2]} />
            <meshStandardMaterial color={asphalt} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.5, 0.04, z]}>
            <planeGeometry args={[42, 0.07]} />
            <meshStandardMaterial color={line} emissive={line} emissiveIntensity={dark ? 0.55 : 0.18} />
          </mesh>
        </group>
      ))}
    </>
  )
}

function Houses({ dark }: { dark: boolean }) {
  const lots = useMemo(() => makeLots().filter((lot) => lot.kind === 'house'), [])
  const mesh = useRef<InstancedMesh>(null)
  const roofs = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const tex = useMemo(() => makeFacade(dark, 'house'), [dark])

  useLayoutEffect(() => {
    if (!mesh.current || !roofs.current) return
    lots.forEach((lot, i) => {
      const w = 2.1 + (lot.seed % 3) * 0.15
      const d = 1.9 + ((lot.seed * 3) % 3) * 0.12
      const h = 1.55 + (lot.seed % 4) * 0.08
      dummy.position.set(lot.x, h / 2, lot.z)
      dummy.scale.set(w, h, d)
      dummy.rotation.set(0, 0, 0)
      dummy.updateMatrix()
      mesh.current!.setMatrixAt(i, dummy.matrix)
      mesh.current!.setColorAt(i, new Color(dark ? '#8a6748' : '#f0e0c8'))
      dummy.position.set(lot.x, h + 0.28, lot.z)
      dummy.scale.set(w * 0.72, 0.55, d * 0.72)
      dummy.rotation.set(0, Math.PI / 4, 0)
      dummy.updateMatrix()
      roofs.current!.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
    roofs.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  }, [dummy, lots, dark])

  return (
    <>
      <instancedMesh ref={mesh} args={[undefined, undefined, lots.length]}>
        <boxGeometry />
        <meshStandardMaterial
          map={tex.map}
          emissiveMap={tex.emissive}
          emissive="#ffffff"
          emissiveIntensity={dark ? 1.45 : 0}
          roughness={0.72}
        />
      </instancedMesh>
      <instancedMesh ref={roofs} args={[undefined, undefined, lots.length]}>
        <coneGeometry args={[1, 1, 4]} />
        <meshStandardMaterial color={dark ? '#4a2018' : '#b23a22'} roughness={0.7} />
      </instancedMesh>
    </>
  )
}

function Apartments({ dark }: { dark: boolean }) {
  const lots = useMemo(() => makeLots().filter((lot) => lot.kind === 'apt'), [])
  const mesh = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const tex = useMemo(() => makeFacade(dark, 'apt'), [dark])

  useLayoutEffect(() => {
    if (!mesh.current) return
    lots.forEach((lot, i) => {
      const h = 3.2 + (lot.seed % 4) * 0.55
      dummy.position.set(lot.x, h / 2, lot.z)
      dummy.scale.set(2.35, h, 2.05)
      dummy.updateMatrix()
      mesh.current!.setMatrixAt(i, dummy.matrix)
      mesh.current!.setColorAt(i, new Color(dark ? '#1d3b63' : '#c9d8e8'))
    })
    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  }, [dummy, lots, dark])

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, lots.length]}>
      <boxGeometry />
      <meshStandardMaterial
        map={tex.map}
        emissiveMap={tex.emissive}
        emissive="#ffffff"
        emissiveIntensity={dark ? 1.55 : 0}
        roughness={0.55}
      />
    </instancedMesh>
  )
}

function Trees() {
  const lots = useMemo(() => makeLots(), [])
  const foliage = useRef<InstancedMesh>(null)
  const trunks = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const points = useMemo(() => {
    const list: { x: number; z: number; s: number }[] = []
    lots.forEach((lot) => {
      const n = lot.kind === 'park' ? 5 : 2
      for (let i = 0; i < n; i += 1) {
        const a = (lot.seed + i * 37) * 0.17
        list.push({
          x: lot.x + Math.cos(a) * (lot.kind === 'park' ? 1.6 : 1.35),
          z: lot.z + Math.sin(a) * (lot.kind === 'park' ? 1.5 : 1.2),
          s: 0.85 + ((lot.seed + i) % 5) * 0.12,
        })
      }
    })
    return list.filter((p) => !onRoad(p.x, p.z, 2) && !nearHq(p.x, p.z))
  }, [lots])

  useLayoutEffect(() => {
    if (!foliage.current || !trunks.current) return
    points.forEach((p, i) => {
      dummy.position.set(p.x, 1.35 * p.s, p.z)
      dummy.scale.set(p.s, p.s, p.s)
      dummy.updateMatrix()
      foliage.current!.setMatrixAt(i, dummy.matrix)
      dummy.position.set(p.x, 0.45, p.z)
      dummy.scale.set(0.18, 0.9, 0.18)
      dummy.updateMatrix()
      trunks.current!.setMatrixAt(i, dummy.matrix)
    })
    foliage.current.instanceMatrix.needsUpdate = true
    trunks.current.instanceMatrix.needsUpdate = true
  }, [dummy, points])

  return (
    <>
      <instancedMesh ref={trunks} args={[undefined, undefined, points.length]}>
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <meshStandardMaterial color="#6b3e1d" />
      </instancedMesh>
      <instancedMesh ref={foliage} args={[undefined, undefined, points.length]}>
        <sphereGeometry args={[0.7, 10, 10]} />
        <meshStandardMaterial color="#2f9e45" />
      </instancedMesh>
    </>
  )
}

function lampSpots() {
  const list: [number, number][] = []
  ROAD_X.forEach((x) => {
    for (let z = -14; z <= 28; z += 7) {
      list.push([x - WALK, z + 1.8], [x + WALK, z - 1.8])
    }
  })
  return list.filter(([x, z]) => !nearHq(x, z))
}

function Lamps({ dark }: { dark: boolean }) {
  const mesh = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const spots = useMemo(() => lampSpots(), [])
  const lit = useMemo(
    () => spots.filter(([x, z]) => Math.abs(x) < 18 && (Math.abs(x) < 3 || Math.abs(x + 14) < 3 || Math.abs(z - 14) < 3)).slice(0, 14),
    [spots],
  )

  useLayoutEffect(() => {
    if (!mesh.current) return
    spots.forEach(([x, z], i) => {
      dummy.position.set(x, 1.25, z)
      dummy.scale.set(0.07, 2.5, 0.07)
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
        <mesh key={`bulb-${i}`} position={[x, 2.58, z]}>
          <sphereGeometry args={[0.13, 8, 8]} />
          <meshStandardMaterial
            color="#ffe7b0"
            emissive="#ffd089"
            emissiveIntensity={dark ? 3.2 : 0.35}
            toneMapped={false}
          />
        </mesh>
      ))}
      {dark &&
        lit.map(([x, z], i) => (
          <pointLight key={`glow-${i}`} position={[x, 2.5, z]} color="#ffc878" intensity={7.5} distance={9} decay={2} />
        ))}
    </>
  )
}

function TrafficLights() {
  const crosses = useMemo(() => {
    const list: [number, number][] = []
    ;[0, -14, 7].forEach((x) => {
      ;[0, 14].forEach((z) => list.push([x + WALK, z + WALK]))
    })
    return list
  }, [])
  return (
    <>
      {crosses.map(([x, z], i) => (
        <group key={`tl-${i}`} position={[x, 0, z]}>
          <mesh position={[0, 1.15, 0]}>
            <boxGeometry args={[0.08, 2.3, 0.08]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          <mesh position={[0, 2.35, 0]}>
            <boxGeometry args={[0.22, 0.62, 0.18]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <LightHead y={2.52} color="#ff3b30" on={false} />
          <LightHead y={2.35} color="#ffd60a" on={false} />
          <LightHead y={2.18} color="#30d158" on />
        </group>
      ))}
    </>
  )
}

function LightHead({ y, color, on }: { y: number; color: string; on: boolean }) {
  return (
    <mesh position={[0, y, 0.12]}>
      <sphereGeometry args={[0.055, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={on ? 2.4 : 0.15} toneMapped={false} />
    </mesh>
  )
}

function CarModel({ color, dark }: { color: string; dark: boolean }) {
  const wheels = useRef<Group>(null)
  useFrame((_, dt) => {
    wheels.current?.children.forEach((wheel) => {
      wheel.rotation.x += dt * 8
    })
  })
  return (
    <group>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[0.52, 0.24, 1.12]} />
        <meshStandardMaterial color={color} metalness={0.45} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.46, -0.06]}>
        <boxGeometry args={[0.46, 0.18, 0.52]} />
        <meshStandardMaterial color={dark ? '#0c1a28' : '#c5e0f5'} metalness={0.7} roughness={0.12} />
      </mesh>
      <mesh position={[0.18, 0.3, 0.52]}>
        <boxGeometry args={[0.08, 0.06, 0.04]} />
        <meshStandardMaterial color="#ffe08a" emissive="#ffe08a" emissiveIntensity={dark ? 1.4 : 0.3} />
      </mesh>
      <mesh position={[-0.18, 0.3, 0.52]}>
        <boxGeometry args={[0.08, 0.06, 0.04]} />
        <meshStandardMaterial color="#ffe08a" emissive="#ffe08a" emissiveIntensity={dark ? 1.4 : 0.3} />
      </mesh>
      <group ref={wheels}>
        {[
          [0.27, 0.12, 0.34],
          [-0.27, 0.12, 0.34],
          [0.27, 0.12, -0.34],
          [-0.27, 0.12, -0.34],
        ].map((p) => (
          <mesh key={p.join(',')} position={p as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.12, 0.12, 0.09, 12]} />
            <meshStandardMaterial color="#111" roughness={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function Cars({ dark }: { dark: boolean }) {
  const group = useRef<Group>(null)
  const fleet = useMemo(() => {
    const colors = ['#ff7900', '#007bff', '#ffffff', '#00234e', '#c0392b']
    const list: { route: number; slot: number; total: number; color: string }[] = []
    const routes = 6
    const per = 3
    for (let r = 0; r < routes; r += 1) {
      for (let s = 0; s < per; s += 1) {
        list.push({ route: r, slot: s, total: per, color: colors[(r + s) % colors.length] })
      }
    }
    return list
  }, [])

  useFrame(({ clock }) => {
    const nodes = group.current?.children
    if (!nodes) return
    const t = clock.elapsedTime
    fleet.forEach((car, i) => {
      const node = nodes[i]
      if (!node) return
      const u = (t * 0.045 + car.slot / car.total) % 1
      if (car.route === 0) {
        node.position.set(0.7, 0, -16 + u * 44)
        node.rotation.y = 0
      } else if (car.route === 1) {
        node.position.set(-0.7, 0, 28 - u * 44)
        node.rotation.y = Math.PI
      } else if (car.route === 2) {
        node.position.set(-13.3, 0, -14 + u * 42)
        node.rotation.y = 0
      } else if (car.route === 3) {
        node.position.set(-14.7, 0, 28 - u * 42)
        node.rotation.y = Math.PI
      } else if (car.route === 4) {
        node.position.set(14 - u * 36, 0, 14.7)
        node.rotation.y = Math.PI / 2
      } else {
        node.position.set(-21 + u * 36, 0, 13.3)
        node.rotation.y = -Math.PI / 2
      }
    })
  })

  return (
    <group ref={group}>
      {fleet.map((car, i) => (
        <group key={i}>
          <CarModel color={car.color} dark={dark} />
        </group>
      ))}
    </group>
  )
}

function Person({ shirt, skin = '#e2b48a' }: { shirt: string; skin?: string }) {
  return (
    <group>
      <mesh position={[0, 1.02, 0]}>
        <sphereGeometry args={[0.13, 12, 12]} />
        <meshStandardMaterial color={skin} roughness={0.55} />
      </mesh>
      <mesh position={[0, 1.14, -0.02]}>
        <sphereGeometry args={[0.135, 10, 8, 0, Math.PI * 2, 0, 1]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <capsuleGeometry args={[0.12, 0.34, 4, 8]} />
        <meshStandardMaterial color={shirt} />
      </mesh>
      <mesh position={[-0.07, 0.2, 0]}>
        <capsuleGeometry args={[0.045, 0.28, 3, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.07, 0.2, 0]}>
        <capsuleGeometry args={[0.045, 0.28, 3, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  )
}

function Pedestrians() {
  const group = useRef<Group>(null)
  const people = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        i,
        shirt: ['#007bff', '#ff7900', '#ffffff', '#00234e', '#2ecc71'][i % 5],
        route: i % 8,
        offset: i * 0.08,
      })),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    people.forEach((p, i) => {
      const node = group.current?.children[i]
      if (!node) return
      const u = (t * 0.06 + p.offset) % 1
      const ping = u < 0.5 ? u * 2 : 1 - (u - 0.5) * 2
      node.position.y = Math.abs(Math.sin(t * 7 + i)) * 0.03
      if (p.route === 0) {
        node.position.set(WALK, 0, -12 + ping * 36)
        node.rotation.y = u < 0.5 ? 0 : Math.PI
      } else if (p.route === 1) {
        node.position.set(-WALK, 0, 22 - ping * 34)
        node.rotation.y = u < 0.5 ? Math.PI : 0
      } else if (p.route === 2) {
        node.position.set(-14 + WALK, 0, -10 + ping * 32)
        node.rotation.y = u < 0.5 ? 0 : Math.PI
      } else if (p.route === 3) {
        node.position.set(-14 - WALK, 0, 20 - ping * 30)
        node.rotation.y = u < 0.5 ? Math.PI : 0
      } else if (p.route === 4) {
        node.position.set(10 - ping * 28, 0, 14 + WALK)
        node.rotation.y = u < 0.5 ? Math.PI / 2 : -Math.PI / 2
      } else if (p.route === 5) {
        node.position.set(-18 + ping * 28, 0, 14 - WALK)
        node.rotation.y = u < 0.5 ? -Math.PI / 2 : Math.PI / 2
      } else if (p.route === 6) {
        node.position.set(7 + WALK, 0, -8 + ping * 28)
        node.rotation.y = u < 0.5 ? 0 : Math.PI
      } else {
        node.position.set(-7 - WALK, 0, 18 - ping * 26)
        node.rotation.y = u < 0.5 ? Math.PI : 0
      }
    })
  })

  return (
    <group ref={group}>
      {people.map((p) => (
        <group key={p.i}>
          <Person shirt={p.shirt} />
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
      <mesh position={[0, 2.72, -4.62]}>
        <planeGeometry args={[1.7, 1.7]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.7, 4.42]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.4, 2.4]} />
        <meshBasicMaterial map={tex} toneMapped={false} side={DoubleSide} />
      </mesh>
    </group>
  )
}

function InteriorPeople() {
  const group = useRef<Group>(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const a = group.current?.children[0]
    const b = group.current?.children[1]
    const c = group.current?.children[2]
    if (a) {
      a.position.set(-1.6 + Math.sin(t * 0.35) * 1.4, 0, 0.4)
      a.rotation.y = Math.sin(t * 0.35) > 0 ? Math.PI / 2 : -Math.PI / 2
    }
    if (b) {
      b.position.set(1.5, 0, -0.6 + Math.cos(t * 0.28) * 1.1)
      b.rotation.y = Math.cos(t * 0.28) > 0 ? 0 : Math.PI
    }
    if (c) {
      c.position.set(0.2, 0, 1.8)
      c.rotation.y = Math.PI + Math.sin(t * 0.2) * 0.2
    }
  })
  return (
    <group ref={group} position={[HQ.x, 0, HQ.z]}>
      <group>
        <Person shirt="#007bff" />
      </group>
      <group>
        <Person shirt="#ff7900" />
      </group>
      <group>
        <Person shirt="#ffffff" />
      </group>
    </group>
  )
}

function Headquarters({ dark }: { dark: boolean }) {
  const wall = dark ? '#f3efe8' : '#f7f4ef'
  const navy = '#00234e'
  return (
    <group position={[HQ.x, 0, HQ.z]}>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9.2, 10.4]} />
        <meshStandardMaterial color={dark ? '#d9cbb8' : '#efe6d8'} />
      </mesh>
      <mesh position={[0, 1.7, 4.7]}>
        <boxGeometry args={[9.2, 3.4, 0.22]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      <mesh position={[-4.5, 1.7, 0]}>
        <boxGeometry args={[0.22, 3.4, 9.6]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      <mesh position={[4.5, 1.7, 0]}>
        <boxGeometry args={[0.22, 3.4, 9.6]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      <mesh position={[-2.85, 1.7, -4.7]}>
        <boxGeometry args={[3.5, 3.4, 0.22]} />
        <meshStandardMaterial color={navy} />
      </mesh>
      <mesh position={[2.85, 1.7, -4.7]}>
        <boxGeometry args={[3.5, 3.4, 0.22]} />
        <meshStandardMaterial color={navy} />
      </mesh>
      <mesh position={[0, 2.72, -4.7]}>
        <boxGeometry args={[2.2, 1.36, 0.22]} />
        <meshStandardMaterial color={navy} />
      </mesh>
      <mesh position={[0, 3.55, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[6.4, 1.5, 4]} />
        <meshStandardMaterial color="#ff7900" />
      </mesh>
      <mesh position={[-2.2, 0.55, 1.4]}>
        <boxGeometry args={[1.8, 0.12, 0.9]} />
        <meshStandardMaterial color="#6b3e1d" />
      </mesh>
      <mesh position={[2.1, 0.42, 2.2]}>
        <boxGeometry args={[1.6, 0.45, 0.7]} />
        <meshStandardMaterial color="#007bff" />
      </mesh>
      <mesh position={[2.1, 0.72, 2.2]}>
        <boxGeometry args={[1.5, 0.18, 0.55]} />
        <meshStandardMaterial color="#dbeafe" />
      </mesh>
      <pointLight position={[0, 2.4, 0]} intensity={dark ? 18 : 8} color="#fff4dc" distance={11} />
      <pointLight position={[0, 1.8, 1.5]} intensity={8} color="#007bff" distance={8} />
      <Suspense fallback={null}>
        <HqMarks dark={dark} />
      </Suspense>
      <InteriorPeople />
    </group>
  )
}

function Flight({ progress }: { progress: MotionValue<number> }) {
  useFrame(({ camera }) => {
    const cam = camera as PerspectiveCamera
    const { p, l } = samplePath(progress.get())
    cam.position.set(p[0], p[1], p[2])
    cam.lookAt(l[0], l[1], l[2])
    cam.fov = 48 - progress.get() * 8
    cam.updateProjectionMatrix()
  })
  return null
}

function CityWorld({ progress, dark }: { progress: MotionValue<number>; dark: boolean }) {
  const sky = dark ? '#071018' : '#b9d9f5'
  return (
    <>
      <color attach="background" args={[sky]} />
      <fog attach="fog" args={[sky, dark ? 18 : 22, dark ? 58 : 64]} />
      {dark ? (
        <>
          <ambientLight intensity={0.28} />
          <hemisphereLight args={['#1b3358', '#0d1a12', 0.45]} />
          <directionalLight position={[8, 18, 6]} intensity={0.35} color="#9eb7d8" />
        </>
      ) : (
        <>
          <hemisphereLight args={['#b9d8ff', '#8fbf6a', 0.95]} />
          <ambientLight intensity={0.62} />
          <directionalLight position={[16, 24, 10]} intensity={2.05} color="#fff3d6" />
        </>
      )}
      <Ground dark={dark} />
      <Roads dark={dark} />
      <Houses dark={dark} />
      <Apartments dark={dark} />
      <Trees />
      <Lamps dark={dark} />
      <TrafficLights />
      <Cars dark={dark} />
      <Pedestrians />
      <Headquarters dark={dark} />
      <Flight progress={progress} />
    </>
  )
}

export function CityScroll() {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const { scrollY } = useScroll()
  const raw = useTransform(scrollY, [0, 3400], [0, 1])
  const progress = useSpring(raw, { stiffness: 64, damping: 26, restDelta: 0.001 })

  return (
    <div className={`city-fixed ${dark ? 'is-dark' : 'is-light'}`} aria-hidden="true">
      <div className="city-canvas">
        <Canvas key={theme} camera={{ position: [0, 12.5, -18], fov: 48 }} dpr={[1, 1.5]}>
          <CityWorld progress={progress} dark={dark} />
        </Canvas>
      </div>
    </div>
  )
}
