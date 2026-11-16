import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

export const root = '.output/public'
export const origin = `https://${(await readFile('public/CNAME', 'utf8')).trim()}`
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

export async function serveBuild(page, { pass = [] } = {}) {
  const fetched = new Map()
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url())
    if (pass.includes(url.host)) {
      if (!fetched.has(url.href)) fetched.set(url.href, route.fetch())
      return route.fulfill({ response: await fetched.get(url.href) })
    }
    if (url.origin !== origin) return route.abort()
    let file = join(root, normalize(decodeURIComponent(url.pathname)))
    try {
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html')
      await route.fulfill({ body: await readFile(file), contentType: types[extname(file)] ?? 'application/octet-stream' })
    }
    catch {
      await route.fulfill({ status: 404 })
    }
  })
}
