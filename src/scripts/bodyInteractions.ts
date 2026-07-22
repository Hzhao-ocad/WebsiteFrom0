// Gallery navigation + lightbox (wheel-zoom, drag-pan) for Portable Text bodies.
// Shared by work pages and notes posts. Safe to import on pages with no gallery.

export function initBodyInteractions() {
  document.querySelectorAll<HTMLElement>('.image-gallery').forEach((gallery) => {
    const slides = Array.from(gallery.querySelectorAll<HTMLElement>('.gallery-slide'))
    const counter = gallery.querySelector<HTMLElement>('.gallery-current')
    const prev = gallery.querySelector<HTMLButtonElement>('.gallery-prev')
    const next = gallery.querySelector<HTMLButtonElement>('.gallery-next')
    if (slides.length === 0) return
    let current = 0
    const show = (i: number) => {
      current = (i + slides.length) % slides.length
      slides.forEach((s, idx) => s.toggleAttribute('hidden', idx !== current))
      if (counter) counter.textContent = String(current + 1)
    }
    prev?.addEventListener('click', () => show(current - 1))
    next?.addEventListener('click', () => show(current + 1))
    gallery.tabIndex = 0
    gallery.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(current - 1)
      else if (e.key === 'ArrowRight') show(current + 1)
    })
  })

  const lightbox = document.getElementById('lightbox')
  const lightboxImg = lightbox?.querySelector<HTMLImageElement>('.lightbox-image')
  const closeBtn = lightbox?.querySelector<HTMLButtonElement>('.lightbox-close')
  if (!lightbox || !lightboxImg || !closeBtn) return

  const MIN_SCALE = 1
  const MAX_SCALE = 8
  let scale = 1
  let tx = 0
  let ty = 0
  let dragging = false
  let dragStartX = 0
  let dragStartY = 0
  let dragStartTx = 0
  let dragStartTy = 0

  const apply = () => {
    lightboxImg.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`
  }
  const reset = () => {
    scale = 1
    tx = 0
    ty = 0
    apply()
  }
  const open = (src: string, alt: string) => {
    lightboxImg.src = src
    lightboxImg.alt = alt
    reset()
    lightbox.removeAttribute('hidden')
    document.body.style.overflow = 'hidden'
  }
  const close = () => {
    lightbox.setAttribute('hidden', '')
    lightboxImg.src = ''
    document.body.style.overflow = ''
    reset()
  }

  document.querySelectorAll<HTMLElement>('.gallery-slide').forEach((slide) => {
    slide.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (target.closest('.gallery-btn')) return
      const img = slide.querySelector<HTMLImageElement>('img')
      if (img) open(img.src, img.alt)
    })
  })

  closeBtn.addEventListener('click', close)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || (e.target as HTMLElement).classList.contains('lightbox-stage')) close()
  })
  document.addEventListener('keydown', (e) => {
    if (lightbox.hasAttribute('hidden')) return
    if (e.key === 'Escape') close()
  })

  lightbox.addEventListener(
    'wheel',
    (e) => {
      if (lightbox.hasAttribute('hidden')) return
      e.preventDefault()
      const rect = lightboxImg.getBoundingClientRect()
      const cx = e.clientX - (rect.left + rect.width / 2)
      const cy = e.clientY - (rect.top + rect.height / 2)
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15
      const nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * factor))
      const ratio = nextScale / scale
      tx = cx - (cx - tx) * ratio
      ty = cy - (cy - ty) * ratio
      scale = nextScale
      if (scale === 1) {
        tx = 0
        ty = 0
      }
      apply()
    },
    { passive: false },
  )

  lightboxImg.addEventListener('mousedown', (e) => {
    if (scale === 1) return
    dragging = true
    dragStartX = e.clientX
    dragStartY = e.clientY
    dragStartTx = tx
    dragStartTy = ty
    lightboxImg.style.cursor = 'grabbing'
    e.preventDefault()
  })
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return
    tx = dragStartTx + (e.clientX - dragStartX)
    ty = dragStartTy + (e.clientY - dragStartY)
    apply()
  })
  window.addEventListener('mouseup', () => {
    dragging = false
    lightboxImg.style.cursor = ''
  })
}
