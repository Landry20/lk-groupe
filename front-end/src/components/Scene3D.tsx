import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { Suspense, useMemo, useRef } from 'react'
import { SRGBColorSpace, TextureLoader } from 'three'
import type { Group, Mesh } from 'three'
import { useTheme } from '../context/ThemeContext'

function LogoMark({ dark }: { dark: boolean }) {
  const group = useRef<Group>(null)
  const orbit = useRef<Mesh>(null)
  const texture = useLoader(TextureLoader, dark ? '/logos/logo-dark.jpeg' : '/logos/logo-light.jpeg')
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 8

  const pixels = useMemo(
    () => [
      { x: 1.22, y: 0.92, z: 0.18, s: 0.11, orange: false },
      { x: 1.4, y: 1.08, z: 0.1, s: 0.08, orange: true },
      { x: 1.28, y: 1.18, z: 0.22, s: 0.07, orange: false },
      { x: 1.5, y: 0.88, z: 0.05, s: 0.06, orange: false },
    ],
    [],
  )

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.28
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.08
    }
    if (orbit.current) orbit.current.rotation.z += delta * 0.45
  })

  const blue = dark ? '#4aa4ff' : '#007bff'
  const rim = dark ? '#0b1b33' : '#00234e'

  return (
    <group ref={group}>
      <Float speed={1.1} rotationIntensity={0.18} floatIntensity={0.25}>
        <mesh>
          <cylinderGeometry args={[1.22, 1.22, 0.1, 64]} />
          <meshStandardMaterial color={rim} metalness={0.45} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.056, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.18, 64]} />
          <meshStandardMaterial map={texture} roughness={0.4} metalness={0.08} />
        </mesh>
        <mesh position={[0, -0.056, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.18, 64]} />
          <meshStandardMaterial color={rim} metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh ref={orbit} rotation={[1.22, 0.18, 0]}>
          <torusGeometry args={[1.48, 0.018, 12, 120]} />
          <meshStandardMaterial color={blue} emissive={blue} emissiveIntensity={0.55} />
        </mesh>
        {pixels.map((pixel) => (
          <mesh key={`${pixel.x}-${pixel.y}`} position={[pixel.x, pixel.y, pixel.z]}>
            <boxGeometry args={[pixel.s, pixel.s, pixel.s]} />
            <meshStandardMaterial
              color={pixel.orange ? '#ff7900' : blue}
              emissive={pixel.orange ? '#ff7900' : blue}
              emissiveIntensity={0.4}
            />
          </mesh>
        ))}
      </Float>
    </group>
  )
}

export function Scene3D() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  return (
    <div className="canvas-box">
      <Canvas camera={{ position: [0, 0.2, 4.1], fov: 40 }} dpr={[1, 1.6]}>
        <color attach="background" args={[dark ? '#070b14' : '#edf4ff']} />
        <ambientLight intensity={dark ? 0.55 : 0.9} />
        <directionalLight position={[2.4, 3, 4]} intensity={1.4} />
        <pointLight position={[3, 2, 3]} intensity={18} color="#4aa4ff" />
        <pointLight position={[-2.5, -1, 2]} intensity={10} color="#ff7900" />
        <Suspense fallback={null}>
          <LogoMark key={theme} dark={dark} />
        </Suspense>
      </Canvas>
    </div>
  )
}
