import { chromium } from 'playwright'
import { mkdirSync } from 'fs'
mkdirSync('/tmp/journey', { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  colorScheme: 'dark',
  locale: 'zh-CN',
})
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message.split('\n')[0]))

await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 60000 })
await page.waitForTimeout(5000)

// 首屏诊断：Hero3D 的 canvas 情况
const heroInfo = await page.evaluate(() => {
  const cs = [...document.querySelectorAll('canvas')].map((c) => {
    const r = c.getBoundingClientRect()
    return { w: c.width, h: c.height, top: Math.round(r.top), h2: Math.round(r.height), vis: r.width > 0 && r.height > 0 }
  })
  return { scrollY: window.scrollY, docH: document.body.scrollHeight, canvases: cs }
})
console.log('HERO@0:', JSON.stringify(heroInfo))
await page.screenshot({ path: '/tmp/journey/0-hero.png' })

const geom = await page.evaluate(() => {
  const el = document.getElementById('experience-journey')
  return { top: el.offsetTop, height: el.offsetHeight, vh: window.innerHeight }
})
const scrollable = geom.height - geom.vh
const steps = [0, 0.34, 0.67, 1]
for (let i = 0; i < steps.length; i++) {
  const y = Math.round(geom.top + steps[i] * scrollable)
  await page.evaluate((yy) => window.scrollTo(0, yy), y)
  await page.waitForTimeout(1200)
  const info = await page.evaluate(() => {
    const sec = document.getElementById('experience-journey')
    const sticky = sec.firstElementChild
    const r = sticky.getBoundingClientRect()
    const cs = [...document.querySelectorAll('canvas')].map((c) => {
      const cr = c.getBoundingClientRect()
      return { top: Math.round(cr.top), h: Math.round(cr.height), vis: cr.height > 0 && cr.top < window.innerHeight && cr.top + cr.height > 0 }
    })
    return { scrollY: window.scrollY, stickyTop: Math.round(r.top), stickyH: Math.round(r.height), canvases: cs }
  })
  console.log(`STEP ${Math.round(steps[i] * 100)}%:`, JSON.stringify(info))
  await page.screenshot({ path: `/tmp/journey/journey-${i}-${Math.round(steps[i] * 100)}pct.png` })
}
await browser.close()
console.log('done')
