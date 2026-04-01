import { createCanvas } from 'canvas'
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

function drawIcon(size) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')
  const r = size * 0.15 // border radius

  // Background: slate-950 rounded rect
  ctx.fillStyle = '#0f172a'
  ctx.beginPath()
  ctx.roundRect(0, 0, size, size, r)
  ctx.fill()

  // Blue glow circle
  const cx = size / 2
  const cy = size / 2
  const glowR = size * 0.28
  const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR)
  grd.addColorStop(0, 'rgba(59,130,246,0.25)')
  grd.addColorStop(1, 'rgba(59,130,246,0)')
  ctx.fillStyle = grd
  ctx.beginPath()
  ctx.arc(cx, cy, glowR, 0, Math.PI * 2)
  ctx.fill()

  // Zap / lightning bolt
  ctx.fillStyle = '#3b82f6'
  const s = size * 0.38
  const x = cx - s * 0.35
  const y = cy - s * 0.52

  ctx.beginPath()
  // Top triangle part of zap
  ctx.moveTo(x + s * 0.55, y)
  ctx.lineTo(x + s * 0.05, y + s * 0.52)
  ctx.lineTo(x + s * 0.48, y + s * 0.48)
  // Bottom triangle part of zap
  ctx.lineTo(x + s * 0.45, y + s)
  ctx.lineTo(x + s * 0.95, y + s * 0.48)
  ctx.lineTo(x + s * 0.52, y + s * 0.52)
  ctx.closePath()
  ctx.fill()

  return canvas
}

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
]

for (const { name, size } of sizes) {
  const canvas = drawIcon(size)
  const buf = canvas.toBuffer('image/png')
  writeFileSync(join(publicDir, name), buf)
  console.log(`✓ Generated ${name} (${size}×${size})`)
}
