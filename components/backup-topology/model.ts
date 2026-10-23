export type NodeStatus = 'online' | 'warning' | 'offline'
export type TopologyNode = {
  id: string
  name: string
  kind: 'server' | 'storage'
  site: string
  status: NodeStatus
  capacityTb: number
  usedTb: number
  position: [number, number, number]
}
export type TopologyLink = { source: string; target: string }
export type TopologySnapshot = { nodes: TopologyNode[]; links: TopologyLink[] }

export const STATUS_LABELS: Record<NodeStatus, string> = {
  online: '运行正常', warning: '容量预警', offline: '节点离线',
}
export const STATUS_COLORS: Record<NodeStatus, string> = {
  online: '#54796a', warning: '#c47b20', offline: '#bd4b41',
}

// 固定场景仅在浏览器中运行，不读取或操作企业环境。
export function createTopology(): TopologySnapshot {
  const nodes: TopologyNode[] = []
  const links: TopologyLink[] = []
  const sites = ['主数据中心', '同城备份中心', '异地归档中心']
  sites.forEach((site, siteIndex) => {
    const x = (siteIndex - 1) * 5
    const serverId = `backup-${siteIndex + 1}`
    nodes.push({ id: serverId, name: `备份服务 ${siteIndex + 1}`, kind: 'server', site,
      status: 'online', capacityTb: 0, usedTb: 0, position: [x, 0, -2.5] })
    for (let i = 0; i < 3; i++) {
      const id = `storage-${siteIndex + 1}-${i + 1}`
      const usedTb = siteIndex === 0 && i === 2 ? 91 : 26 + siteIndex * 12 + i * 14
      nodes.push({ id, name: `存储 ${siteIndex + 1}-${i + 1}`, kind: 'storage', site,
        status: usedTb >= 85 ? 'warning' : 'online', capacityTb: 100, usedTb,
        position: [x + (i - 1) * 1.45, 0, 1.5 + (i % 2) * 1.4] })
      links.push({ source: serverId, target: id })
    }
    if (siteIndex > 0) links.push({ source: 'backup-1', target: serverId })
  })
  return { nodes, links }
}

export function setNodeAvailability(snapshot: TopologySnapshot, id: string, online: boolean): TopologySnapshot {
  const node = snapshot.nodes.find(item => item.id === id)
  if (!node) return snapshot
  const status: NodeStatus = online ? (node.capacityTb > 0 && node.usedTb / node.capacityTb >= 0.85 ? 'warning' : 'online') : 'offline'
  if (node.status === status) return snapshot
  return { ...snapshot, nodes: snapshot.nodes.map(item => item.id === id ? { ...item, status } : item) }
}

export function getRelatedIds(snapshot: TopologySnapshot, id: string): Set<string> {
  const related = new Set<string>()
  for (const link of snapshot.links) {
    if (link.source === id) related.add(link.target)
    if (link.target === id) related.add(link.source)
  }
  return related
}

export function filterNodes(nodes: TopologyNode[], query: string, abnormalOnly: boolean): TopologyNode[] {
  const keyword = query.trim().toLowerCase()
  return nodes.filter(node => (!abnormalOnly || node.status !== 'online') &&
    `${node.name} ${node.id} ${node.site}`.toLowerCase().includes(keyword))
}

export function getSummary(nodes: TopologyNode[]) {
  return nodes.reduce((result, node) => ({
    total: result.total + 1,
    offline: result.offline + Number(node.status === 'offline'),
    warning: result.warning + Number(node.status === 'warning'),
    capacityTb: result.capacityTb + node.capacityTb,
    usedTb: result.usedTb + node.usedTb,
  }), { total: 0, offline: 0, warning: 0, capacityTb: 0, usedTb: 0 })
}
