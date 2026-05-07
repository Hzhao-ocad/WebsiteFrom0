import { client } from './sanityClient'

// --- Types ---

export interface SanityWork {
  _id: string
  title: string
  slug: { current: string }
  description: string
  coverImage: object
  previewVideoUrl?: string
  videoUrl?: string
  heroDescription?: string
  tags: string[]
  publishDate: string
  isFeatured: boolean
  collaborators?: { name: string; url?: string }[]
  body?: BodyBlock[]
}

export type BodyBlock =
  | { _type: 'block'; _key: string; style: string; children: { _key: string; text: string; marks: string[] }[]; markDefs: { _key: string; _type: string; href?: string }[] }
  | { _type: 'imageBlock'; _key: string; asset: object; caption?: string }
  | { _type: 'imageGallery'; _key: string; images: { _key: string; asset: object; caption?: string }[] }
  | { _type: 'videoEmbed'; _key: string; url: string }

// --- Queries ---

const workCardFields = `
  _id,
  title,
  slug,
  description,
  coverImage,
  "previewVideoUrl": previewVideo.asset->url,
  tags,
  publishDate,
  isFeatured
`

const workDetailFields = `
  ${workCardFields},
  videoUrl,
  heroDescription,
  collaborators,
  body[] {
    ...,
    _type == "imageBlock" => {
      ...,
      asset->
    },
    _type == "imageGallery" => {
      ...,
      images[] {
        ...,
        asset->
      }
    }
  }
`

export async function getAllWorks(): Promise<SanityWork[]> {
  return client.fetch(
    `*[_type == "work"] | order(publishDate desc) { ${workCardFields} }`
  )
}

export async function getWorkBySlug(slug: string): Promise<SanityWork | null> {
  return client.fetch(
    `*[_type == "work" && slug.current == $slug][0] { ${workDetailFields} }`,
    { slug }
  )
}

export async function getAllWorkSlugs(): Promise<{ slug: string }[]> {
  return client.fetch(
    `*[_type == "work"] { "slug": slug.current }`
  )
}

export async function getFeaturedWorks(): Promise<SanityWork[]> {
  return client.fetch(
    `*[_type == "work" && isFeatured == true] | order(publishDate desc) { ${workCardFields} }`
  )
}
