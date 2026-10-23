import { expect, test } from 'playwright/test'
import { PerspectiveCamera, Vector3 } from 'three'

test('三维画布完成渲染，射线拾取能选择实例节点', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/projects/backup-topology')
  const canvas = page.getByLabel('备份与存储节点三维拓扑').locator('canvas')
  await expect(canvas).toBeVisible()
  await expect(page.getByText('加载中：正在准备三维拓扑…')).toHaveCount(0)
  await expect(page.getByText('存储 2-1', { exact: true }).first()).toBeVisible()
  const bounds = await canvas.boundingBox()
  expect(bounds).not.toBeNull()
  const { width, height, x, y } = bounds!
  const camera = new PerspectiveCamera(40, width / height, 0.1, 1000)
  camera.position.set(12, 12, 17)
  camera.lookAt(0, 0, 0)
  camera.updateMatrixWorld()
  const point = new Vector3(-1.45, 0.65, 1.5).project(camera)
  await page.mouse.click(x + (point.x + 1) * width / 2, y + (1 - point.y) * height / 2)
  await expect(page.getByRole('complementary', { name: '节点详情' }).getByRole('heading', { name: '存储 2-1', exact: true })).toBeVisible()
  expect(errors).toEqual([])
})

test('选择节点、离线、恢复及重置，详情与目录保持一致', async ({ page }, testInfo) => {
  await page.goto('/projects/backup-topology')
  const details = page.getByRole('complementary', { name: '节点详情' })
  await expect(details.getByRole('heading', { name: '存储 1-3', exact: true })).toBeVisible()
  await page.getByRole('button', { name: '设为离线', exact: true }).click()
  await expect(details.getByText('节点离线', { exact: true })).toBeVisible()
  await page.getByRole('checkbox', { name: '仅看异常' }).check()
  await expect(page.getByRole('button', { name: /存储 1-3 主数据中心 节点离线/ })).toBeVisible()
  await page.getByRole('button', { name: '恢复节点', exact: true }).click()
  await expect(details.getByText('容量预警', { exact: true })).toBeVisible()
  await page.getByRole('textbox', { name: '搜索节点' }).fill('无匹配节点')
  await expect(page.getByText('没有匹配的节点，请调整搜索条件。')).toBeVisible()
  await page.getByRole('button', { name: '重置场景', exact: true }).click()
  await expect(page.getByRole('textbox', { name: '搜索节点' })).toHaveValue('')
  await expect(page.getByRole('checkbox', { name: '仅看异常' })).not.toBeChecked()
  await expect(page.getByRole('button', { name: /存储 2-1 同城备份中心 运行正常/ })).toBeVisible()
  await page.getByRole('button', { name: /存储 2-1 同城备份中心 运行正常/ }).click()
  await expect(details.getByRole('heading', { name: '存储 2-1', exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('topology.png'), fullPage: true })
})

test('没有 WebGL 时自动降级，仍可查询节点与恢复状态', async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof getContext>) {
      if (String(args[0]).startsWith('webgl')) return null
      return getContext.apply(this, args)
    } as typeof getContext
  })
  await page.goto('/projects/backup-topology')
  await expect(page.getByText('WebGL 不可用，已启用列表视图。')).toBeVisible()
  await expect(page.getByRole('button', { name: '三维', exact: true })).toBeDisabled()
  await page.getByRole('textbox', { name: '搜索节点' }).fill('storage-2-1')
  await page.getByRole('button', { name: /存储 2-1/ }).click()
  await page.getByRole('button', { name: '设为离线', exact: true }).click()
  await expect(page.getByRole('button', { name: /存储 2-1 同城备份中心 节点离线/ })).toBeVisible()
  await page.getByRole('button', { name: '恢复节点', exact: true }).click()
  await expect(page.getByRole('button', { name: /存储 2-1 同城备份中心 运行正常/ })).toBeVisible()
})
