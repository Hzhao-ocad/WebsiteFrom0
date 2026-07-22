import { toHTML } from '@portabletext/to-html'
import { stegaClean } from '@sanity/client/stega'
import { urlFor } from './sanityClient'
import type { BodyBlock } from './queries'

// Shared Portable Text -> HTML renderer used by both work pages and notes.
// The CSS that styles the output lives in the pages that render `.body-content`.

const buildBlockClassFromStyle = (style: string, extraClasses: string[] = []) => {
  const align = style.includes('-') ? style.split('-')[1] : 'left'
  return ['body-text', `align-${align}`, ...extraClasses].filter(Boolean).join(' ')
}

const blockComponents: Record<string, ({ children }: { children?: string }) => string> = {}

const addBlockStyle = (style: string, tag: string, extraClasses: string[] = []) => {
  blockComponents[style] = ({ children }) =>
    `<${tag} class="${buildBlockClassFromStyle(style, extraClasses)}">${children ?? ''}</${tag}>`
}

const sizes = ['normal', 'small', 'h1', 'h2', 'h3', 'h4'] as const
const aligns = ['left', 'center', 'right'] as const
const tagForSize: Record<(typeof sizes)[number], string> = {
  normal: 'p',
  small: 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
}

sizes.forEach((size) => {
  addBlockStyle(size, tagForSize[size], size === 'small' ? ['text-small'] : [])
  aligns
    .filter((align) => align !== 'left')
    .forEach((align) => {
      addBlockStyle(`${size}-${align}`, tagForSize[size], size === 'small' ? ['text-small'] : [])
    })
})

addBlockStyle('blockquote', 'blockquote', ['body-quote'])

export interface RenderBodyOptions {
  /** Fallback alt text / iframe title when a block has no caption. */
  title: string
}

/** Render a Portable Text body array to the same HTML structure used site-wide. */
export function renderBody(body: BodyBlock[] | undefined, opts: RenderBodyOptions): string {
  if (!body) return ''
  const title = opts.title
  return toHTML(body as any, {
    components: {
      types: {
        imageBlock: ({ value }: { value: any }) => {
          if (!value.asset) return ''
          const widthOption = (value.width as string) ?? 'text'
          const customWidth = (value.customWidth as string | undefined)?.trim()
          const renderWidth =
            ({
              small: 600,
              text: 1000,
              medium: 1300,
              large: 1800,
              full: 2400,
              custom: 2400,
            } as Record<string, number>)[widthOption] ?? 1000
          const customStyle =
            widthOption === 'custom' && customWidth
              ? ` style="--custom-image-width: ${customWidth};"`
              : ''
          const src = value.asset.url
            ? `${value.asset.url}?w=${renderWidth}&auto=format`
            : value.asset._ref
              ? urlFor(value).width(renderWidth).url()
              : null
          if (!src) return ''
          const alt = value.caption ?? title
          const caption = value.caption
            ? `<figcaption class="image-caption">${value.caption}</figcaption>`
            : ''
          return `<section class="fullwidth-image-section image-width-${widthOption}"${customStyle}><figure><img src="${src}" alt="${alt}" class="fullwidth-image" loading="lazy" decoding="async" />${caption}</figure></section>`
        },
        imageGallery: ({ value }: { value: any }) => {
          const images = (value.images ?? []).filter((img: any) => img?.asset)
          if (images.length === 0) return ''
          const slides = images
            .map((img: any, i: number) => {
              const src = img.asset.url
                ? `${img.asset.url}?w=1600&auto=format`
                : img.asset._ref
                  ? urlFor(img).width(1600).url()
                  : null
              if (!src) return ''
              const alt = img.caption ?? `${title} - image ${i + 1}`
              const caption = img.caption
                ? `<figcaption class="image-caption">${img.caption}</figcaption>`
                : ''
              return `<figure class="gallery-slide" data-index="${i}"${i === 0 ? '' : ' hidden'}><img src="${src}" alt="${alt}" class="fullwidth-image" loading="lazy" decoding="async" />${caption}</figure>`
            })
            .join('')
          return `<section class="fullwidth-image-section gallery-section"><div class="image-gallery" data-count="${images.length}">
            <button type="button" class="gallery-btn gallery-prev" aria-label="Previous image">&#8592;</button>
            <div class="gallery-slides">${slides}</div>
            <button type="button" class="gallery-btn gallery-next" aria-label="Next image">&#8594;</button>
            <div class="gallery-counter"><span class="gallery-current">1</span> / ${images.length}</div>
          </div></section>`
        },
        videoEmbed: ({ value }: { value: any }) => {
          const cleanUrl = stegaClean(value.url as string)
          const embedUrl = cleanUrl.replace('watch?v=', 'embed/')
          return `<section class="body-video-section"><div class="video-wrapper"><iframe src="${embedUrl}" title="${title}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></section>`
        },
      },
      block: blockComponents,
      listItem: ({ children, value }: { children?: string; value?: any }) => {
        const level = Number(value?.level) || 1
        return `<li data-level="${level}">${children ?? ''}</li>`
      },
      marks: {
        link: ({ children, value }: { children: string; value?: any }) =>
          `<a href="${stegaClean(value?.href ?? '')}" target="_blank" rel="noopener noreferrer">${children}</a>`,
      },
    },
  })
}
