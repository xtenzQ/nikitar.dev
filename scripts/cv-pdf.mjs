// Prints the prerendered /cv/ to a PDF next to it. Run after `nuxt build`.
import { readFile, stat, writeFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { chromium } from 'playwright-core'

const root = '.output/public'
const { pdf } = JSON.parse(await readFile('app/data/cv.json', 'utf8'))
// The page is opened at the real origin and served from disk, so its relative links become full URLs in the PDF
const origin = `https://${(await readFile('public/CNAME', 'utf8')).trim()}`
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

async function serve(route) {
  const url = new URL(route.request().url())
  if (url.origin !== origin) return route.abort()
  let file = join(root, normalize(decodeURIComponent(url.pathname)))
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html')
    await route.fulfill({ body: await readFile(file), contentType: types[extname(file)] ?? 'application/octet-stream' })
  }
  catch {
    await route.fulfill({ status: 404 })
  }
}

// The installed Chrome: GitHub's Ubuntu runners and most desktops have it, so nothing is downloaded
const browser = await chromium.launch({ channel: 'chrome' })
try {
  const page = await browser.newPage()
  await page.route('**/*', serve)
  await page.emulateMedia({ media: 'print', colorScheme: 'light' })
  await page.goto(`${origin}/cv/`, { waitUntil: 'load' })
  const bytes = await page.pdf({ preferCSSPageSize: true, printBackground: true, tagged: true, outline: true })
  await writeFile(join(root, pdf), bytes)
  const pages = bytes.toString('latin1').match(/\/Type\s*\/Page\b/g)?.length ?? 0
  console.log(`[cv-pdf] ${pdf}: ${pages} page${pages === 1 ? '' : 's'}, ${Math.round(bytes.length / 1024)} KB`)
}
finally {
  await browser.close()
}
