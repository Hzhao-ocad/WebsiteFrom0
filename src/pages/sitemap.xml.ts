import type { APIRoute } from 'astro'
import { client } from '../lib/sanityClient'
import { absoluteUrl } from '../lib/site'

// Rendered at build time (static output). Pulls slugs straight from Sanity so
// new works and notes appear in the sitemap automatically on the next build.

interface SitemapEntry {
  loc: string
  lastmod?: string
  changefreq?: string
  priority?: string
}

async function fetchSlugs(type: string, dateField: string): Promise<{ slug: string; date?: string }[]> {
  try {
    return await client.fetch(
      `*[_type == $type && defined(slug.current)]{ "slug": slug.current, "date": ${dateField} }`,
      { type },
    )
  } catch {
    // If the type doesn't exist yet (e.g. no posts published), don't fail the build.
    return []
  }
}

export const GET: APIRoute = async () => {
  const [works, posts] = await Promise.all([
    fetchSlugs('work', 'publishDate'),
    fetchSlugs('post', 'publishedAt'),
  ])

  const staticPages: SitemapEntry[] = [
    { loc: absoluteUrl('/'), changefreq: 'monthly', priority: '1.0' },
    { loc: absoluteUrl('/works'), changefreq: 'weekly', priority: '0.9' },
    { loc: absoluteUrl('/about'), changefreq: 'yearly', priority: '0.7' },
    { loc: absoluteUrl('/contact'), changefreq: 'yearly', priority: '0.5' },
    { loc: absoluteUrl('/notes'), changefreq: 'weekly', priority: '0.7' },
    { loc: absoluteUrl('/news'), changefreq: 'monthly', priority: '0.7' },
  ]

  const workPages: SitemapEntry[] = works.map((w) => ({
    loc: absoluteUrl(`/works/${w.slug}`),
    lastmod: w.date ? new Date(w.date).toISOString().slice(0, 10) : undefined,
    changefreq: 'monthly',
    priority: '0.8',
  }))

  const notePages: SitemapEntry[] = posts.map((p) => ({
    loc: absoluteUrl(`/notes/${p.slug}`),
    lastmod: p.date ? new Date(p.date).toISOString().slice(0, 10) : undefined,
    changefreq: 'monthly',
    priority: '0.6',
  }))

  const entries = [...staticPages, ...workPages, ...notePages]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''}${e.changefreq ? `\n    <changefreq>${e.changefreq}</changefreq>` : ''}${e.priority ? `\n    <priority>${e.priority}</priority>` : ''}
  </url>`,
  )
  .join('\n')}
</urlset>
`

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
