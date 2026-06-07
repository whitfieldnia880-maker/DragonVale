/**
 * Generates placeholder PNG files for all character asset slots.
 * Run once: node scripts/generate-placeholders.cjs
 * Safe to re-run — skips files that already exist.
 */

const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

// ─── PNG writer ───────────────────────────────────────────────────────────────

function crc32(buf) {
  let crc = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i]
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? ((crc >>> 1) ^ 0xEDB88320) : (crc >>> 1)
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii')
  const lenBuf = Buffer.alloc(4)
  lenBuf.writeUInt32BE(data.length, 0)
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf])
}

function solidPNG(width, height, r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8  // bit depth
  ihdr[9] = 2  // RGB color type

  const rowBytes = width * 3
  const raw = Buffer.alloc(height * (rowBytes + 1))
  for (let y = 0; y < height; y++) {
    const row = y * (rowBytes + 1)
    raw[row] = 0  // filter: None
    for (let x = 0; x < width; x++) {
      raw[row + 1 + x * 3 + 0] = r
      raw[row + 1 + x * 3 + 1] = g
      raw[row + 1 + x * 3 + 2] = b
    }
  }

  const idat = zlib.deflateSync(raw, { level: 9 })

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ─── Asset spec ───────────────────────────────────────────────────────────────

const CHARS = ['amy', 'marcus', 'olivier', 'remy', 'dex', 'sunny', 'driver', 'celeste']
const ROOT = path.join(__dirname, '..', 'public', 'assets', 'characters')

// [filename, width, height, r, g, b]
const SLOTS = [
  ['portrait.png',   400, 600, 180, 180, 180],
  ['bust.png',       200, 300, 180, 180, 180],
  ['silhouette.png', 400, 600,  30,  30,  30],
  ['card.png',       300, 400, 180, 180, 180],
  ['apartment.png',  200, 400, 180, 180, 180],
  ['thumb.png',      120, 120, 180, 180, 180],
]

const EXPR_SLOTS = [
  ['neutral.png',   200, 200, 180, 180, 180],
  ['happy.png',     200, 200, 180, 180, 180],
  ['surprised.png', 200, 200, 180, 180, 180],
  ['sad.png',       200, 200, 180, 180, 180],
  ['flustered.png', 200, 200, 180, 180, 180],
]

// ─── Generation ───────────────────────────────────────────────────────────────

let created = 0
let skipped = 0

for (const char of CHARS) {
  const charDir = path.join(ROOT, char)
  const exprDir = path.join(charDir, 'expr')
  fs.mkdirSync(exprDir, { recursive: true })

  for (const [filename, w, h, r, g, b] of SLOTS) {
    const dest = path.join(charDir, filename)
    if (fs.existsSync(dest)) { skipped++; continue }
    fs.writeFileSync(dest, solidPNG(w, h, r, g, b))
    created++
    console.log(`  + ${char}/${filename} (${w}×${h})`)
  }

  for (const [filename, w, h, r, g, b] of EXPR_SLOTS) {
    const dest = path.join(exprDir, filename)
    if (fs.existsSync(dest)) { skipped++; continue }
    fs.writeFileSync(dest, solidPNG(w, h, r, g, b))
    created++
    console.log(`  + ${char}/expr/${filename} (${w}×${h})`)
  }
}

console.log(`\nDone. Created: ${created}  Skipped (already existed): ${skipped}`)
