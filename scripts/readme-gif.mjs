import { execFileSync } from 'node:child_process'
import { mkdtemp, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'
import { chromium } from 'playwright-core'
import { origin, serveBuild } from './serve-build.mjs'

const out = 'docs/preview.gif'
const viewport = { width: 800, height: 800 }
// ffmpeg's concat demuxer rounds image durations to 1/25 s.
const fps = 25
const slow = 5

// Screencast frames follow the window, not the emulated viewport.
const browser = await chromium.launch({
  channel: 'chrome',
  args: [`--window-size=${viewport.width},${viewport.height}`, '--force-device-scale-factor=2'],
})
const dir = await mkdtemp(join(tmpdir(), 'readme-gif-'))
try {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 2, colorScheme: 'dark', reducedMotion: 'no-preference' })
  await serveBuild(page, { pass: ['avatars.githubusercontent.com', 'github.com'] })
  for (const path of ['/oss/', '/photos/', '/']) await page.goto(origin + path, { waitUntil: 'networkidle' })

  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Animation.enable')
  await cdp.send('Animation.setPlaybackRate', { playbackRate: 1 / slow })
  const step = slow / fps
  const start = Date.now() / 1000
  const frames = []
  cdp.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
    const tick = Math.max(0, Math.ceil((metadata.timestamp - start) / step))
    if (frames.at(-1)?.tick === tick) frames.pop()
    frames.push({ data, tick })
    cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {})
  })
  const hold = ms => sleep(ms * slow)
  const click = async (selector, path) => {
    await page.click(selector)
    await page.mouse.move(viewport.width - 1, viewport.height - 1)
    if (path) await page.waitForURL(origin + path)
  }

  await cdp.send('Page.startScreencast', { format: 'png' })
  await hold(1500)
  await click('#door-oss', '/oss/')
  await hold(2200)
  await click('a.home-link', '/')
  await hold(1500)
  await click('#door-photos', '/photos/')
  await hold(2200)
  await click('a.home-link', '/')
  await hold(1500)
  await click('.theme-toggle')
  await hold(1600)
  await click('.theme-toggle')
  await hold(600)
  const ticks = Math.ceil((Date.now() / 1000 - start) / step)
  await cdp.send('Page.stopScreencast')

  frames[0].tick = 0
  const shown = frames.filter(frame => frame.tick < ticks)
  const list = ['ffconcat version 1.0']
  for (const [n, { data, tick }] of shown.entries()) {
    await writeFile(join(dir, `${n}.png`), Buffer.from(data, 'base64'))
    list.push(`file ${n}.png`, `duration ${((shown[n + 1]?.tick ?? ticks) - tick) / fps}`)
  }
  list.push(`file ${shown.length - 1}.png`)
  await writeFile(join(dir, 'list.txt'), list.join('\n'))

  execFileSync('ffmpeg', [
    '-v', 'error', '-y', '-f', 'concat', '-i', join(dir, 'list.txt'),
    '-vf', `scale=${viewport.width}:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle`,
    '-loop', '0', out,
  ], { stdio: 'inherit' })
  console.log(`[readme-gif] ${out}: ${shown.length} frames, ${(ticks / fps).toFixed(1)}s, ${Math.round((await stat(out)).size / 1024)} KB`)
}
finally {
  await browser.close()
  await rm(dir, { recursive: true, force: true })
}
