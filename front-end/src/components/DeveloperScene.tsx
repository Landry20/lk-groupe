import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Group, Mesh, MeshStandardMaterial } from 'three'
import { useTheme } from '../context/ThemeContext'

function TypingDev({ intensity }: { intensity: number }) {
  const left = useRef<Group>(null)
  const right = useRef<Group>(null)
  const screen = useRef<Mesh>(null)
  const keys = useMemo(() => Array.from({ length: 18 }, (_, i) => i), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const hit = intensity
    if (left.current) {
      left.current.rotation.x = -0.35 + Math.sin(t * (10 + hit * 18)) * 0.18 * (0.25 + hit)
      left.current.position.y = 0.62 + Math.abs(Math.sin(t * (12 + hit * 16))) * 0.05 * hit
    }
    if (right.current) {
      right.current.rotation.x = -0.35 + Math.sin(t * (11 + hit * 20) + 1.2) * 0.18 * (0.25 + hit)
      right.current.position.y = 0.62 + Math.abs(Math.cos(t * (13 + hit * 15))) * 0.05 * hit
    }
    if (screen.current) {
      const mat = screen.current.material as MeshStandardMaterial
      mat.emissiveIntensity = 0.35 + hit * 1.1 + Math.sin(t * 6) * 0.08
    }
  })

  return (
    <group position={[0, -0.85, 0]}>
      <mesh position={[0, 0.02, -0.15]}>
        <boxGeometry args={[1.35, 0.12, 1.1]} />
        <meshStandardMaterial color="#1b2433" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.38, 0.42]} rotation={[-0.08, 0, 0]}>
        <boxGeometry args={[1.05, 0.72, 0.06]} />
        <meshStandardMaterial color="#0b1220" />
      </mesh>
      <mesh ref={screen} position={[0, 0.38, 0.455]} rotation={[-0.08, 0, 0]}>
        <planeGeometry args={[0.88, 0.56]} />
        <meshStandardMaterial color="#7ec8ff" emissive="#3d9bff" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0.1, 0.12]}>
        <boxGeometry args={[0.9, 0.05, 0.48]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      {keys.map((key) => (
        <mesh key={key} position={[-0.34 + (key % 6) * 0.12, 0.14, 0.02 + Math.floor(key / 6) * 0.1]}>
          <boxGeometry args={[0.08, 0.03, 0.07]} />
          <meshStandardMaterial color="#2a3548" />
        </mesh>
      ))}

      <mesh position={[0, -0.42, -0.22]}>
        <boxGeometry args={[0.7, 0.08, 0.7]} />
        <meshStandardMaterial color="#ff7900" />
      </mesh>
      <mesh position={[-0.28, -0.72, -0.18]}>
        <boxGeometry args={[0.1, 0.55, 0.1]} />
        <meshStandardMaterial color="#00234e" />
      </mesh>
      <mesh position={[0.28, -0.72, -0.18]}>
        <boxGeometry args={[0.1, 0.55, 0.1]} />
        <meshStandardMaterial color="#00234e" />
      </mesh>
      <mesh position={[0, -0.18, -0.22]}>
        <boxGeometry args={[0.55, 0.12, 0.55]} />
        <meshStandardMaterial color="#0a1628" />
      </mesh>
      <mesh position={[0, 0.18, -0.28]}>
        <boxGeometry args={[0.52, 0.62, 0.28]} />
        <meshStandardMaterial color="#173a73" />
      </mesh>
      <mesh position={[0, 0.62, -0.28]}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color="#e8c7a8" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.78, -0.28]}>
        <sphereGeometry args={[0.19, 16, 12, 0, Math.PI * 2, 0, 1.1]} />
        <meshStandardMaterial color="#00234e" />
      </mesh>
      <mesh position={[-0.16, -0.05, -0.05]} rotation={[0.9, 0, 0.15]}>
        <boxGeometry args={[0.16, 0.42, 0.16]} />
        <meshStandardMaterial color="#173a73" />
      </mesh>
      <mesh position={[0.16, -0.05, -0.05]} rotation={[0.9, 0, -0.15]}>
        <boxGeometry args={[0.16, 0.42, 0.16]} />
        <meshStandardMaterial color="#173a73" />
      </mesh>
      <group ref={left} position={[-0.28, 0.62, 0.05]}>
        <mesh>
          <boxGeometry args={[0.12, 0.08, 0.16]} />
          <meshStandardMaterial color="#e8c7a8" />
        </mesh>
      </group>
      <group ref={right} position={[0.28, 0.62, 0.05]}>
        <mesh>
          <boxGeometry args={[0.12, 0.08, 0.16]} />
          <meshStandardMaterial color="#e8c7a8" />
        </mesh>
      </group>
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
      <Canvas camera={{ position: [1.7, 0.9, 3.4], fov: 38 }} dpr={[1, 1.5]}>
        <color attach="background" args={[dark ? '#070b14' : '#eef4ff']} />
        <ambientLight intensity={dark ? 0.5 : 0.85} />
        <directionalLight position={[3, 4, 2]} intensity={1.2} />
        <pointLight position={[0.4, 1.2, 1.2]} intensity={8} color="#4aa4ff" />
        <TypingDev intensity={intensity} />
      </Canvas>
    </div>
  )
}
