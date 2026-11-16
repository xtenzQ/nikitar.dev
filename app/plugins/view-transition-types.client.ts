// Names the / ↔ /oss, / ↔ /photos, and into/out of /cv transitions so main.css can stage them; other routes keep the plain cross-fade
export default defineNuxtPlugin((nuxtApp) => {
  const page = (path: string) => path.replace(/\/+$/, '') || '/'
  let types: string[] = []

  useRouter().beforeEach((to, from) => {
    const [a, b] = [page(from.path), page(to.path)]
    if (b === '/cv' && a !== b) types = ['cv-open']
    else if (a === '/cv' && a !== b) types = ['cv-close']
    else if (a === '/' && b === '/oss') types = ['oss-open']
    else if (a === '/oss' && b === '/') types = ['oss-close']
    else if (a === '/' && b === '/photos') types = ['photos-open']
    else if (a === '/photos' && b === '/') types = ['photos-close']
    else types = []
  })

  nuxtApp.hook('page:view-transition:start', (transition) => {
    for (const type of types) transition.types?.add(type)
  })
})
