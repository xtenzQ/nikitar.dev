import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from 'playwright-core'
import { origin, root, serveBuild } from './serve-build.mjs'

const { pdf } = JSON.parse(await readFile('app/data/cv.json', 'utf8'))

const browser = await chromium.launch({ channel: 'chrome' })
try {
  const page = await browser.newPage()
  await serveBuild(page)
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
