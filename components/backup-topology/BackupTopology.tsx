'use client'

import { Component, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Box, Check, Database, Layers3, List, LoaderCircle, RotateCcw, Search, Server, Unplug } from 'lucide-react'
import { createTopology, filterNodes, getRelatedIds, getSummary, setNodeAvailability, STATUS_COLORS, STATUS_LABELS } from './model'
import styles from './topology.module.css'

function SceneLoading() {
  return <div className={styles.loading} role="status"><LoaderCircle size={24} className={styles.spinner} />加载中：正在准备三维拓扑…</div>
}

const TopologyScene = dynamic(() => import('./TopologyScene'), { ssr: false, loading: SceneLoading })

class SceneBoundary extends Component<{ children: ReactNode; onUnavailable: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onUnavailable() }
  render() { return this.state.failed ? null : this.props.children }
}

export default function BackupTopology() {
  const [snapshot, setSnapshot] = useState(createTopology)
  const [selectedId, setSelectedId] = useState('storage-1-3')
  const [query, setQuery] = useState('')
  const [abnormalOnly, setAbnormalOnly] = useState(false)
  const [view, setView] = useState<'3d' | 'list'>('3d')
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null)
  const [sceneVersion, setSceneVersion] = useState(0)
  const [notice, setNotice] = useState('已选中容量预警节点，可查看关联链路或切换节点状态。')
  const markUnavailable = useCallback(() => {
    setWebglAvailable(false)
    setView('list')
    setNotice('三维视图不可用，已切换到节点列表。节点查询与状态操作仍可使用。')
  }, [])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('webgl2')
        if (!context) { markUnavailable(); return }
        context.getExtension('WEBGL_lose_context')?.loseContext()
        setWebglAvailable(true)
      } catch { markUnavailable() }
    })
    return () => cancelAnimationFrame(frame)
  }, [markUnavailable])

  const selected = snapshot.nodes.find(node => node.id === selectedId)!
  const relatedIds = useMemo(() => getRelatedIds(snapshot, selectedId), [snapshot, selectedId])
  const visibleNodes = useMemo(() => filterNodes(snapshot.nodes, query, abnormalOnly), [snapshot.nodes, query, abnormalOnly])
  const summary = getSummary(snapshot.nodes)
  const selectedUsage = selected.capacityTb ? Math.round(selected.usedTb / selected.capacityTb * 100) : 0

  const selectNode = (id: string) => {
    setSelectedId(id)
    const node = snapshot.nodes.find(item => item.id === id)
    if (node) setNotice(`已选中${node.name}，高亮 ${getRelatedIds(snapshot, id).size} 条关联链路。`)
  }
  const toggleAvailability = () => {
    const online = selected.status === 'offline'
    setSnapshot(previous => setNodeAvailability(previous, selectedId, online))
    setNotice(`${selected.name}${online ? '已恢复连接' : '已设为离线'}，关联链路已更新。`)
  }
  const reset = () => {
    setSnapshot(createTopology())
    setSelectedId('storage-1-3')
    setQuery('')
    setAbnormalOnly(false)
    setSceneVersion(version => version + 1)
    setNotice('场景已重置，所有节点恢复初始状态。')
  }

  const nodeList = (
    <div className={styles.nodeList} aria-label="拓扑节点列表">
      {visibleNodes.length === 0 ? <p className={styles.empty}>没有匹配的节点，请调整搜索条件。</p> : visibleNodes.map(node => (
        <button key={node.id} type="button" className={`${styles.nodeRow} ${node.id === selectedId ? styles.selected : ''}`}
          onClick={() => selectNode(node.id)} aria-pressed={node.id === selectedId}>
          {node.kind === 'server' ? <Server size={18} /> : <Database size={18} />}
          <span><strong>{node.name}</strong><small>{node.site}</small></span>
          <span className={styles.nodeStatus} style={{ color: STATUS_COLORS[node.status] }}>
            <i style={{ background: STATUS_COLORS[node.status] }} />{STATUS_LABELS[node.status]}
          </span>
        </button>
      ))}
    </div>
  )

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/resume" className={styles.back}><ArrowLeft size={16} />返回简历</Link>
        <span className={styles.moduleLabel}>BACKUP OPERATIONS <span>/</span> RESOURCE TOPOLOGY</span>
        <a href="https://github.com/c524069797/zl-personal-site/tree/main/components/backup-topology"
          target="_blank" rel="noopener noreferrer" className={styles.source}>查看源码<ArrowUpRight size={15} /></a>
      </header>

      <section className={styles.intro}>
        <div><p className={styles.eyebrow}><span />运维工作台 · 资源关系</p><h1>让每条备份链路，<br className={styles.mobileBreak} />清晰可见。</h1>
          <p className={styles.subtitle}>从备份服务到存储节点，在同一视图中查看连接、容量与异常。</p></div>
        <div className={styles.scope}><Box size={19} /><div><strong>Three.js / WebGL</strong><span>独立扩展模块 · 本地场景数据</span></div></div>
      </section>

      <section className={styles.metrics} aria-label="资源概览">
        <div><span>管理节点</span><strong>{summary.total}<small>个</small></strong><p>3 个备份服务 / 9 个存储节点</p></div>
        <div><span>存储使用量</span><strong>{summary.usedTb}<small>/ {summary.capacityTb} TB</small></strong><p>总使用率 {Math.round(summary.usedTb / summary.capacityTb * 100)}%</p></div>
        <div><span>容量预警</span><strong className={styles.warning}>{summary.warning}<small>个</small></strong><p>使用率达到 85% 时预警</p></div>
        <div><span>离线节点</span><strong className={summary.offline ? styles.danger : ''}>{summary.offline}<small>个</small></strong><p>{summary.offline ? '关联链路已标记异常' : '所有节点连接正常'}</p></div>
      </section>

      <section className={styles.workspace} aria-label="备份资源拓扑工作区">
        <div className={styles.visualArea}>
          <div className={styles.toolbar}><div><h2>资源拓扑</h2><span>三个中心 · 十一条连接</span></div>
            <div className={styles.viewControls} role="group" aria-label="视图切换">
              <button type="button" aria-pressed={view === '3d'} disabled={webglAvailable === false} onClick={() => setView('3d')}><Layers3 size={15} />三维</button>
              <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}><List size={15} />列表</button>
              <button type="button" onClick={reset} aria-label="重置场景"><RotateCcw size={15} /></button>
            </div>
          </div>
          {view === '3d' ? <div className={styles.canvas}>
            {webglAvailable === null ? <SceneLoading /> : <SceneBoundary key={sceneVersion} onUnavailable={markUnavailable}>
              <TopologyScene snapshot={snapshot} selectedId={selectedId} relatedIds={relatedIds} onSelect={selectNode} onUnavailable={markUnavailable} />
            </SceneBoundary>}
            <div className={styles.siteLabels}><span>主数据中心</span><span>同城备份中心</span><span>异地归档中心</span></div>
            <p className={styles.canvasHint}>拖动旋转 · 滚轮缩放 · 点击节点查看详情</p>
          </div> : <div className={styles.listView}>
            {webglAvailable === false && <p className={styles.fallback}><Unplug size={16} />WebGL 不可用，已启用列表视图。</p>}
            {nodeList}
          </div>}
          <div className={styles.legend}><span><i style={{ background: STATUS_COLORS.online }} />正常</span><span><i style={{ background: STATUS_COLORS.warning }} />容量预警</span><span><i style={{ background: STATUS_COLORS.offline }} />离线 / 异常链路</span><small>方柱：备份服务　圆柱：存储节点</small></div>
        </div>

        <aside className={styles.details} aria-label="节点详情">
          <p className={styles.eyebrow}>NODE INSPECTOR</p>
          <div className={styles.detailTitle}><h2>{selected.name}</h2><span style={{ color: STATUS_COLORS[selected.status] }}>{STATUS_LABELS[selected.status]}</span></div>
          <p className={styles.nodeId}>{selected.id}</p>
          <dl><div><dt>所属中心</dt><dd>{selected.site}</dd></div><div><dt>节点类型</dt><dd>{selected.kind === 'server' ? '备份服务' : '存储节点'}</dd></div><div><dt>直接关联</dt><dd>{relatedIds.size} 个节点</dd></div></dl>
          {selected.capacityTb > 0 && <div className={styles.capacity}><div><span>容量使用率</span><strong>{selectedUsage}%</strong></div>
            <meter min={0} max={100} value={selectedUsage} high={85} optimum={40} aria-label="选中节点容量使用率" />
            <p>{selected.usedTb} TB 已用 / {selected.capacityTb} TB 总量</p></div>}
          <div className={styles.related}><h3>关联节点</h3>{[...relatedIds].map(id => <button key={id} type="button" onClick={() => selectNode(id)}>{snapshot.nodes.find(node => node.id === id)?.name}<ArrowUpRight size={13} /></button>)}</div>
          <button type="button" className={selected.status === 'offline' ? styles.restoreButton : styles.offlineButton} onClick={toggleAvailability}>
            {selected.status === 'offline' ? <Check size={16} /> : <Unplug size={16} />}{selected.status === 'offline' ? '恢复节点' : '设为离线'}
          </button>
          <p className={styles.localHint}>状态操作仅作用于本页场景，刷新后恢复初始数据。</p>
        </aside>
      </section>

      <p className={styles.notice} role="status" aria-live="polite"><span />{notice}</p>
      <section className={styles.inventory} aria-label="节点查询">
        <div className={styles.inventoryHeader}><div><h2>节点目录</h2><p>选择节点，联动拓扑与详情。</p></div>
          <div className={styles.filters}><label className={styles.search}><Search size={16} /><input aria-label="搜索节点" placeholder="搜索节点名称、编号或中心" value={query} onChange={event => setQuery(event.target.value)} /></label>
            <label className={styles.checkbox}><input type="checkbox" checked={abnormalOnly} onChange={event => setAbnormalOnly(event.target.checked)} />仅看异常</label></div>
        </div>
        {view === '3d' ? nodeList : <p className={styles.listHint}>列表视图已在上方展示，共 {visibleNodes.length} 个匹配节点。</p>}
      </section>
      <footer className={styles.footer}><span>备份监控场景扩展 · 2026.10</span><span>React Three Fiber · InstancedMesh · 节点拾取 · 增量状态更新</span></footer>
    </main>
  )
}
