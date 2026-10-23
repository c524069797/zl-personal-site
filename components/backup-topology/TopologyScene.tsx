'use client'

import { useLayoutEffect, useRef, useEffect } from 'react'
import { Canvas, useThree, type ThreeEvent } from '@react-three/fiber'
import { Html, Line, OrbitControls } from '@react-three/drei'
import { Color, Object3D, type InstancedMesh } from 'three'
import { STATUS_COLORS, type TopologySnapshot, type TopologyNode } from './model'

type SceneProps = {
  snapshot: TopologySnapshot
  selectedId: string
  relatedIds: Set<string>
  onSelect: (id: string) => void
  onUnavailable: () => void
}

function ContextMonitor({ onUnavailable }: Pick<SceneProps, 'onUnavailable'>) {
  const { gl } = useThree()
  useEffect(() => {
    const canvas = gl.domElement
    const handleLost = (event: Event) => {
      event.preventDefault()
      onUnavailable()
    }
    canvas.addEventListener('webglcontextlost', handleLost)
    return () => canvas.removeEventListener('webglcontextlost', handleLost)
  }, [gl, onUnavailable])
  return null
}

function StorageNodes({ nodes, selectedId, onSelect }: {
  nodes: TopologyNode[]
} & Pick<SceneProps, 'selectedId' | 'onSelect'>) {
  const mesh = useRef<InstancedMesh>(null)
  const invalidate = useThree(state => state.invalidate)
  useLayoutEffect(() => {
    if (!mesh.current) return
    const transform = new Object3D()
    nodes.forEach((node, index) => {
      transform.position.set(node.position[0], 0.65, node.position[2])
      transform.scale.setScalar(node.id === selectedId ? 1.12 : 1)
      transform.updateMatrix()
      mesh.current!.setMatrixAt(index, transform.matrix)
      mesh.current!.setColorAt(index, new Color(STATUS_COLORS[node.status]))
    })
    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
    mesh.current.computeBoundingSphere()
    invalidate()
  }, [nodes, selectedId, invalidate])

  const select = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    if (event.instanceId !== undefined && nodes[event.instanceId]) {
      onSelect(nodes[event.instanceId].id)
    }
  }

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, nodes.length]} onClick={select}>
      <cylinderGeometry args={[0.44, 0.44, 0.95, 24]} />
      <meshStandardMaterial roughness={0.45} metalness={0.15} />
    </instancedMesh>
  )
}

function SceneContent({ snapshot, selectedId, relatedIds, onSelect, onUnavailable }: SceneProps) {
  const nodeMap = new Map(snapshot.nodes.map(node => [node.id, node]))
  return (
    <>
      <ContextMonitor onUnavailable={onUnavailable} />
      <color attach="background" args={['#f0f0e9']} />
      <ambientLight intensity={1.6} />
      <directionalLight position={[4, 10, 6]} intensity={2.6} />
      <gridHelper args={[26, 26, '#c5cdc1', '#dfe2d8']} position={[0, -0.02, 0]} />
      <OrbitControls makeDefault target={[0, 0, 0]} minDistance={9} maxDistance={30}
        maxPolarAngle={Math.PI / 2.15} enableDamping />
      <StorageNodes nodes={snapshot.nodes.filter(node => node.kind === 'storage')}
        selectedId={selectedId} onSelect={onSelect} />
      {snapshot.links.map(link => {
        const source = nodeMap.get(link.source)
        const target = nodeMap.get(link.target)
        if (!source || !target) return null
        const offline = source.status === 'offline' || target.status === 'offline'
        const selected = link.source === selectedId || link.target === selectedId
        return (
          <Line key={`${link.source}-${link.target}`}
            points={[[source.position[0], 0.65, source.position[2]],
              [target.position[0], 0.65, target.position[2]]]}
            color={offline ? '#bd4b41' : selected ? '#b76b35' : '#b7c3b7'}
            lineWidth={selected || offline ? 2.5 : 1.2}
            dashed={offline} dashSize={0.22} gapSize={0.16} />
        )
      })}
      {snapshot.nodes.map(node => {
        const active = node.id === selectedId
        const related = relatedIds.has(node.id)
        return (
          <group key={node.id} position={node.position}>
            {node.kind === 'server' && (
              <mesh position={[0, 0.8, 0]} onClick={event => { event.stopPropagation(); onSelect(node.id) }}>
                <boxGeometry args={[0.85, 1.6, 0.85]} />
                <meshStandardMaterial color={STATUS_COLORS[node.status]} roughness={0.5} />
              </mesh>
            )}
            {(active || related) && (
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
                <ringGeometry args={[0.62, active ? 0.72 : 0.66, 40]} />
                <meshBasicMaterial color={active ? '#b76b35' : '#789082'} />
              </mesh>
            )}
            <Html position={[0, node.kind === 'server' ? 2.2 : 1.5, 0]} center zIndexRange={[10, 0]}>
              <span style={{ pointerEvents: 'none', whiteSpace: 'nowrap', fontSize: 11,
                color: active ? '#8d4c25' : '#45564a', fontWeight: active ? 700 : 500,
                background: 'rgba(249,249,243,.9)', padding: '3px 6px', borderRadius: 3 }}>
                {node.name}
              </span>
            </Html>
          </group>
        )
      })}
    </>
  )
}

export default function TopologyScene(props: SceneProps) {
  return (
    <Canvas camera={{ position: [12, 12, 17], fov: 40 }} dpr={[1, 1.5]} frameloop="demand"
      gl={{ antialias: true, alpha: false }} aria-label="备份与存储节点三维拓扑"
      fallback={<p>三维视图不可用，请使用节点列表。</p>}>
      <SceneContent {...props} />
    </Canvas>
  )
}
