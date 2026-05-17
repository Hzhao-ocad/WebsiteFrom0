import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID,
  dataset: import.meta.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

// Reads drafts. Only safe to use server-side because it carries a token.
// SANITY_READ_TOKEN must be a Viewer-role token from sanity.io/manage.
export const previewClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID,
  dataset: import.meta.env.SANITY_DATASET ?? 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
  token: import.meta.env.SANITY_READ_TOKEN,
  perspective: 'drafts',
  stega: {
    enabled: true,
    studioUrl:
      import.meta.env.SANITY_STUDIO_URL ?? 'http://localhost:3333',
  },
})

const builder = imageUrlBuilder(client)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source)
}
