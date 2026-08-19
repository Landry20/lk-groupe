import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { SRGBColorSpace } from 'three'
import type { Group, Mesh, MeshStandardMaterial } from 'three'
import { asset } from '../lib/asset'
import { useTheme } from '../context/ThemeContext'

function Laptop({ intensity }: { intensity: number }) {
  const screen = useRef<Mesh>(null)
  const keys = useMemo(() => Array.from({ length: 28 }, (_, i) => i), [])

  useFrame((state) => {
    if (!screen.current) return
    const mat = screen.current.material as MeshStandardMaterial
    mat.emissiveIntensity = 0.5 + intensity * 1.2 + Math.sin(state.clock.elapsedTime * 5) * 0.08
  })

  return (
    <group position={[0, 0.735, -0.04]}>
      <mesh position={[0, 0.012, 0.03]}>
        <boxGeometry args={[0.5, 0.022, 0.32]} />
        <meshStandardMaterial color="#1c1c1e" metalness={0.55} roughness={0.28} />
      </mesh>
      {keys.map((key) => (
        <mesh key={key} position={[-0.175 + (key % 7) * 0.052, 0.028, 0.0 + Math.floor(key / 7) * 0.048]}>
          <boxGeometry args={[0.042, 0.01, 0.036]} />
          <meshStandardMaterial color="#3a3a3c" />
        </mesh>
      ))}
      <mesh position={[0, 0.024, 0.13]}>
        <boxGeometry args={[0.14, 0.007, 0.06]} />
        <meshStandardMaterial color="#2c2c2e" />
      </mesh>
      <group position={[0, 0.018, -0.13]} rotation={[-0.28, 0, 0]}>
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.5, 0.34, 0.018]} />
          <meshStandardMaterial color="#111113" metalness={0.4} roughness={0.35} />
        </mesh>
        <mesh ref={screen} position={[0, 0.18, 0.011]}>
          <planeGeometry args={[0.44, 0.28]} />
          <meshStandardMaterial color="#7ec8ff" emissive="#3d9bff" emissiveIntensity={0.8} />
        </mesh>
      </group>
    </group>
  )
}

function Developer({ intensity }: { intensity: number }) {
  const left = useRef<Group>(null)
  const right = useRef<Group>(null)
  const head = useRef<Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const hit = 0.3 + intensity * 0.7
    if (left.current) {
      left.current.position.y = 0.355 + Math.sin(t * (13 + intensity * 14)) * 0.016 * hit
    }
    if (right.current) {
      right.current.position.y = 0.355 + Math.sin(t * (14.4 + intensity * 16) + 1.1) * 0.016 * hit
    }
    if (head.current) {
      head.current.rotation.x = 0.22 + Math.sin(t * 1.1) * 0.025
    }
  })

  const skin = '#e6c2a0'
  const shirt = '#173a73'
  const pants = '#1b2433'

  return (
    <group position={[0, 0.42, 0.5]} rotation={[0, Math.PI, 0]}>
      <mesh position={[0, 0.22, 0.02]} rotation={[0.22, 0, 0]}>
        <capsuleGeometry args={[0.14, 0.28, 6, 12]} />
        <meshStandardMaterial color={shirt} roughness={0.55} />
      </mesh>
      <group ref={head} position={[0, 0.58, 0.1]}>
        <mesh>
          <sphereGeometry args={[0.13, 24, 24]} />
          <meshStandardMaterial color={skin} roughness={0.48} />
        </mesh>
        <mesh position={[0.04, 0.015, 0.11]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[-0.04, 0.015, 0.11]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0, -0.02, 0.12]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#c48972" />
        </mesh>
        <mesh position={[0, 0.06, -0.02]}>
          <sphereGeometry args={[0.135, 16, 12, 0, Math.PI * 2, 0, 1.15]} />
          <meshStandardMaterial color="#2a1b12" />
        </mesh>
      </group>
      <mesh position={[-0.08, 0.02, 0.16]} rotation={[1.2, 0.06, 0]}>
        <capsuleGeometry args={[0.048, 0.22, 4, 8]} />
        <meshStandardMaterial color={pants} />
      </mesh>
      <mesh position={[0.08, 0.02, 0.16]} rotation={[1.2, -0.06, 0]}>
        <capsuleGeometry args={[0.048, 0.22, 4, 8]} />
        <meshStandardMaterial color={pants} />
      </mesh>
      <mesh position={[-0.09, -0.18, 0.28]}>
        <capsuleGeometry args={[0.045, 0.24, 4, 8]} />
        <meshStandardMaterial color={pants} />
      </mesh>
      <mesh position={[0.09, -0.18, 0.28]}>
        <capsuleGeometry args={[0.045, 0.24, 4, 8]} />
        <meshStandardMaterial color={pants} />
      </mesh>
      <mesh position={[-0.09, -0.32, 0.3]} rotation={[0.12, 0, 0]}>
        <boxGeometry args={[0.09, 0.045, 0.16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.09, -0.32, 0.3]} rotation={[0.12, 0, 0]}>
        <boxGeometry args={[0.09, 0.045, 0.16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[-0.16, 0.3, 0.14]} rotation={[0.95, 0, 0.06]}>
        <capsuleGeometry args={[0.04, 0.26, 4, 8]} />
        <meshStandardMaterial color={shirt} />
      </mesh>
      <mesh position={[0.16, 0.3, 0.14]} rotation={[0.95, 0, -0.06]}>
        <capsuleGeometry args={[0.04, 0.26, 4, 8]} />
        <meshStandardMaterial color={shirt} />
      </mesh>
      <group ref={left} position={[-0.1, 0.355, 0.48]}>
        <mesh>
          <sphereGeometry args={[0.038, 10, 10]} />
          <meshStandardMaterial color={skin} />
        </mesh>
      </group>
      <group ref={right} position={[0.1, 0.355, 0.48]}>
        <mesh>
          <sphereGeometry args={[0.038, 10, 10]} />
          <meshStandardMaterial color={skin} />
        </mesh>
      </group>
    </group>
  )
}

function Chair() {
  return (
    <group position={[0, 0, 0.58]}>
      <mesh position={[0, 0.4, 0.02]}>
        <boxGeometry args={[0.4, 0.06, 0.38]} />
        <meshStandardMaterial color="#1b2433" />
      </mesh>
      <mesh position={[0, 0.66, 0.2]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[0.4, 0.48, 0.06]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh position={[-0.15, 0.2, 0.14]}>
        <boxGeometry args={[0.055, 0.4, 0.055]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.15, 0.2, 0.14]}>
        <boxGeometry args={[0.055, 0.4, 0.055]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[-0.15, 0.2, -0.12]}>
        <boxGeometry args={[0.055, 0.4, 0.055]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.15, 0.2, -0.12]}>
        <boxGeometry args={[0.055, 0.4, 0.055]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  )
}

function Desk() {
  return (
    <group>
      <mesh position={[0, 0.72, -0.06]}>
        <boxGeometry args={[1.02, 0.06, 0.5]} />
        <meshStandardMaterial color="#6b3e1d" roughness={0.55} />
      </mesh>
      <mesh position={[-0.44, 0.35, 0.12]}>
        <boxGeometry args={[0.06, 0.7, 0.06]} />
        <meshStandardMaterial color="#4a2a14" />
      </mesh>
      <mesh position={[0.44, 0.35, 0.12]}>
        <boxGeometry args={[0.06, 0.7, 0.06]} />
        <meshStandardMaterial color="#4a2a14" />
      </mesh>
      <mesh position={[-0.44, 0.35, -0.22]}>
        <boxGeometry args={[0.06, 0.7, 0.06]} />
        <meshStandardMaterial color="#4a2a14" />
      </mesh>
      <mesh position={[0.44, 0.35, -0.22]}>
        <boxGeometry args={[0.06, 0.7, 0.06]} />
        <meshStandardMaterial color="#4a2a14" />
      </mesh>
    </group>
  )
}

function WallLogo({ dark }: { dark: boolean }) {
  const tex = useTexture(asset(dark ? '/logos/logo-dark.jpeg' : '/logos/logo-light.jpeg'))
  tex.colorSpace = SRGBColorSpace
  return (
    <mesh position={[0, 1.18, -1.63]}>
      <planeGeometry args={[0.7, 0.7]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  )
}

function HomeOffice({ intensity, dark }: { intensity: number; dark: boolean }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[6.2, 5]} />
        <meshStandardMaterial color={dark ? '#4a3426' : '#c9a57a'} />
      </mesh>
      <mesh position={[0, 1.35, -1.7]}>
        <boxGeometry args={[6.2, 2.7, 0.12]} />
        <meshStandardMaterial color={dark ? '#d9cbb6' : '#f4eee4'} />
      </mesh>
      <mesh position={[-2.5, 1.35, 0]}>
        <boxGeometry args={[0.12, 2.7, 5]} />
        <meshStandardMaterial color={dark ? '#d0c3b0' : '#efe7db'} />
      </mesh>
      <mesh position={[0.95, 1.15, -1.63]}>
        <boxGeometry args={[0.9, 0.85, 0.05]} />
        <meshStandardMaterial color={dark ? '#7ec8ff' : '#b9dcf7'} emissive="#7ec8ff" emissiveIntensity={dark ? 0.35 : 0.12} />
      </mesh>
      <Suspense fallback={null}>
        <WallLogo dark={dark} />
      </Suspense>
      <mesh position={[1.15, 0.4, 0.7]}>
        <boxGeometry args={[0.5, 0.06, 0.42]} />
        <meshStandardMaterial color="#5b3318" />
      </mesh>
      <mesh position={[1.15, 0.2, 0.7]}>
        <boxGeometry args={[0.06, 0.38, 0.06]} />
        <meshStandardMaterial color="#4a2a14" />
      </mesh>
      <mesh position={[1.05, 0.48, 0.58]}>
        <cylinderGeometry args={[0.045, 0.038, 0.1, 12]} />
        <meshStandardMaterial color="#f2f2f2" />
      </mesh>
      <mesh position={[-1.45, 0.52, -0.7]}>
        <cylinderGeometry args={[0.07, 0.1, 0.65, 8]} />
        <meshStandardMaterial color="#6b3e1d" />
      </mesh>
      <mesh position={[-1.45, 0.98, -0.7]}>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshStandardMaterial color="#2f9e45" />
      </mesh>
      <Desk />
      <Chair />
      <Developer intensity={intensity} />
      <Laptop intensity={intensity} />
    </group>
  )
}

export function DeveloperScene() {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const [intensity, setIntensity] = useState(0)
  const target = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById('dev-desk')
      if (!el) return
      const rect = el.getBoundingClientRect()
      const visible = 1 - Math.min(1, Math.max(0, rect.top / window.innerHeight))
      const speed = Math.min(1, Math.abs(window.scrollY % 120) / 40)
      target.current = Math.min(1, visible * 0.65 + speed * 0.55)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    let frame = 0
    const tick = () => {
      setIntensity((current) => current + (target.current - current) * 0.12)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="dev-canvas">
      <Canvas camera={{ position: [2.15, 1.25, 1.35], fov: 32 }} dpr={[1, 1.5]}>
        <color attach="background" args={[dark ? '#1a140e' : '#e9f2ff']} />
        <ambientLight intensity={dark ? 0.45 : 0.75} />
        <directionalLight position={[3.2, 4, 1.4]} intensity={1.2} />
        <pointLight position={[0.4, 1.5, 0.8]} intensity={6} color="#4aa4ff" />
        <HomeOffice intensity={intensity} dark={dark} />
      </Canvas>
    </div>
  )
}
