export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  function copyToClipboard(text: string): Promise<void> {
    if (navigator.clipboard?.writeText) {
      // Race clipboard API with a timeout — if it doesn't resolve in 200ms, use fallback
      const clipboardPromise = navigator.clipboard.writeText(text)
      const timeout = new Promise<void>((_, reject) => setTimeout(() => reject(), 200))
      return Promise.race([clipboardPromise, timeout]).catch(() => fallbackCopy(text))
    }
    return fallbackCopy(text)
  }

  function fallbackCopy(text: string): Promise<void> {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    return Promise.resolve()
  }

  function showCopied(el: Element) {
    el.classList.add('copied')
    el.setAttribute('aria-label', 'Copied!')
    setTimeout(() => {
      el.classList.remove('copied')
      el.setAttribute('aria-label', 'Copy code')
    }, 2000)
  }

  const setupInteractions = () => {
    // Copy code button
    document.querySelectorAll('.copy-code-button').forEach((btn) => {
      if ((btn as HTMLElement).dataset.bound) return
      ;(btn as HTMLElement).dataset.bound = '1'

      btn.addEventListener('click', () => {
        const wrapper = btn.closest('.code-block-wrapper')
        const pre = wrapper?.querySelector('pre')
        const text = pre?.textContent || ''
        if (!text) return
        copyToClipboard(text).then(() => showCopied(btn))
      })
    })

    // Heading anchor copy
    document.querySelectorAll('.heading-anchor .anchor-link').forEach((link) => {
      if ((link as HTMLElement).dataset.bound) return
      ;(link as HTMLElement).dataset.bound = '1'

      link.addEventListener('click', (e) => {
        e.preventDefault()
        const href = link.getAttribute('href') || ''
        const url = `${window.location.origin}${window.location.pathname}${href}`
        copyToClipboard(url)
        history.pushState(null, '', href)
      })
    })
  }

  const nuxtApp = useNuxtApp()
  nuxtApp.hook('page:finish', () => {
    nextTick(setupInteractions)
  })
  nuxtApp.hook('app:mounted', () => {
    nextTick(setupInteractions)
  })
})
