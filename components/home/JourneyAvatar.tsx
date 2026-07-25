'use client'

import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Center, ContactShadows, Html, useProgress } from '@react-three/drei'
import { useTheme } from 'next-themes'
import { MathUtils } from 'three'
import type { Group } from 'three'
import { useMotionValue, type MotionValue } from 'framer-motion'

const MODEL_URL = '/models/passion-avatar.glb'
useGLTF.preload(MODEL_URL)

// 手办随滚动进度 progress(0..1) 转身 + 上浮，并朝鼠标方向转头跟随，用 useFrame 命令式驱动
function Model({
  progress,
  mouseX,
  mouseY,
}: {
  progress: MotionValue<number>
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}) {
  const ref = useRef<Group>(null)
  const { scene } = useGLTF(MODEL_URL)

  useFrame(() => {
    const g = ref.current
    if (!g) return
    const p = progress.get()
    // 目标朝向 = 滚动转身基础角 + 鼠标水平偏角；俯仰只受鼠标垂直位置影响
    const targetY = -0.5 + p * 1.0 + mouseX.get() * 0.5
    const targetX = mouseY.get() * 0.18
    g.rotation.y = MathUtils.lerp(g.rotation.y, targetY, 0.08)
    g.rotation.x = MathUtils.lerp(g.rotation.x, targetX, 0.08)
    g.position.y = MathUtils.lerp(g.position.y, Math.sin(p * Math.PI) * 0.15, 0.08)
  })

  return (
    <group ref={ref}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  )
}

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 text-xs text-neutral-400 dark:text-white/60">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/15 border-t-cyan-400" />
        <span>{Math.round(progress)}%</span>
      </div>
    </Html>
  )
}

export default function JourneyAvatar({ progress }: { progress: MotionValue<number> }) {
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme === 'dark'

  // 鼠标位置归一化到 [-1, 1]（全窗口监听：鼠标滑到右侧经历卡片时手办也会看过去）
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1)
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    // 鼠标离开页面时回正
    const onLeave = () => {
      mouseX.set(0)
      mouseY.set(0)
    }
    window.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [mouseX, mouseY])

  return (
    <Canvas
      camera={{ position: [0, 0.1, 3.4], fov: 38 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <hemisphereLight
        intensity={dark ? 0.8 : 1.0}
        color={dark ? '#3b4a6b' : '#ffffff'}
        groundColor={dark ? '#0b1020' : '#cbd5e1'}
      />
      <ambientLight intensity={dark ? 0.5 : 0.8} />
      <directionalLight position={[4, 6, 3]} intensity={dark ? 1.3 : 1.7} />
      <directionalLight position={[-5, 2, -2]} intensity={0.5} color={dark ? '#60a5fa' : '#e0e7ff'} />

      <Suspense fallback={<Loader />}>
        <Model progress={progress} mouseX={mouseX} mouseY={mouseY} />
      </Suspense>

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={dark ? 0.4 : 0.25}
        scale={10}
        blur={2.6}
        far={4}
      />
    </Canvas>
  )
}
