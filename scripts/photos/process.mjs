#!/usr/bin/env node
// Turns originals in photos-src/<group>/ into published WebP files and data entries. See SPEC.md.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, extname, join } from 'node:path'

const root = new URL('../../', import.meta.url).pathname
const srcDir = join(root, 'photos-src')
const outDir = join(root, 'public/photos')
const dataFile = join(root, 'app/data/photos.json')
const resizeScript = join(root, 'scripts/photos/resize.swift')

const LARGE_MAX = 1600
const THUMB_BOX = { width: 600, height: 800 }
const EXTENSIONS = new Set(['.heic', '.heif', '.jpg', '.jpeg', '.png', '.webp'])

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function resize(input, output, maxPixelSize) {
  const out = execFileSync(resizeBin, [input, output, String(maxPixelSize)], { encoding: 'utf8' })
  const [width, height] = out.trim().split(' ').map(Number)
  return { width, height }
}

function encode(png, webp, quality) {
  execFileSync('cwebp', ['-quiet', '-q', String(quality), '-m', '6', '-metadata', 'none', png, '-o', webp])
}

if (!existsSync(srcDir)) {
  console.error(`No ${srcDir}. Put originals in photos-src/<group>/ first.`)
  process.exit(1)
}

const data = JSON.parse(readFileSync(dataFile, 'utf8'))
const known = new Set(data.groups.flatMap(g => g.photos.map(p => p.name)))
const tmp = mkdtempSync(join(tmpdir(), 'photos-'))
const resizeBin = join(tmp, 'resize')
mkdirSync(outDir, { recursive: true })

const added = []
try {
  execFileSync('swiftc', ['-O', resizeScript, '-o', resizeBin])

  for (const groupId of readdirSync(srcDir).sort()) {
    const groupDir = join(srcDir, groupId)
    if (!statSync(groupDir).isDirectory()) continue

    let group = data.groups.find(g => g.id === groupId)
    if (!group) {
      group = { id: groupId, title: groupId, photos: [] }
      data.groups.push(group)
    }

    for (const file of readdirSync(groupDir).sort()) {
      if (!EXTENSIONS.has(extname(file).toLowerCase())) continue
      const name = `${slug(groupId)}-${slug(basename(file, extname(file)))}`
      if (known.has(name)) continue

      const input = join(groupDir, file)
      const largePng = join(tmp, `${name}-large.png`)
      const large = resize(input, largePng, LARGE_MAX)

      // The thumbnail covers a 3:4 tile, so landscape photos keep enough height to crop
      const scale = Math.max(THUMB_BOX.width / large.width, THUMB_BOX.height / large.height)
      const thumbPng = join(tmp, `${name}.png`)
      resize(input, thumbPng, Math.ceil(Math.max(large.width, large.height) * scale))

      encode(largePng, join(outDir, `${name}-large.webp`), 72)
      encode(thumbPng, join(outDir, `${name}.webp`), 76)

      group.photos.push({ name, caption: '', alt: '', width: large.width, height: large.height })
      known.add(name)
      added.push(`${groupId}/${file} → ${name} (${large.width}×${large.height})`)
    }
  }
}
finally {
  rmSync(tmp, { recursive: true, force: true })
}

writeFileSync(dataFile, `${JSON.stringify(data, null, 2)}\n`)

if (added.length === 0) {
  console.log('Nothing new.')
}
else {
  console.log(`Added ${added.length}:\n  ${added.join('\n  ')}`)
  console.log('\nFill in caption and alt for the new entries in app/data/photos.json, and a title for any new group.')
}
