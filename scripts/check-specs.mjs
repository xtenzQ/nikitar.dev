import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const TYPES = new Set(['goal-and-requirements', 'architecture-design', 'module-design', 'submodule-design', 'task-spec'])
const STATUSES = new Set(['draft', 'active', 'stale', 'done', 'deprecated'])
const LINKS = ['parent', 'depends-on', 'references', 'implements']

const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '--', '*.md'], { encoding: 'utf8' })
  .split('\n').filter(Boolean)

function frontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/)
  if (!match) return null
  const fields = {}
  for (const line of match[1].split('\n')) {
    const [, key, value] = line.match(/^([\w-]+):\s*(.*)$/) ?? []
    if (!key) continue
    const list = value.match(/^\[(.*)\]$/)
    fields[key] = list ? list[1].split(',').map(item => item.trim()).filter(Boolean) : value.trim()
  }
  return { fields, body: text.slice(match[0].length) }
}

const specs = new Map()
const errors = []
for (const file of files) {
  const parsed = frontmatter(readFileSync(file, 'utf8'))
  if (!parsed?.fields.id || !parsed.fields.type) continue
  const { id } = parsed.fields
  if (specs.has(id)) errors.push(`${file}: duplicate id "${id}" (also ${specs.get(id).file})`)
  specs.set(id, { file, ...parsed })
}

for (const [id, { file, fields, body }] of specs) {
  if (!fields.title) errors.push(`${file}: no title`)
  if (!TYPES.has(fields.type)) errors.push(`${file}: unknown type "${fields.type}"`)
  if (fields.status && !STATUSES.has(fields.status)) errors.push(`${file}: unknown status "${fields.status}"`)
  const targets = LINKS.flatMap(key => [fields[key] ?? []].flat().map(target => [key, target]))
  const prose = body.replace(/^```[\s\S]*?^```/gm, '').replace(/`[^`\n]*`/g, '')
  for (const [, target] of prose.matchAll(/\[\[([^\]]+)\]\]/g)) targets.push(['link', target])
  for (const [key, target] of targets) {
    if (!specs.has(target)) errors.push(`${file}: ${key} "${target}" is not a spec id`)
  }
  const seen = new Set([id])
  for (let parent = fields.parent; parent && specs.has(parent); parent = specs.get(parent).fields.parent) {
    if (seen.has(parent)) {
      errors.push(`${file}: parent cycle through "${parent}"`)
      break
    }
    seen.add(parent)
  }
}

for (const error of errors) console.error(error)
console.log(`${specs.size} specs, ${errors.length} problems`)
process.exit(errors.length ? 1 : 0)
