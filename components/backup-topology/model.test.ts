import assert from 'node:assert/strict'
import test from 'node:test'
import { createTopology, filterNodes, getRelatedIds, getSummary, setNodeAvailability } from './model'

test('场景节点唯一，链路端点存在，容量在有效范围内', () => {
  const { nodes, links } = createTopology()
  const ids = new Set(nodes.map(node => node.id))
  assert.equal(ids.size, 12)
  assert.ok(links.every(link => ids.has(link.source) && ids.has(link.target)))
  assert.ok(nodes.every(node => node.usedTb >= 0 && node.usedTb <= node.capacityTb))
  assert.deepEqual(getSummary(nodes), { total: 12, offline: 0, warning: 1, capacityTb: 900, usedTb: 505 })
})

test('离线与恢复仅替换目标节点，保留拓扑位置、链路和容量预警', () => {
  const initial = createTopology()
  const failed = setNodeAvailability(initial, 'storage-1-3', false)
  assert.equal(initial.nodes[3].status, 'warning')
  assert.equal(failed.nodes[3].status, 'offline')
  assert.equal(failed.nodes[0], initial.nodes[0])
  assert.equal(failed.nodes[3].position, initial.nodes[3].position)
  assert.equal(failed.links, initial.links)
  assert.equal(setNodeAvailability(failed, 'storage-1-3', true).nodes[3].status, 'warning')
  assert.equal(setNodeAvailability(initial, 'unknown', false), initial)
  assert.equal(setNodeAvailability(failed, 'storage-1-3', false), failed)
  assert.equal(setNodeAvailability(setNodeAvailability(initial, 'backup-1', false), 'backup-1', true).nodes[0].status, 'online')
})

test('关联关系双向查找，未知节点没有关联', () => {
  const snapshot = createTopology()
  assert.deepEqual([...getRelatedIds(snapshot, 'storage-1-1')], ['backup-1'])
  assert.equal(getRelatedIds(snapshot, 'backup-1').size, 5)
  assert.equal(getRelatedIds(snapshot, 'unknown').size, 0)
})

test('搜索覆盖名称、编号和中心，支持空值、异常筛选与无匹配结果', () => {
  const { nodes } = createTopology()
  assert.equal(filterNodes(nodes, '  STORAGE-2-1 ', false).length, 1)
  assert.equal(filterNodes(nodes, '异地', false).length, 4)
  assert.equal(filterNodes(nodes, '', true).length, 1)
  assert.equal(filterNodes(nodes, '不存在', false).length, 0)
  assert.equal(filterNodes([], '', false).length, 0)
  assert.deepEqual(getSummary([]), { total: 0, offline: 0, warning: 0, capacityTb: 0, usedTb: 0 })
})
