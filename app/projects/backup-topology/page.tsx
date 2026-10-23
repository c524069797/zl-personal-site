import type { Metadata } from 'next'
import BackupTopology from '@/components/backup-topology/BackupTopology'

export const metadata: Metadata = {
  title: '备份资源拓扑',
  description: 'Three.js / WebGL 备份资源拓扑模块，支持节点拾取、关联链路高亮、容量查看及离线恢复场景。',
  alternates: { canonical: '/projects/backup-topology' },
}

export default function BackupTopologyPage() {
  return <BackupTopology />
}
