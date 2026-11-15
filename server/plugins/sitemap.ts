export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('sitemap:resolved', (ctx) => {
    const site = new URL(useSiteConfig(ctx.event).url)
    for (const entry of ctx.urls) {
      if (!entry.images) continue
      entry.images = entry.images.filter(image => new URL(image.loc, site).host === site.host)
      if (!entry.images.length) delete entry.images
    }
  })
})
