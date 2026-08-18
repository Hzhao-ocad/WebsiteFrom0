// Central site constants and SEO helpers.
// Keep the canonical host here so every absolute URL (canonical, OG, sitemap,
// JSON-LD) is built from a single source of truth.

export const SITE_URL = 'https://www.harryzhao.art'
export const SITE_NAME = 'Harry Zhao'

// Default social preview image (1200x630 hero still). Absolute URL required.
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.jpg`

// --- Social / profile URLs -------------------------------------------------
// TODO(owner): replace each empty string with your real, live profile URL.
// Only non-empty values are rendered as links and emitted into the Person
// JSON-LD `sameAs`. Empty values are intentionally omitted so we never ship
// dead links or pollute entity-disambiguation signals with bare domains.
export const SOCIAL_LINKS = {
  instagram: '', // TODO(owner): e.g. https://www.instagram.com/<handle>
  youtube: '', // TODO(owner): e.g. https://www.youtube.com/@<handle>
  tiktok: '', // TODO(owner): e.g. https://www.tiktok.com/@<handle>
  linkedin: '', // TODO(owner): e.g. https://www.linkedin.com/in/<handle>
  vimeo: '', // TODO(owner): e.g. https://vimeo.com/<handle>
  github: '', // TODO(owner): e.g. https://github.com/<handle>
} as const

// Ordered list of confirmed (non-empty) profile URLs for schema.org sameAs.
export const sameAs = Object.values(SOCIAL_LINKS).filter(Boolean)

/**
 * Build an absolute, canonical URL for a given path.
 * Normalizes to no trailing slash (except the root "/").
 */
export function absoluteUrl(pathname: string): string {
  const clean = '/' + String(pathname ?? '/').replace(/^\/+/, '').replace(/\/+$/, '')
  const path = clean === '/' ? '/' : clean
  return new URL(path, SITE_URL).href
}

/**
 * Convert a YouTube or Vimeo watch/share URL into its embeddable iframe URL.
 * Plain vimeo.com links (and youtube.com/watch links) refuse to load in an
 * iframe — Vimeo serves X-Frame-Options: sameorigin on the main site, so
 * embedding requires the dedicated player.vimeo.com/video/{id} URL.
 */
export function toEmbedUrl(url: string): string {
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  return url.replace('watch?v=', 'embed/')
}

/** Trim a string to ~maxLen chars on a word boundary for meta descriptions. */
export function truncate(text: string, maxLen = 155): string {
  const clean = (text ?? '').replace(/\s+/g, ' ').trim()
  if (clean.length <= maxLen) return clean
  const cut = clean.slice(0, maxLen)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\s]+$/, '') + '…'
}

// --- Person structured data (reused by JSON-LD blocks) ---------------------
export const PERSON_ID = `${SITE_URL}/#person`

export const personSchema = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Harry Zhao',
  url: SITE_URL,
  jobTitle: 'Artist & Researcher',
  description:
    'Toronto-based artist and researcher working in physical computing, robotics, interactive installation, and digital media; creator of the Iterative Creatures series.',
  knowsAbout: [
    'Physical Computing',
    'Robotics',
    'Interactive Installation',
    'Digital Media',
    'Human-Robot Interaction',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Toronto',
    addressRegion: 'ON',
    addressCountry: 'CA',
  },
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'School of the Art Institute of Chicago' },
    { '@type': 'CollegeOrUniversity', name: 'OCAD University' },
  ],
  ...(sameAs.length > 0 ? { sameAs } : {}),
}
