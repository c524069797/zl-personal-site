'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  Float,
  Center,
  Bounds,
  ContactShadows,
  Html,
  useGLTF,
  useProgress,
} from '@react-three/drei'
import { useTheme } from 'next-themes'

const MODEL_URL = '/models/passion-avatar.glb'

// 预加载模型，进入首屏时尽快就绪
useGLTF.preload(MODEL_URL)

function Avatar() {
  const { scene } = useGLTF(MODEL_URL)
  return <primitive object={scene} />
}

// 模型加载中的占位（渲染在 Canvas 内部）
function SceneLoader() {
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

export default function Avatar3DScene() {
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme === 'dark'

  return (
    <Canvas
      camera={{ position: [0, 0.4, 5], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* 灯光：不依赖外部 HDR，加载快、可控 */}
      <hemisphereLight
        intensity={dark ? 0.8 : 1.0}
        color={dark ? '#3b4a6b' : '#ffffff'}
        groundColor={dark ? '#0b1020' : '#cbd5e1'}
      />
      <ambientLight intensity={dark ? 0.5 : 0.8} />
      <directionalLight position={[4, 6, 3]} intensity={dark ? 1.3 : 1.7} />
      <directionalLight
        position={[-5, 2, -2]}
        intensity={0.5}
        color={dark ? '#60a5fa' : '#e0e7ff'}
      />

      <Suspense fallback={<SceneLoader />}>
        {/* Bounds fit 自动把模型框进视口，避免手调 scale；不加 observe 防 Float 抖动 */}
        <Bounds fit clip margin={1.15}>
          <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.5}>
            <Center>
              <Avatar />
            </Center>
          </Float>
        </Bounds>
      </Suspense>

      <ContactShadows
        position={[0, -1.4, 0]}
        opacity={dark ? 0.45 : 0.28}
        scale={10}
        blur={2.6}
        far={4}
      />

      {/* 自动缓慢旋转 + 允许鼠标拖拽；禁缩放/平移，限制俯仰角避免看到模型底部 */}
      <OrbitControls
        makeDefault
        autoRotate
        autoRotateSpeed={0.9}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.8}
        maxPolarAngle={Math.PI / 1.85}
      />
    </Canvas>
  )
}
