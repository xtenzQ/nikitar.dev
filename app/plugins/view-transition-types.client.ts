// Names the / ↔ /oss transitions so main.css can stage them; other routes keep the plain cross-fade
export default defineNuxtPlugin((nuxtApp) => {
  const page = (path: string) => path.replace(/\/+$/, '') || '/'
  let types: string[] = []

  useRouter().beforeEach((to, from) => {
    const route = `${page(from.path)} ${page(to.path)}`
    types = route === '/ /oss' ? ['oss-open'] : route === '/oss /' ? ['oss-close'] : []
  })

  nuxtApp.hook('page:view-transition:start', (transition) => {
    for (const type of types) transition.types?.add(type)
  })
})
